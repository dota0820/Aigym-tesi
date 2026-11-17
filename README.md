# 练练 · AI 健身教练

给健身新手的手机网页 App(PWA):AI 教练安排每次训练、把动作教到能照着做、记录每一次并和上次对比,还有 AI 营养师帮你分析每天饮食的蛋白质、碳水与热量。

## 功能

- **AI 动作侦探 (Movement Detective)** — 新手专属生物力学排查与动作矫正引擎：一次只问 1 个关键问题锁定代偿原因、12 种日常身体部位描述翻译为可能肌群、置信度分级分析、左右不对称评估、支持上传照片或视频（自动抽取 4 帧连续动作序列）视觉评估、7 级安全/疼痛警示，以及 32 个核心动作的发力教育库；全局支持中文 / English 一键切换。
- **今天** — 点一个部位(背/胸/腿/臀…),教练根据你的资料和历史记录排好动作、组数、重量。
- **AI 教练** — 随时聊天:问动作、聊下次练什么、口述训练/饮食让它帮你记录;它会记住伤病和偏好。
- **训练中** — 每个动作默认展示大尺寸示范动图(点击可暂停对比起始/终点)、详细做法(器械怎么调、坐哪里、拉到哪里、哪里该酸)、上次表现和组间休息倒计时。
- **记录** — 每次训练的明细,每个动作和上一次的对比;一键让教练点评。
- **饮食营养师** — 拍食物照片或语音/文字描述吃了什么,AI 自动估算热量、蛋白质、碳水、脂肪并给出建议,支持核对微调后按天记录。
- **手表数据** — 上传荣耀/华为运动健康、Apple Watch 等的运动截图,AI 自动读出时长、卡路里、心率;也可手填。
- **动作库 & 视频导入** — 内置 45 个新手常用动作(动图示范 + 目标肌肉图 + 详细步骤),并支持直接粘贴 YouTube / 小红书 / Facebook 视频链接或分享文案(可附截图)导入自定义动作库。
- **器械快捷录入** — 在「我的」里支持场景一键预设、分类点选健身房器械,以及拍健身房照片由 AI 自动识别勾选。

数据保存在手机浏览器本地(「我的」页可导出/导入备份)。

## 本地运行

```bash
cp .env.example .env.local   # 填入 OPENROUTER_API_KEY 或 ANTHROPIC_API_KEY
npm install
npm run dev                  # http://localhost:3000
```

## 部署(Vercel)

1. 在 vercel.com 导入这个 GitHub 仓库。
2. 在 Environment Variables 里添加 `OPENROUTER_API_KEY`(或 `ANTHROPIC_API_KEY`),建议同时设置 `APP_PASSCODE`。用 OpenRouter 时默认使用 `google/gemini-2.5-flash`(识图/算营养/解析链接性价比高且速度快),也可以通过 `OPENROUTER_MODEL` 换成 `anthropic/claude-sonnet-5.5` 等模型,并用 `OPENROUTER_VISION_MODEL` 单独指定识图/解析模型。
3. 部署后用手机打开网址 →「添加到主屏幕」,在「我的」页填入口令。

## 代码结构

- `src/lib/exercises.ts`, `src/lib/exercise-lookup.ts` — 内置与自定义动作库
- `src/lib/equipment.ts` — 健身房器械预设与分类
- `src/lib/nutrition.ts` — 每日营养目标与餐食计算
- `src/lib/link-extract.ts` — 视频/网页链接元数据抓取
- `src/lib/coach-prompt.ts` — 教练的系统提示词
- `src/lib/movement-detective.ts` — AI 动作侦探系统提示词、日常部位映射、疼痛安全分级与 32 动作生物力学库
- `src/app/detective/page.tsx` — AI 动作侦探页面（互动问诊 / 视觉分析 / 部位与 32 动作百科）
- `src/app/api/detective/route.ts` — AI 动作侦探流式诊断接口
- `src/app/api/chat/route.ts` — AI 教练(工具:保存计划 / 记录训练 / 记录饮食 / 记住信息)
- `src/app/api/nutrition/route.ts` — AI 食物营养分析
- `src/app/api/equipment/route.ts` — AI 拍照识别器械
- `src/app/api/exercise-import/route.ts` — AI 从视频链接/截图提取动作卡
- `src/app/api/watch/route.ts` — 手表截图识别
- `src/lib/openrouter.ts`, `src/lib/ai-structured.ts` — OpenRouter 与 Anthropic 统一接入
- `src/lib/store.ts`, `src/lib/actions.ts` — 本地数据与聊天逻辑

## 素材来源

- 动作示范照片:[free-exercise-db](https://github.com/yuhonas/free-exercise-db)(公共领域 / Unlicense),放在 `public/exercises/`。
- 肌肉示意图:[react-body-highlighter](https://github.com/giavinh79/react-body-highlighter)(MIT)。
