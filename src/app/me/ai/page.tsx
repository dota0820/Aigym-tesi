"use client";
import { useEffect, useState } from "react";
import { Card, input, SubPage } from "@/components/ui";
import { AI_MODELS } from "@/lib/models";
import { setAiModel, setOpenRouterKey, useApp, useHydrated } from "@/lib/store";

interface ServerConfig {
  provider: "openrouter" | "anthropic" | "none";
  defaultModel: string | null;
}

export default function MeAiPage() {
  const { aiModel, openRouterKey, profile } = useApp();
  const ready = useHydrated();
  const [cfg, setCfg] = useState<ServerConfig | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j) setCfg(j);
      })
      .catch(() => {});
  }, []);

  if (!ready) return null;

  const passLooksLikeKey = profile.passcode.trim().startsWith("sk-or-");
  const effectiveLocalKey = openRouterKey.trim() || (passLooksLikeKey ? profile.passcode.trim() : "");
  const hasAnyKey = cfg?.provider === "openrouter" || cfg?.provider === "anthropic" || !!effectiveLocalKey;
  const disabled = cfg?.provider === "anthropic" && !effectiveLocalKey;

  return (
    <SubPage title="AI 模型与 Key">
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold">OpenRouter API Key</div>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              hasAnyKey ? "bg-mint-soft text-mint" : "bg-red-50 text-red-600"
            }`}
          >
            {cfg?.provider === "openrouter"
              ? "服务器已配置"
              : effectiveLocalKey
                ? "本机已填写"
                : "未配置"}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-sub">
          {cfg?.provider === "openrouter"
            ? "服务器已配置 OPENROUTER_API_KEY，可直接使用；也可在下方填入你自己的 Key 覆盖。"
            : "把你的 OpenRouter Key（sk-or-v1-...）粘贴在下方即可立即使用，仅保存在这台手机浏览器里。（如果在 Vercel 后台填了环境变量，需在 Vercel 点 Redeploy 才会生效）"}
        </p>

        <div className="flex gap-2">
          <input
            className={`${input} flex-1 font-mono text-xs`}
            type={showKey ? "text" : "password"}
            placeholder="sk-or-v1-..."
            value={effectiveLocalKey}
            onChange={(e) => setOpenRouterKey(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="shrink-0 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-sub"
          >
            {showKey ? "隐藏" : "显示"}
          </button>
        </div>
      </Card>

      {disabled && (
        <div className="rounded-2xl border border-line bg-bg px-4 py-3 text-sm text-sub">
          当前直连 Claude，填写上方 OpenRouter Key 或在 Vercel 配置 OPENROUTER_API_KEY 后即可切换模型。
        </div>
      )}

      <Card className={`divide-y divide-line overflow-hidden p-0 ${disabled ? "opacity-50" : ""}`}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setAiModel("")}
          className="flex w-full items-start gap-3 px-4 py-3.5 text-left active:bg-bg disabled:cursor-not-allowed"
        >
          <span className="mt-0.5 text-base">{aiModel === "" ? "◉" : "○"}</span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold">
              默认推荐
              {cfg?.defaultModel ? ` (${cfg.defaultModel})` : " (google/gemini-2.5-flash)"}
            </div>
            <div className="text-xs text-sub">跟随默认配置</div>
          </div>
        </button>

        {AI_MODELS.map((m) => {
          const active = aiModel === m.id;
          return (
            <button
              key={m.id}
              type="button"
              disabled={disabled}
              onClick={() => setAiModel(m.id)}
              className="flex w-full items-start gap-3 px-4 py-3.5 text-left active:bg-bg disabled:cursor-not-allowed"
            >
              <span className={`mt-0.5 text-base ${active ? "text-primary" : "text-sub"}`}>
                {active ? "◉" : "○"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{m.label}</div>
                <div className="text-xs text-sub">{m.note}</div>
              </div>
            </button>
          );
        })}
      </Card>

      <p className="px-1 text-xs leading-relaxed text-sub">
        所有 AI 功能（教练、饮食分析、器械识别、导入动作）都会使用这里选中的模型。
      </p>
    </SubPage>
  );
}
