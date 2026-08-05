export type Category = {
  slug: string
  name: string
  icon: string
  desc: string
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; title: string; items: string[] }

export type Tool = {
  slug: string
  name: string
  summary: string
  url: string
  category: string
  tags?: string[]
  hot?: boolean
  new?: boolean
  logo_url?: string
  content?: ContentBlock[]
  qa?: { q: string; a: string }[]
}

export const categories: Category[] = [
  { slug: 'writing', name: 'AI 写作工具', icon: 'PenLine', desc: '长文、公文、小说、营销文案一键生成' },
  { slug: 'image', name: 'AI 图像工具', icon: 'Image', desc: '文生图、图像编辑、抠图与修复' },
  { slug: 'video', name: 'AI 视频工具', icon: 'Video', desc: '视频生成、剪辑、数字人与配音' },
  { slug: 'office', name: 'AI 办公工具', icon: 'Briefcase', desc: 'PPT、表格、会议记录与文档助手' },
  { slug: 'chat', name: 'AI 聊天助手', icon: 'MessageSquare', desc: '通用对话大模型与智能问答' },
  { slug: 'agent', name: 'AI 智能体', icon: 'Bot', desc: '自动执行任务的 Agent 与工作流' },
  { slug: 'coding', name: 'AI 编程工具', icon: 'Code2', desc: '代码补全、审查与全栈生成' },
  { slug: 'platform', name: 'AI 开发平台', icon: 'Layers', desc: '模型托管、微调与应用编排' },
  { slug: 'design', name: 'AI 设计工具', icon: 'Palette', desc: 'UI、海报、3D 与品牌设计' },
  { slug: 'audio', name: 'AI 音频工具', icon: 'Music', desc: '语音合成、音乐创作与降噪' },
  { slug: 'search', name: 'AI 搜索引擎', icon: 'Search', desc: '生成式搜索与研究型问答' },
  { slug: 'learn', name: 'AI 学习网站', icon: 'GraduationCap', desc: '课程、教程与提示词学习社区' },
  { slug: 'detect', name: 'AI 内容检测', icon: 'ShieldCheck', desc: 'AIGC 检测、查重与降重' },
  { slug: 'prompt', name: 'AI 提示指令', icon: 'Sparkles', desc: '提示词市场与调试工具' },
]

const t = (
  slug: string,
  name: string,
  summary: string,
  category: string,
  extra: Partial<Tool> = {},
): Tool => ({ slug, name, summary, url: `https://${slug}.example.com`, category, ...extra })

