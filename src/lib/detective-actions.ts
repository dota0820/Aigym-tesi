"use client";
import { useSyncExternalStore } from "react";
import { fileToJpegDataUrl, visibleText } from "./actions";
import { formatGymsContext } from "./equipment";
import { aiHeaders, getState, historyForCoach, setStateForProfile, uid } from "./store";
import type { ChatMsg, Lang } from "./types";

let detectiveBusy = false;
const busyListeners = new Set<() => void>();
function setBusy(b: boolean) {
  detectiveBusy = b;
  busyListeners.forEach((l) => l());
}

export function useDetectiveBusy() {
  return useSyncExternalStore(
    (l) => {
      busyListeners.add(l);
      return () => busyListeners.delete(l);
    },
    () => detectiveBusy,
    () => false,
  );
}

const CHOICES_RE = /<choices>([\s\S]*?)<\/choices>/gi;

function extractChoices(raw: string): string[] {
  const all = [...raw.matchAll(CHOICES_RE)];
  const last = all[all.length - 1];
  if (!last) return [];
  return last[1]
    .split(/[|｜\n]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function buildDetectiveContext(): string {
  const s = getState();
  const p = s.profile;
  const genderLabel = p.gender === "male" ? "Male / 男" : p.gender === "female" ? "Female / 女" : "(unspecified)";
  return [
    `## Current User Profile: ${p.avatar || "🙂"} ${p.name || "User"} (UI Language: ${s.lang})`,
    `Gender / Age: ${genderLabel} / ${p.age || "?"}`,
    `Experience Level: ${p.level || "Beginner"}`,
    `Goal: ${p.goal || "(unspecified)"}`,
    `Height / Weight: ${p.heightCm || "?"} cm / ${p.weightKg || "?"} kg`,
    `Known Injuries / Sensitivities: ${p.injuries || "(none recorded)"}`,
    `Gym Setup:\n${formatGymsContext(p)}`,
    `Coach Memory:\n${p.memory.length ? p.memory.map((m) => `- ${m}`).join("\n") : "(none)"}`,
    `Recent Workouts:\n${historyForCoach(s.workouts, 5)}`,
  ].join("\n\n");
}

function historyForApi(chat: ChatMsg[]) {
  const msgs = chat
    .slice(-20)
    .map((m) => {
      let text = m.text.trim();
      if (m.image !== undefined) {
        text += "\n[User attached an exercise photo or 4-frame video sequence strip in this message]";
      }
      return { role: m.role, text: text.trim() };
    })
    .filter((m) => m.text);
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  return msgs;
}

const MAX_THUMBS = 6;

export async function sendToDetective(
  text: string,
  opts?: {
    photo?: { full: string; thumb: string };
    lang?: Lang;
    mode?: "investigate" | "visual";
  },
) {
  const s = getState();
  const lang = opts?.lang ?? s.lang;
  const cleanText =
    text.trim() ||
    (opts?.photo
      ? lang === "en"
        ? "Please analyze my form/setup in this photo or video sequence."
        : "请帮我分析这张动作照片或视频分解帧的发力、姿势和器械设置。"
      : "");

  if (!cleanText || detectiveBusy) return;

  const targetProfileId = s.activeProfileId;
  setBusy(true);
  const ts = new Date().toISOString();
  const aid = uid();

  const patchTargetMsg = (fn: (m: ChatMsg) => ChatMsg) =>
    setStateForProfile(targetProfileId, (ws) => ({
      ...ws,
      detectiveChat: (ws.detectiveChat ?? []).map((m) => (m.id === aid ? fn(m) : m)),
    }));

  const context = buildDetectiveContext();

  setStateForProfile(targetProfileId, (ws) => ({
    ...ws,
    detectiveChat: [
      ...(ws.detectiveChat ?? []),
      { id: uid(), role: "user", text: cleanText, ts, image: opts?.photo?.thumb },
      { id: aid, role: "assistant", text: "", ts },
    ],
  }));

  if (opts?.photo) {
    setStateForProfile(targetProfileId, (ws) => {
      let kept = 0;
      const list = [...(ws.detectiveChat ?? [])].reverse().map((m) => {
        if (!m.image) return m;
        kept++;
        return kept > MAX_THUMBS ? { ...m, image: "" } : m;
      });
      return { ...ws, detectiveChat: list.reverse() };
    });
  }

  const fail = (msg: string) =>
    patchTargetMsg((m) => ({ ...m, text: (m.text ? m.text + "\n\n" : "") + `⚠️ ${msg}` }));

  try {
    const latest = getState();
    const targetWs = latest.profiles.find((p) => p.profile.id === targetProfileId);
    const chatSnapshot = (targetWs ? targetWs.detectiveChat : latest.detectiveChat) ?? [];

    const res = await fetch("/api/detective", {
      method: "POST",
      headers: aiHeaders(),
      body: JSON.stringify({
        messages: historyForApi(chatSnapshot.filter((m) => m.id !== aid)),
        context,
        lang,
        mode: opts?.mode ?? "investigate",
        image: opts?.photo?.full,
      }),
    });

    if (!res.ok || !res.body) {
      const j = await res.json().catch(() => null);
      fail(j?.error ?? `Request failed (${res.status})`);
      return;
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";

    const handle = (line: string) => {
      if (!line.trim()) return;
      const ev = JSON.parse(line);
      if (ev.type === "text") {
        patchTargetMsg((m) => ({ ...m, text: m.text + ev.text }));
      } else if (ev.type === "error") {
        fail(ev.error);
      }
    };

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        handle(buf.slice(0, i));
        buf = buf.slice(i + 1);
      }
    }
    handle(buf);
  } catch {
    fail(
      lang === "en"
        ? "Network connection interrupted. Please try sending again."
        : "网络连接中断，请再发送一次。",
    );
  } finally {
    patchTargetMsg((m) => {
      const choices = extractChoices(m.text);
      return {
        ...m,
        choices: choices.length ? choices : undefined,
        text:
          visibleText(m.text) ||
          (lang === "en"
            ? "⚠️ Movement Detective did not return a response. Please try again."
            : "⚠️ 动作侦探没有收到回复，请重试。"),
      };
    });
    setBusy(false);
  }
}

/**
 * Extracts 4 evenly-spaced frames from an uploaded workout video file
 * and combines them into a labeled 2x2 sequence JPEG for visual movement analysis.
 */
export async function mediaFileToVisualStrip(
  file: File,
): Promise<{ full: string; thumb: string; isVideo: boolean }> {
  if (!file.type.startsWith("video/")) {
    const [full, thumb] = await Promise.all([
      fileToJpegDataUrl(file, 1568),
      fileToJpegDataUrl(file, 420),
    ]);
    return { full, thumb, isVideo: false };
  }

  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("Video load error"));
    });

    const dur = Number.isFinite(video.duration) && video.duration > 0.2 ? video.duration : 2;
    const fractions = [0.15, 0.4, 0.65, 0.85];
    const labels = ["1. START", "2. MID", "3. PEAK", "4. END"];

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    const cellW = 480;
    const cellH = Math.max(240, Math.min(640, Math.round((vh / vw) * cellW)));

    const canvas = document.createElement("canvas");
    canvas.width = cellW * 2;
    canvas.height = cellH * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#111116";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let idx = 0; idx < fractions.length; idx++) {
      const targetTime = Math.min(dur - 0.05, Math.max(0.05, dur * fractions[idx]));
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };
        video.addEventListener("seeked", onSeeked);
        video.currentTime = targetTime;
        setTimeout(resolve, 600);
      });

      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col * cellW;
      const y = row * cellH;
      ctx.drawImage(video, x, y, cellW, cellH);

      ctx.fillStyle = "rgba(0,0,0,0.68)";
      ctx.fillRect(x + 8, y + 8, 128, 28);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(labels[idx], x + 16, y + 27);
    }

    const full = canvas.toDataURL("image/jpeg", 0.84);
    const thumbCanvas = document.createElement("canvas");
    thumbCanvas.width = 480;
    thumbCanvas.height = Math.round((canvas.height / canvas.width) * 480);
    thumbCanvas.getContext("2d")!.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
    const thumb = thumbCanvas.toDataURL("image/jpeg", 0.78);

    return { full, thumb, isVideo: true };
  } finally {
    URL.revokeObjectURL(url);
  }
}
