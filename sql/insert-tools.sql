-- AI 工具集 · 一次性导入 SQL（logo_url / cover_url 待手动补充）
-- 执行前请确认 categories 表已创建
-- ON CONFLICT (slug) DO NOTHING 保证重复执行安全

BEGIN;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'wawa-write',
  '蛙蛙写作',
  'AI 小说与内容创作工具，支持长篇续写',
  'https://wawa-write.example.com',
  'writing',
  '["小说","长文"]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'xunfei-huiwen',
  '讯飞绘文',
  'AI 批量原创，多平台矩阵分发',
  'https://xunfei-huiwen.example.com',
  'writing',
  '["自媒体"]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'laper',
  'Laper',
  'AI 原生剧本创作工具，分镜与台词一体',
  'https://laper.example.com',
  'writing',
  '["剧本"]'::jsonb,
  false,
  true,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'biling-write',
  '笔灵AI写作',
  '600+ 写作模板，覆盖公文与职场场景',
  'https://biling-write.example.com',
  'writing',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'bangong-xiaowan',
  '办公小浣熊',
  '文案生成、AI 知识库创作助手',
  'https://bangong-xiaowan.example.com',
  'writing',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'gaoding-copy',
  '稿定AI文案',
  '小红书、公众号、短视频文案一键出稿',
  'https://gaoding-copy.example.com',
  'writing',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'qianbi-paper',
  '千笔AI论文',
  '全网首家论文无限改稿与润色',
  'https://qianbi-paper.example.com',
  'writing',
  '["论文"]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'qinyan-academic',
  '沁言学术',
  'AI 科研写作平台，一站式文献综述',
  'https://qinyan-academic.example.com',
  'writing',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'huiwa-ai',
  '绘蛙AI',
  'AI 电商营销工具，免费商品图与模特图',
  'https://huiwa-ai.example.com',
  'image',
  '["电商"]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'meitu-studio',
  '美图设计室',
  'AI 图像创作和设计平台',
  'https://meitu-studio.example.com',
  'image',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'jimeng-image',
  '即梦图像',
  '中文语义理解出色的文生图模型',
  'https://jimeng-image.example.com',
  'image',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'liblib-art',
  'LiblibAI',
  '国内活跃的模型分享与在线生图社区',
  'https://liblib-art.example.com',
  'image',
  '["模型"]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'remove-bg-pro',
  '智能抠图 Pro',
  '发丝级抠图与批量背景替换',
  'https://remove-bg-pro.example.com',
  'image',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'upscayl-cloud',
  '画质放大云',
  '老照片修复与 4K 无损放大',
  'https://upscayl-cloud.example.com',
  'image',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'libtv',
  'LibTV',
  '专业 AI 视频创作平台，模板化成片',
  'https://libtv.example.com',
  'video',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'duiyou-agent',
  '堆友Agent',
  '全能 AI 图像视频创作智能体',
  'https://duiyou-agent.example.com',
  'video',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'seko',
  'Seko',
  '首个创编一体的 AI 视频工作台',
  'https://seko.example.com',
  'video',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'updream',
  'updream',
  '专业级一站式 AI 视频生产工具',
  'https://updream.example.com',
  'video',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'lumina-video',
  'Lumina',
  '字节跳动旗下 AI 视频生成实验产品',
  'https://lumina-video.example.com',
  'video',
  '[]'::jsonb,
  false,
  true,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'shubo-human',
  '数播数字人',
  '口播视频克隆与多语种配音',
  'https://shubo-human.example.com',
  'video',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'aippt',
  'AiPPT',
  'AI 快速生成高质量 PPT',
  'https://aippt.example.com',
  'office',
  '["PPT"]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'miaoda',
  '秒哒',
  '无代码 AI 应用开发平台',
  'https://miaoda.example.com',
  'office',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'bangong-raccoon',
  '办公小浣熊 Pro',
  '专业 AI 办公智能体，表格与文档',
  'https://bangong-raccoon.example.com',
  'office',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'nami-work',
  '纳米Work',
  '360 旗下纳米团队推出的办公协作 AI',
  'https://nami-work.example.com',
  'office',
  '[]'::jsonb,
  false,
  true,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'daima-agent',
  '袋马',
  '高德推出的 AI 应用生成器',
  'https://daima-agent.example.com',
  'office',
  '[]'::jsonb,
  false,
  true,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'meeting-note',
  '会记本',
  '实时转写会议记录并输出待办',
  'https://meeting-note.example.com',
  'office',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'doubao',
  '豆包',
  '智能对话助手，办公与生活全场景',
  'https://doubao.example.com',
  'chat',
  '["大模型"]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'kimi-chat',
  'Kimi',
  '超长上下文阅读与资料问答',
  'https://kimi-chat.example.com',
  'chat',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'yuanbao',
  '元宝',
  '接入多模型的通用 AI 助手',
  'https://yuanbao.example.com',
  'chat',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'zhipu-chat',
  '智谱清言',
  '国产自研通用对话模型',
  'https://zhipu-chat.example.com',
  'chat',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'tongyi-chat',
  '通义千问',
  '多模态对话与文档解析',
  'https://tongyi-chat.example.com',
  'chat',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'loomy',
  'Loomy',
  '科大讯飞推出的桌面智能体',
  'https://loomy.example.com',
  'agent',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'astraflow',
  'AstraFlow星图',
  '开发者专属一站式 Agent 编排平台',
  'https://astraflow.example.com',
  'agent',
  '[]'::jsonb,
  false,
  true,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'sophclaw',
  'Sophclaw',
  'Sophnet 算能云算力智能体',
  'https://sophclaw.example.com',
  'agent',
  '[]'::jsonb,
  false,
  true,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'flowith',
  'Flowith',
  '画布式多线程 Agent 工作台',
  'https://flowith.example.com',
  'agent',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'manus-like',
  '任务猿',
  '自动拆解目标并执行的通用 Agent',
  'https://manus-like.example.com',
  'agent',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'trae-ide',
  'Trae',
  'AI 原生 IDE，中文场景优化',
  'https://trae-ide.example.com',
  'coding',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'comate',
  '文心快码',
  '代码补全、注释与单测生成',
  'https://comate.example.com',
  'coding',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'tongyi-lingma',
  '通义灵码',
  '智能编码助手，支持仓库级问答',
  'https://tongyi-lingma.example.com',
  'coding',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'codereview-ai',
  '码评AI',
  '自动化 Code Review 与规范检查',
  'https://codereview-ai.example.com',
  'coding',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'sqlbot',
  'SQLBot',
  '自然语言转 SQL 与数据分析',
  'https://sqlbot.example.com',
  'coding',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'bailian',
  '百炼平台',
  '模型服务、微调与应用编排一体',
  'https://bailian.example.com',
  'platform',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'coze-studio',
  '扣子',
  '零代码搭建 AI Bot 与工作流',
  'https://coze-studio.example.com',
  'platform',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'modelscope-hub',
  '魔搭社区',
  '中文模型开源社区与在线推理',
  'https://modelscope-hub.example.com',
  'platform',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'siliconflow',
  '硅基流动',
  '高性价比大模型推理 API',
  'https://siliconflow.example.com',
  'platform',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'bufan-resume',
  '不繁简历',
  'AI 原生简历编辑器，一键适配 JD',
  'https://bufan-resume.example.com',
  'platform',
  '[]'::jsonb,
  false,
  true,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'motiff-ai',
  'Motiff 妙多',
  'AI 驱动的专业 UI 设计工具',
  'https://motiff-ai.example.com',
  'design',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'gaoding-design',
  '稿定设计',
  '海报、电商图模板与智能改图',
  'https://gaoding-design.example.com',
  'design',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'meishe-3d',
  '妙生3D',
  'AI 生成可编辑 3D 模型与材质',
  'https://meishe-3d.example.com',
  'design',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'logo-forge',
  'LogoForge',
  '品牌 Logo 与 VI 系统生成',
  'https://logo-forge.example.com',
  'design',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'canvas-ai',
  '画布智绘',
  '智能排版与配色建议',
  'https://canvas-ai.example.com',
  'design',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'reecho',
  'Reecho 睿声',
  '超拟真中文语音克隆',
  'https://reecho.example.com',
  'audio',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'tianyin-music',
  '天音音乐',
  '一句话生成完整编曲与歌声',
  'https://tianyin-music.example.com',
  'audio',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'audio-clean',
  '静音师',
  'AI 降噪、去混响与人声分离',
  'https://audio-clean.example.com',
  'audio',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'podcast-ai',
  '播客工坊',
  '文稿转播客，多角色对话音频',
  'https://podcast-ai.example.com',
  'audio',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'metaso',
  '秘塔AI搜索',
  '最好用的 AI 搜索工具，无广告',
  'https://metaso.example.com',
  'search',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'zhida',
  '知搭搜索',
  '知乎生态的生成式搜索',
  'https://zhida.example.com',
  'search',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'deepsearch-cn',
  '深研搜索',
  '研究型长报告搜索与引用溯源',
  'https://deepsearch-cn.example.com',
  'search',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'scholar-find',
  '学术寻源',
  '中英文文献检索与综述生成',
  'https://scholar-find.example.com',
  'search',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'ai-course-hub',
  'AI 学堂',
  '系统化大模型课程与实战项目',
  'https://ai-course-hub.example.com',
  'learn',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'prompt-school',
  '提示词学院',
  '从入门到进阶的提示词工程教程',
  'https://prompt-school.example.com',
  'learn',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'paper-daily',
  '论文日报',
  '每日精选 AI 论文中文解读',
  'https://paper-daily.example.com',
  'learn',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'devdocs-cn',
  'AI 开发文档站',
  '主流模型 API 中文文档聚合',
  'https://devdocs-cn.example.com',
  'learn',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'aigc-check',
  'AIGC 检测通',
  '论文与文案 AI 率检测报告',
  'https://aigc-check.example.com',
  'detect',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'paper-dup',
  '查重助手',
  '多库比对查重与降重建议',
  'https://paper-dup.example.com',
  'detect',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'img-forensic',
  '图像鉴伪',
  '识别 AI 生成图片与深度伪造',
  'https://img-forensic.example.com',
  'detect',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'voice-guard',
  '声纹卫士',
  '语音伪造与克隆检测',
  'https://voice-guard.example.com',
  'detect',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'prompt-market',
  '提示词市集',
  '海量可复用的中文提示词模板',
  'https://prompt-market.example.com',
  'prompt',
  '[]'::jsonb,
  true,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'prompt-lab',
  '提示实验室',
  '多模型对比与提示词调优',
  'https://prompt-lab.example.com',
  'prompt',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'sys-prompt-cn',
  '系统提示库',
  '优秀产品的系统提示词拆解',
  'https://sys-prompt-cn.example.com',
  'prompt',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (slug, name, summary, url, category_id, tags, hot, new, logo_url, cover_url, content, qa, submitted_by) VALUES (
  'image-prompt',
  '绘图咒语站',
  '文生图关键词与风格词典',
  'https://image-prompt.example.com',
  'prompt',
  '[]'::jsonb,
  false,
  false,
  '',
  '',
  '[]'::jsonb,
  '[]'::jsonb,
  NULL
) ON CONFLICT (slug) DO NOTHING;

COMMIT;