export const tools: Tool[] = [
  // 写作
  t('wawa-write', '蛙蛙写作', 'AI 小说与内容创作工具，支持长篇续写', 'writing', { hot: true, tags: ['小说', '长文'] }),
  t('xunfei-huiwen', '讯飞绘文', 'AI 批量原创，多平台矩阵分发', 'writing', { tags: ['自媒体'] }),
  t('laper', 'Laper', 'AI 原生剧本创作工具，分镜与台词一体', 'writing', { new: true, tags: ['剧本'] }),
  t('biling-write', '笔灵AI写作', '600+ 写作模板，覆盖公文与职场场景', 'writing', { hot: true }),
  t('bangong-xiaowan', '办公小浣熊', '文案生成、AI 知识库创作助手', 'writing' ),
  t('gaoding-copy', '稿定AI文案', '小红书、公众号、短视频文案一键出稿', 'writing'),
  t('qianbi-paper', '千笔AI论文', '全网首家论文无限改稿与润色', 'writing', { tags: ['论文'] }),
  t('qinyan-academic', '沁言学术', 'AI 科研写作平台，一站式文献综述', 'writing'),

  // 图像
  t('huiwa-ai', '绘蛙AI', 'AI 电商营销工具，免费商品图与模特图', 'image', { hot: true, tags: ['电商'] }),
  t('meitu-studio', '美图设计室', 'AI 图像创作和设计平台', 'image', { hot: true }),
  t('jimeng-image', '即梦图像', '中文语义理解出色的文生图模型', 'image'),
  t('liblib-art', 'LiblibAI', '国内活跃的模型分享与在线生图社区', 'image', { tags: ['模型'] }),
  t('remove-bg-pro', '智能抠图 Pro', '发丝级抠图与批量背景替换', 'image'),
  t('upscayl-cloud', '画质放大云', '老照片修复与 4K 无损放大', 'image'),

  // 视频
  t('libtv', 'LibTV', '专业 AI 视频创作平台，模板化成片', 'video', { hot: true }),
  t('duiyou-agent', '堆友Agent', '全能 AI 图像视频创作智能体', 'video', { hot: true }),
  t('seko', 'Seko', '首个创编一体的 AI 视频工作台', 'video', { hot: true }),
  t('updream', 'updream', '专业级一站式 AI 视频生产工具', 'video', { hot: true }),
  t('lumina-video', 'Lumina', '字节跳动旗下 AI 视频生成实验产品', 'video', { new: true }),
  t('shubo-human', '数播数字人', '口播视频克隆与多语种配音', 'video'),

  // 办公
  t('aippt', 'AiPPT', 'AI 快速生成高质量 PPT', 'office', { hot: true, tags: ['PPT'] }),
  t('miaoda', '秒哒', '无代码 AI 应用开发平台', 'office', { hot: true }),
  t('bangong-raccoon', '办公小浣熊 Pro', '专业 AI 办公智能体，表格与文档', 'office', { hot: true }),
  t('nami-work', '纳米Work', '360 旗下纳米团队推出的办公协作 AI', 'office', { new: true }),
  t('daima-agent', '袋马', '高德推出的 AI 应用生成器', 'office', { new: true }),
  t('meeting-note', '会记本', '实时转写会议记录并输出待办', 'office'),

  // 聊天
  t('doubao', '豆包', '智能对话助手，办公与生活全场景', 'chat', { hot: true, tags: ['大模型'] }),
  t('kimi-chat', 'Kimi', '超长上下文阅读与资料问答', 'chat', { hot: true }),
  t('yuanbao', '元宝', '接入多模型的通用 AI 助手', 'chat'),
  t('zhipu-chat', '智谱清言', '国产自研通用对话模型', 'chat'),
  t('tongyi-chat', '通义千问', '多模态对话与文档解析', 'chat'),

  // 智能体
  t('loomy', 'Loomy', '科大讯飞推出的桌面智能体', 'agent', { hot: true }),
  t('astraflow', 'AstraFlow星图', '开发者专属一站式 Agent 编排平台', 'agent', { new: true }),
  t('sophclaw', 'Sophclaw', 'Sophnet 算能云算力智能体', 'agent', { new: true }),
  t('flowith', 'Flowith', '画布式多线程 Agent 工作台', 'agent'),
  t('manus-like', '任务猿', '自动拆解目标并执行的通用 Agent', 'agent'),

  // 编程
  t('trae-ide', 'Trae', 'AI 原生 IDE，中文场景优化', 'coding', { hot: true }),
  t('comate', '文心快码', '代码补全、注释与单测生成', 'coding'),
  t('tongyi-lingma', '通义灵码', '智能编码助手，支持仓库级问答', 'coding'),
  t('codereview-ai', '码评AI', '自动化 Code Review 与规范检查', 'coding'),
  t('sqlbot', 'SQLBot', '自然语言转 SQL 与数据分析', 'coding'),

  // 开发平台
  t('bailian', '百炼平台', '模型服务、微调与应用编排一体', 'platform', { hot: true }),
  t('coze-studio', '扣子', '零代码搭建 AI Bot 与工作流', 'platform', { hot: true }),
  t('modelscope-hub', '魔搭社区', '中文模型开源社区与在线推理', 'platform' ),
  t('siliconflow', '硅基流动', '高性价比大模型推理 API', 'platform'),
  t('bufan-resume', '不繁简历', 'AI 原生简历编辑器，一键适配 JD', 'platform', { new: true }),

  // 设计
  t('motiff-ai', 'Motiff 妙多', 'AI 驱动的专业 UI 设计工具', 'design', { hot: true }),
  t('gaoding-design', '稿定设计', '海报、电商图模板与智能改图', 'design'),
  t('meishe-3d', '妙生3D', 'AI 生成可编辑 3D 模型与材质', 'design'),
  t('logo-forge', 'LogoForge', '品牌 Logo 与 VI 系统生成', 'design'),
  t('canvas-ai', '画布智绘', '智能排版与配色建议', 'design'),

  // 音频
  t('reecho', 'Reecho 睿声', '超拟真中文语音克隆', 'audio', { hot: true }),
  t('tianyin-music', '天音音乐', '一句话生成完整编曲与歌声', 'audio'),
  t('audio-clean', '静音师', 'AI 降噪、去混响与人声分离', 'audio'),
  t('podcast-ai', '��客工坊', '文稿转播客，多角色对话音频', 'audio'),

  // 搜索
  t('metaso', '秘塔AI搜索', '最好用的 AI 搜索工具，无广告', 'search', { hot: true }),
  t('zhida', '知搭搜索', '知乎生态的生成式搜索', 'search'),
  t('deepsearch-cn', '深研搜索', '研究型长报告搜索与引用溯源', 'search'),
  t('scholar-find', '学术寻源', '中英文文献检索与综述生成', 'search'),

  // 学习
  t('ai-course-hub', 'AI 学堂', '系统化大模型课程与实战项目', 'learn'),
  t('prompt-school', '提示词学院', '从入门到进阶的提���工程教程', 'learn'),
  t('paper-daily', '论文日报', '每日精选 AI 论文中文解读', 'learn'),
  t('devdocs-cn', 'AI 开发文档站', '主流模型 API 中文文档聚合', 'learn'),

  // 检测
  t('aigc-check', 'AIGC 检测通', '论文与文案 AI 率检测报告', 'detect'),
  t('paper-dup', '查重助手', '多库比对查重与降重建议', 'detect'),
  t('img-forensic', '图像鉴伪', '识别 AI 生成图片与深度伪造', 'detect'),
  t('voice-guard', '声纹卫士', '语音伪造与克隆检测', 'detect'),

  // 提示
  t('prompt-market', '提示词市集', '海量可复用的中文提示词模板', 'prompt', { hot: true }),
  t('prompt-lab', '提示实验室', '多模型对比与提示词调优', 'prompt'),
  t('sys-prompt-cn', '系统提示库', '优秀产品的系统提示词拆解', 'prompt'),
  t('image-prompt', '绘图咒语站', '文生图关键词与风格词典', 'prompt'),
]

export const hotTools = tools.filter((x) => x.hot).slice(0, 12)
export const newTools = tools.filter((x) => x.new).slice(0, 6)

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getTool(slug: string) {
  return tools.find((x) => x.slug === slug)
}

export function toolsByCategory(slug: string) {
  return tools.filter((x) => x.category === slug)
}

export function toolContent(tool: Tool): ContentBlock[] {
  if (tool.content) return tool.content
  const cat = getCategory(tool.category)
  return [
    {
      type: 'paragraph',
      text: `${tool.name} 是一款${cat ? cat.name : 'AI'}产品，${tool.summary}。它把复杂的模型能力封装成简单的界面，让不懂技术的用户也能在几分钟内完成过去需要数小时的工作。`,
    },
    {
      type: 'paragraph',
      text: '产品在中文语境下做了大量针对性优化：内置符合国内使用习惯的模板与预设，支持团队协作与结果二次编辑，并提供从草稿到成品的完整链路。无论是个人创作者还是企业团队，都可以按需从免费额度起步，逐步升级到更高的生成配额。',
    },
    {
      type: 'list',
      title: '核心特点',
      items: [
        '开箱即用的中文模板与场景预设',
        '结果可编辑、可导出，方便二次加工',
        '支持批量任务与历史记录管理',
        '提供 Web 端使用，无需本地安装',
      ],
    },
  ]
}

export function toolQA(tool: Tool) {
  if (tool.qa) return tool.qa
  return [
    { q: `${tool.name} 是免费的吗？`, a: `${tool.name} 提供免费额度，新用户注册后即可体验核心功能；如果需要更高的生成次数、更快的队列或商用授权，可以按月或按量升级到付费套餐。` },
    { q: `使用 ${tool.name} 需要下载客户端吗？`, a: '不需要。打开官网登录后即可在浏览器中使用，全部计算在云端完成，对本机配置没有要求。' },
    { q: `生成的内容可以商用吗？`, a: '大多数场景下付费套餐会附带商用授权，免费额度产出的内容建议仅用于学习与测试。具体条款请以官网的服务协议为准。' },
    { q: `${tool.name} 适合哪些人使用？`, a: `${tool.summary}，因此它特别适合需要高频产出的自媒体作者、运营、设计与研发团队，也适合想要快速验证想法的个人用户。` },
  ]
}

const palette = [
  'oklch(0.45 0.125 252)',
  'oklch(0.55 0.15 200)',
  'oklch(0.58 0.15 48)',
  'oklch(0.5 0.13 155)',
  'oklch(0.5 0.14 20)',
  'oklch(0.42 0.1 285)',
]

export function toolColor(slug: string) {
  let sum = 0
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i)
  return palette[sum % palette.length]
}

export function toolInitial(name: string) {
  const first = name.replace(/^AI\s*/i, '').trim()[0] ?? 'A'
  return first.toUpperCase()
}
