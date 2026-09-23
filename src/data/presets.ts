import type { ResumeData, ResumeModuleKey } from '@/types/resume'

export interface ProfessionPreset {
  id: string
  name: string
  icon: string
  tagline: string
  color: string
  moduleOrder: ResumeModuleKey[]
  data: Partial<ResumeData>
}

const commonModuleOrder: ResumeModuleKey[] = [
  'basicInfo',
  'targetInfo',
  'summary',
  'jobObjective',
  'workExperience',
  'projects',
  'education',
  'skills',
  'certificates',
  'languages',
  'honors',
  'hobbies'
]

export function createEmptyResume(): ResumeData {
  return {
    meta: { title: '未命名简历', professionId: 'general', templateId: 'clean', accentColor: '#2563eb', font: 'default' },
    targetInfo: { position: '', salary: '', city: '', onBoardDate: '随时到岗', workModel: '全职', industry: '' },
    basicInfo: { name: '', avatar: '', gender: '', age: '', birthDate: '', phone: '', email: '', city: '', wechat: '', website: '', politicalStatus: '', maritalStatus: '', address: '' },
    jobObjective: '',
    summary: '',
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
    certificates: [],
    languages: [],
    hobbies: [],
    honors: [],
    training: [],
    internship: [],
    campusExperience: [],
    portfolio: [],
    moduleOrder: [...commonModuleOrder]
  }
}

export const PROFESSIONS: ProfessionPreset[] = [
  {
    id: 'developer',
    name: '软件开发',
    icon: '💻',
    tagline: '专业 / 工程师 / 全栈',
    color: '#2563eb',
    moduleOrder: ['basicInfo', 'targetInfo', 'jobObjective', 'skills', 'workExperience', 'projects', 'summary', 'education', 'certificates', 'languages', 'hobbies'],
    data: {
      targetInfo: { position: 'Java 后端开发工程师', salary: '18K-25K', city: '上海', onBoardDate: '1 个月内到岗', workModel: '全职', industry: '互联网 / 软件' },
      basicInfo: { name: '张明', age: '26', city: '上海', email: 'zhangming@example.com', phone: '138-0000-0000', wechat: 'zhangming_dev', website: 'github.com/zhangming', politicalStatus: '群众', maritalStatus: '未婚' },
      summary: '5 年 Java 开发经验，主导过日活百万级高并发系统重构，代码质量与性能优化能力强，有完整的团队协作与 Code Review 经验。',
      jobObjective: '· 扎实的 Java/Spring 生态功底，熟悉微服务、分布式缓存与消息队列\n· 主导过多个核心系统从 0 到 1 的搭建，性能提升 60% 以上\n· 良好的工程化能力与跨团队协作经验',
      skills: [
        { name: 'Java / Spring Boot', level: 5, tags: ['Spring Cloud', 'MyBatis'] },
        { name: '数据库 / 中间件', level: 4, tags: ['MySQL', 'Redis', 'RabbitMQ'] },
        { name: '容器 / 云原生', level: 4, tags: ['Docker', 'K8s', 'CI/CD'] },
        { name: '前端协作', level: 3, tags: ['Vue', 'RESTful'] }
      ],
      workExperience: [
        { company: '某大型科技集团', position: '高级后端开发工程师', start: '2021.06', end: '至今', location: '上海', description: '负责交易核心链路与会员系统研发。', highlights: ['主导订单中心重构，接口 QPS 提升 3 倍，耗时下降 65%', '搭建灰度发布体系，将线上故障率降低 80%', '带 3 人子团队完成年度核心项目交付'] },
        { company: '某互联网创业公司', position: 'Jave 开发工程师', start: '2019.07', end: '2021.05', location: '杭州', description: '参与电商后台系统开发与迭代。', highlights: ['独立负责促销模块，支持千万级并发抢购', '优化慢 SQL 与缓存策略，整体响应时间缩短 50%'] }
      ],
      projects: [
        { name: '高并发订单中心重构', role: '技术负责人', start: '2022', end: '2023', techStack: 'Spring Boot / Redis / RocketMQ / K8s', description: '从单体架构迁移至微服务，引入缓存降级与异步削峰，支撑大促 100w QPS。' },
        { name: '会员积分系统', role: '核心开发', start: '2021', end: '2021', techStack: 'Java / MySQL / MQ', description: '设计积分结算与任务系统，接入手淘、小程序等多端。' }
      ],
      education: [{ school: 'XXX 大学', major: '计算机科学与技术', degree: '本科', start: '2015.09', end: '2019.06', gpa: '3.6/4.0', description: '主修数据结构、操作系统、数据库系统；ACM 校队成员。' }],
      certificates: [{ name: '信息系统项目管理师（软考高级）', issuer: '人社部', date: '2022' }],
      languages: [{ name: '英语', level: 'CET-6', note: '可阅读英文技术文档' }],
      hobbies: ['开源', '跑步', '读书']
    }
  },
  {
    id: 'frontend',
    name: '前端开发',
    icon: '🎨',
    tagline: 'Web / 移动端 / 新潮',
    color: '#0ea5e9',
    moduleOrder: ['basicInfo', 'targetInfo', 'skills', 'projects', 'jobObjective', 'workExperience', 'summary', 'education', 'portfolio', 'hobbies'],
    data: {
      targetInfo: { position: '资深前端工程师', salary: '18K-28K', city: '北京', onBoardDate: '2 周内到岗', workModel: '全职', industry: '互联网' },
      basicInfo: { name: '李欣', age: '25', city: '北京', email: 'lixin@example.com', phone: '139-0000-0000', website: 'lixin.work', wechat: 'lixin_fe', politicalStatus: '团员', maritalStatus: '未婚' },
      summary: '热爱前端技术，擅长 Vue/React 与可视化大屏，注重组件化与工程化建设，追求极致的用户体验与页面性能。',
      jobObjective: '· Vue3 / React 全家桶熟练，TypeScript 深度实践\n· 搭建过标准化的前端工程与组件库，包体优化 40%\n· 有移动端 H5 与可视化大屏丰富经验',
      skills: [
        { name: 'Vue / React', level: 5, tags: ['Vue3', 'Pinia', 'React'] },
        { name: '工程化', level: 4, tags: ['Vite', 'Webpack', 'TS'] },
        { name: '可视化', level: 3, tags: ['ECharts', 'Canvas'] },
        { name: '服务端', level: 3, tags: ['Node', 'NestJS'] }
      ],
      projects: [
        { name: '数据可视化驾驶舱', role: '负责人', start: '2022', end: '2023', techStack: 'Vue3 / ECharts / WebSocket', description: '构建集团级实时数据大屏，支撑多业务线监控看板。' },
        { name: '组件库 rl-ui', role: '核心成员', start: '2021', end: '2022', techStack: 'Vue3 / TS / Vite', description: '从 0 搭建内部组件库，覆盖 40+ 组件，接入 10 个业务线。' }
      ],
      workExperience: [
        { company: '某信息服务公司', position: '前端开发工程师', start: '2021.07', end: '至今', location: '北京', description: '负责核心产品前端研发与性能优化。', highlights: ['主导组件库与脚手架，研发效率提升 50%', '前端性能治理，首屏加载从 3s 优化至 1.1s'] }
      ],
      education: [{ school: 'XXX 大学', major: '软件工程', degree: '本科', start: '2017.09', end: '2021.06', gpa: '—', description: '主修 Web 开发、人机交互。' }],
      portfolio: [{ title: '个人作品集', url: 'lixin.work', desc: '可视化大屏与组件库作品展示' }, { title: 'Github', url: 'github.com/lixin_fe', desc: '开源组件与日常练习' }],
      hobbies: ['摄影', '潮流收藏', '滑板']
    }
  },
  {
    id: 'product',
    name: '产品经理',
    icon: '📊',
    tagline: '洞察 / 逻辑 / 沟通',
    color: '#7c3aed',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'projects', 'jobObjective', 'education', 'skills', 'honors', 'hobbies'],
    data: {
      targetInfo: { position: '产品经理', salary: '20K-30K', city: '深圳', onBoardDate: '随时到岗', workModel: '全职', industry: '互联网 / 科技' },
      basicInfo: { name: '王敏', age: '28', city: '深圳', email: 'wangmin@example.com', phone: '136-0000-0000', wechat: 'wangmin_pm', website: '', politicalStatus: '党员', maritalStatus: '已婚' },
      summary: '5 年 B 端产品经验，擅长需求洞察与商业化落地，主导过多个从 0 到 1 业务，具备优秀的跨部门推动力与数据驱动意识。',
      jobObjective: '· 深入客户场景，具备从调研到落地的完整闭环能力\n· 主导业务营收年增长 80%，付费转化提升 2.5 倍\n· 擅长撰写 PRD、搭建数据漏斗并持续迭代',
      skills: [
        { name: '工具链', level: 4, tags: ['Axure', 'Figma', 'XMind'] },
        { name: '数据分析', level: 3, tags: ['SQL', 'GA'] },
        { name: '方法论', level: 4, tags: ['PRD', '用户研究', 'AB 测试'] }
      ],
      workExperience: [
        { company: '某企业服务公司', position: '高级产品经理', start: '2021.03', end: '至今', location: '深圳', description: '负责增长与商业产品线。', highlights: ['上线付费套餐体系，企业 ARPU 提升 60%', '通过 AB 实验优化转化漏斗，活跃转化率提升 35%'] },
        { company: '某 SaaS 公司', position: '产品经理', start: '2019.08', end: '2021.02', location: '广州', description: '负责核心功能设计与迭代。', highlights: ['0-1 落地 3 个核心模块，获客成本下降 40%'] }
      ],
      projects: [
        { name: '企业协同工具商业化', role: '产品负责人', start: '2022', end: '2023', techStack: '', description: '设计定价与套餐体系，推动商业化落地并持续优化。' }
      ],
      education: [{ school: 'XXX 大学', major: '信息管理与信息系统', degree: '硕士', start: '2016.09', end: '2019.06', gpa: '3.7/4.0', description: '硕士研究方向：用户增长与产品运营。' }],
      honors: ['集团优秀员工', 'MVP 产品奖'],
      hobbies: ['旅行', '桌游']
    }
  },
  {
    id: 'design',
    name: 'UI / 视觉设计',
    icon: '🖌️',
    tagline: '审美 / 品牌 / 细节',
    color: '#ec4899',
    moduleOrder: ['basicInfo', 'targetInfo', 'skills', 'portfolio', 'jobObjective', 'workExperience', 'projects', 'summary', 'education', 'honors', 'hobbies'],
    data: {
      targetInfo: { position: 'UI/UX 设计师', salary: '16K-25K', city: '杭州', onBoardDate: '1 个月内到岗', workModel: '全职', industry: '互联网 / 设计' },
      basicInfo: { name: '陈诺', age: '24', city: '杭州', email: 'chennuo@example.com', phone: '135-0000-0000', website: 'behance.net/chennuo', wechat: 'cn_design', politicalStatus: '群众', maritalStatus: '未婚' },
      summary: '跨 UI/UX 设计经验，注重用户研究、交互逻辑与视觉表达的统一，主导过多款 C 端与 B 端产品的设计体系搭建。',
      jobObjective: '· 精通 Figma、具备完善的组件化与设计规范能力\n· 从用户研究出发，输出高可用、高美感的设计方案\n· 具备品牌视觉与动效结合的创造能力',
      skills: [
        { name: 'UI 设计', level: 5, tags: ['Figma', 'Sketch'] },
        { name: '交互 / 原型', level: 4, tags: ['Axure', 'Principle'] },
        { name: '动效 / 视觉', level: 4, tags: ['AE', 'PS', 'AI'] }
      ],
      portfolio: [
        { title: 'Behance 作品集', url: 'behance.net/chennuo', desc: '多款产品设计复盘与视觉作品' },
        { title: '中后台设计系统', url: 'design.example.com', desc: '自建组件化设计规范站' }
      ],
      workExperience: [
        { company: '某设计科技公司', position: '高级 UI 设计师', start: '2021.06', end: '至今', location: '杭州', description: '负责多条产品线的 UI 与设计规范建设。', highlights: ['搭建统一设计系统，跨团队提效 40%', '主导大型改版，界面可用性评分提升 25%'] }
      ],
      projects: [
        { name: 'AI 内容创作工具 App', role: '设计负责人', start: '2022', end: '2023', techStack: '', description: '从竞品分析到高保真原型，定义品牌视觉语言。' }
      ],
      education: [{ school: 'XXX 美术学院', major: '视觉传达设计', degree: '本科', start: '2017.09', end: '2021.06', gpa: '—', description: '主修品牌设计、UI 设计、广告创意。' }],
      honors: ['设计之星 金奖', '站酷推荐设计师'],
      hobbies: ['手绘', '逛展', 'Vlog']
    }
  },
  {
    id: 'operation',
    name: '运营',
    icon: '🚀',
    tagline: '数据分析 / 内容 / 增长',
    color: '#f59e0b',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'jobObjective', 'workExperience', 'projects', 'skills', 'education', 'honors', 'hobbies'],
    data: {
      targetInfo: { position: '用户增长运营', salary: '15K-22K', city: '成都', onBoardDate: '2 周内到岗', workModel: '全职', industry: '互联网' },
      basicInfo: { name: '赵果', age: '26', city: '成都', email: 'zhaoguo@example.com', phone: '137-0000-0000', wechat: 'zg_growth', website: '', politicalStatus: '群众', maritalStatus: '未婚' },
      summary: '4 年用户运营经验，擅长以数据驱动的活动策划与用户增长，主导过多轮拉新、转化与留存专项，逻辑与复盘能力强。',
      jobObjective: '· 精通用户分层与全生命周期运营，DAU 提升 3 倍\n· 操盘过千万级流水的活动与裂变，ROI 表现优秀\n· 熟练使用 SQL 与主流数据分析工具',
      skills: [
        { name: '用户运营', level: 4, tags: ['分层', '促活', '留存'] },
        { name: '数据分析', level: 4, tags: ['SQL', 'Excel'] },
        { name: '活动策划', level: 3, tags: ['裂变', '直播'] }
      ],
      workExperience: [
        { company: '某增长科技公司', position: '高级运营', start: '2021.05', end: '至今', location: '成都', description: '负责用户增长与活动运营。', highlights: ['策划春节拉新活动，新增用户 80w，成本下降 35%', '搭建会员体系，月留存提升 12%'] },
        { company: '某教育公司', position: '运营专员', start: '2019.07', end: '2021.04', location: '成都', description: '负责社群运营与转化。', highlights: ['运营 20+ 社群，季度转化率提升至 8%'] }
      ],
      projects: [
        { name: '私域流量池搭建', role: '负责人', start: '2022', end: '2023', techStack: '', description: '从 0 搭建私域体系，沉淀用户 30w。' }
      ],
      education: [{ school: 'XXX 财经大学', major: '电子商务', degree: '本科', start: '2015.09', end: '2019.06', gpa: '3.5/4.0', description: '主修网络营销、数据分析。' }],
      honors: ['最佳增长团队奖'],
      hobbies: ['露营', '社群交流']
    }
  },
  {
    id: 'marketing',
    name: '市场营销',
    icon: '📣',
    tagline: '品牌 / 推广 / 内容',
    color: '#e11d48',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'projects', 'skills', 'jobObjective', 'education', 'honors', 'languages', 'hobbies'],
    data: {
      targetInfo: { position: '市场经理', salary: '18K-26K', city: '广州', onBoardDate: '1 个月内到岗', workModel: '全职', industry: '消费品 / 互联网' },
      basicInfo: { name: '林可真', age: '29', city: '广州', email: 'linkezhen@example.com', phone: '133-0000-0000', wechat: 'lkc_brand', website: '', politicalStatus: '党员', maritalStatus: '已婚' },
      summary: '6 年品牌市场经验，擅长品牌定位、整合营销与内容种草，操盘过多次大型 Campaign，具备系统的市场分析与预算管理能力。',
      jobObjective: '· 完整操盘品牌升级，全网曝光提升 5 倍\n· 精通小红书、抖音等社交种草与达人合作\n· 擅长预算拆分与 ROI 复盘',
      skills: [
        { name: '品牌策略', level: 4, tags: ['定位', 'Campaign'] },
        { name: '内容种草', level: 4, tags: ['小红书', '抖音'] },
        { name: '媒介投放', level: 3, tags: ['效果广告', 'SEO'] }
      ],
      workExperience: [
        { company: '某快消集团', position: '市场经理', start: '2020.08', end: '至今', location: '广州', description: '负责核心品牌的市场推广。', highlights: ['策划‘新品上市’Campaign，首月售罄率 90%', '建立达人投放 SOP，整体 ROI 提升 40%'] },
        { company: '某广告公司', position: '客户经理', start: '2018.06', end: '2020.07', location: '广州', description: '服务快消与美妆客户。', highlights: ['管理年度媒介预算 2000w+，执行零超支'] }
      ],
      projects: [
        { name: '品牌年轻化焕新', role: '项目负责人', start: '2022', end: '2023', techStack: '', description: '重塑品牌主张与视觉体系，触达年轻客群。' }
      ],
      education: [{ school: 'XXX 大学', major: '市场营销', degree: '本科', start: '2014.09', end: '2018.06', gpa: '3.6/4.0', description: '主修品牌管理、消费者行为学。' }],
      languages: [{ name: '英语', level: 'CET-6', note: '' }],
      honors: ['品牌年度优秀项目'],
      hobbies: ['探店', '咖啡']
    }
  },
  {
    id: 'sales',
    name: '销售',
    icon: '💼',
    tagline: '客户 / 抗压 / 高业绩',
    color: '#16a34a',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'skills', 'jobObjective', 'honors', 'education', 'hobbies'],
    data: {
      targetInfo: { position: '大客户销售经理', salary: '底薪+提成', city: '北京', onBoardDate: '随时到岗', workModel: '全职', industry: '企服 / B2B' },
      basicInfo: { name: '孙皓', age: '30', city: '北京', email: 'sunhao@example.com', phone: '132-0000-0000', wechat: 'sh_sales', website: '', politicalStatus: '群众', maritalStatus: '已婚' },
      summary: '7 年 B2B 销售经验，擅长目标行业客户开发与高层关系经营，连续多年超额完成业绩指标，具备团队管理与带教能力。',
      jobObjective: '· 年销售业绩 1200w+，连续 3 年达成率超 130%\n· 擅长医疗、金融等高客单价行业的打单\n· 具备 5 人销售团队管理经验',
      skills: [
        { name: '客户开发', level: 5, tags: ['大客户', '渠道'] },
        { name: '商务谈判', level: 4, tags: ['招投标', '合同'] },
        { name: '团队管理', level: 3, tags: ['带教', '激励'] }
      ],
      workExperience: [
        { company: '某软件公司', position: '大客户销售经理', start: '2019.04', end: '至今', location: '北京', description: '负责金融行业大客户销售。', highlights: ['年度业绩 1500w，核心客户续约率 90%', '开拓 20+ 新客户，累计贡献营收 4000w'] },
        { company: '某企服公司', position: '销售顾问', start: '2016.08', end: '2019.03', location: '北京', description: '负责中小企业销售。', highlights: ['多次获得月度销售冠军'] }
      ],
      honors: ['全国销售冠军', '百万年薪精英俱乐部'],
      education: [{ school: 'XXX 大学', major: '国际经济与贸易', degree: '本科', start: '2012.09', end: '2016.06', gpa: '—', description: '' }],
      hobbies: ['篮球', '自驾']
    }
  },
  {
    id: 'hr',
    name: '人力资源',
    icon: '🧑‍💼',
    tagline: '招聘 / 组织 / 文化',
    color: '#6366f1',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'projects', 'skills', 'jobObjective', 'education', 'certificates', 'hobbies'],
    data: {
      targetInfo: { position: '人力资源经理', salary: '18K-25K', city: '上海', onBoardDate: '1 个月内到岗', workModel: '全职', industry: '互联网 / 科技' },
      basicInfo: { name: '周雅', age: '29', city: '上海', email: 'zhouya@example.com', phone: '131-0000-0000', wechat: 'zy_hr', website: '', politicalStatus: '党员', maritalStatus: '已婚' },
      summary: '6 年人力资源经验，覆盖招聘、绩效、员工关系与组织发展，擅于用数据支撑决策，推动组织效能持续提升。',
      jobObjective: '· 招聘到岗率 95%，Leader 级岗位平均猎聘周期缩短 40%\n· 搭建过 OKR 绩效体系，员工满意度提升 20%\n· 熟悉劳动法与用工合规风险管理',
      skills: [
        { name: '招聘管理', level: 5, tags: ['全流程', '人才盘点'] },
        { name: '绩效 / 组织', level: 4, tags: ['OKR', 'KPI'] },
        { name: '员工关系', level: 4, tags: ['劳动法', '文化'] }
      ],
      workExperience: [
        { company: '某互联网集团', position: 'HRBP', start: '2020.06', end: '至今', location: '上海', description: '支持研发 200+ 人团队。', highlights: ['年度引入核心人才 60+，留存率行业领先', '推动组织诊断与盘点，提出 3 项优化落地'] },
        { company: '某科技公司', position: '招聘专员', start: '2018.07', end: '2020.05', location: '上海', description: '负责全周期招聘。', highlights: ['完成 600+ 人才面试，offer 接受率 85%'] }
      ],
      projects: [
        { name: '雇主品牌升级', role: '负责人', start: '2022', end: '2023', techStack: '', description: '升级招聘公众号与校招项目，简历量提升 2 倍。' }
      ],
      education: [{ school: 'XXX 大学', major: '人力资源管理', degree: '硕士', start: '2016.09', end: '2018.06', gpa: '3.7/4.0', description: '' }],
      certificates: [{ name: '人力资源管理师（二级）', issuer: '人社部', date: '2021' }],
      hobbies: ['烘焙', '剧集']
    }
  },
  {
    id: 'admin',
    name: '行政前台',
    icon: '🗂️',
    tagline: '细致 / 统筹 / 亲和',
    color: '#0d9488',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'skills', 'certificates', 'education', 'languages', 'hobbies'],
    data: {
      targetInfo: { position: '行政专员', salary: '8K-12K', city: '成都', onBoardDate: '2 周内到岗', workModel: '全职', industry: '企业服务' },
      basicInfo: { name: '何晓', age: '24', city: '成都', email: 'hexiao@example.com', phone: '130-0000-0000', wechat: 'hexiao_admin', website: '', politicalStatus: '群众', maritalStatus: '未婚' },
      summary: '细致负责、亲和力强，具备 3 年行政与前台接待经验，擅长办公环境统筹、物资管理与跨部门协作，注重细节与效率。',
      jobObjective: '· 统筹过 300 人规模办公区日常运营\n· 擅长会务接待与大型活动组织\n· 办公用品采购成本同比下降 20%',
      skills: [
        { name: '行政统筹', level: 4, tags: ['物资', '场地'] },
        { name: '会务接待', level: 4, tags: ['来访', '会议'] },
        { name: '办公软件', level: 4, tags: ['Word', 'Excel', 'PPT'] }
      ],
      workExperience: [
        { company: '某互联网公司', position: '行政专员', start: '2021.06', end: '至今', location: '成都', description: '负责行政综合事务。', highlights: ['统筹季度全员大会与企业文化活动 20+ 场', '优化供应商，采购成本降 20%'] }
      ],
      education: [{ school: 'XXX 职业学院', major: '行政管理', degree: '大专', start: '2018.09', end: '2021.06', gpa: '—', description: '' }],
      certificates: [{ name: '普通话二级甲等', issuer: '语委', date: '2020' }],
      languages: [{ name: '英语', level: 'CET-4', note: '' }],
      hobbies: ['手账', '瑜伽']
    }
  },
  {
    id: 'finance',
    name: '财务会计',
    icon: '🧮',
    tagline: '严谨 / 合规 / 报表',
    color: '#334155',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'skills', 'certificates', 'projects', 'education', 'hobbies'],
    data: {
      targetInfo: { position: '财务主管', salary: '15K-22K', city: '深圳', onBoardDate: '1 个月内到岗', workModel: '全职', industry: '制造 / 商贸' },
      basicInfo: { name: '高洁', age: '31', city: '深圳', email: 'gaojie@example.com', phone: '158-0000-0000', wechat: 'gj_finance', website: '', politicalStatus: '党员', maritalStatus: '已婚' },
      summary: '8 年财务经验，具备总账、成本、税务与预算管理全流程能力，熟悉内控与合规，能为业务提供经营分析支持。',
      jobObjective: '· 持有 CPA，精通新收入/租赁准则\n· 统筹年度预算与管理报表，支持决策\n· 税务筹划为企业年均节税 15%',
      skills: [
        { name: '总账 / 报表', level: 5, tags: ['合并报表'] },
        { name: '成本 / 预算', level: 4, tags: ['成本核算', '预算'] },
        { name: '税务 / 内控', level: 4, tags: ['增值税', '内审'] }
      ],
      workExperience: [
        { company: '某科技制造集团', position: '财务经理', start: '2019.03', end: '至今', location: '深圳', description: '负责深圳子公司全盘财务。', highlights: ['主导 ERP 上线与业财一体化，结账时间缩短 70%', '建立成本分析模型，帮助毛利率提升 3 个点'] },
        { company: '某会计师事务所', position: '审计员', start: '2016.07', end: '2019.02', location: '深圳', description: '负责企业年审与专项审计。', highlights: ['完成 30+ 家企业的年度审计'] }
      ],
      projects: [
        { name: '全面预算体系搭建', role: '负责人', start: '2022', end: '2023', techStack: '', description: '建立滚动预算与经营分析机制。' }
      ],
      education: [{ school: 'XXX 财经大学', major: '会计学', degree: '本科', start: '2012.09', end: '2016.06', gpa: '3.8/4.0', description: '' }],
      certificates: [{ name: '注册会计师（CPA）', issuer: '中注协', date: '2020' }, { name: '中级会计师', issuer: '财政部', date: '2018' }],
      hobbies: ['书法', '理财研究']
    }
  },
  {
    id: 'teacher',
    name: '教师',
    icon: '📚',
    tagline: '授业 / 解惑 / 严谨',
    color: '#4f46e5',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'certificates', 'skills', 'honors', 'education', 'training', 'hobbies'],
    data: {
      targetInfo: { position: '高中语文教师', salary: '面议', city: '武汉', onBoardDate: '按学期到岗', workModel: '全职', industry: '教育' },
      basicInfo: { name: '许老师', age: '35', city: '武汉', email: 'xulaoshi@example.com', phone: '153-0000-0000', wechat: 'xl_sh', website: '', politicalStatus: '党员', maritalStatus: '已婚' },
      summary: '10 年一线教学经验，教学成绩优异，深谙新课标与高考命题趋势，擅长启发式教学与学生个性化辅导，深受学生与家长信赖。',
      jobObjective: '· 所带班级平均分稳居年级前二\n· 多名学生考入重点名校\n· 具备班主任与教研组长经验',
      skills: [
        { name: '课堂教学', level: 5, tags: ['新课标'] },
        { name: '教研真题', level: 4, tags: ['命题', '教研'] },
        { name: '班级管理', level: 4, tags: ['班主任'] }
      ],
      workExperience: [
        { company: '××重点高中', position: '语文教师 / 备课组长', start: '2016.09', end: '至今', location: '武汉', description: '担任高中语文教学与备课命题工作。', highlights: ['连续 4 届高考成绩优秀，平均分市前列', '主持校本课程开发 2 门'] },
        { company: '××中学', position: '语文教师 / 班主任', start: '2013.09', end: '2016.08', location: '湖北', description: '负责两个班的语文教学与班主任。', highlights: ['获市级优质课一等奖'] }
      ],
      certificates: [{ name: '高级中学教师资格证', issuer: '教育部', date: '2013' }, { name: '普通话一级乙等', issuer: '语委', date: '2013' }],
      honors: ['市级优秀教师', '教学质量一等奖'],
      education: [{ school: 'XXX 师范大学', major: '汉语言文学', degree: '硕士', start: '2010.09', end: '2013.06', gpa: '3.7/4.0', description: '' }],
      training: [{ name: '新高考命题研究班', issuer: '省教研室', date: '2022' }],
      hobbies: ['阅读', '朗诵', '书法']
    }
  },
  {
    id: 'medical',
    name: '医护',
    icon: '🩺',
    tagline: '专业 / 责任 / 细致',
    color: '#0ea5a5',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'skills', 'certificates', 'education', 'training', 'hobbies'],
    data: {
      targetInfo: { position: '临床护士（ICU）', salary: '面议', city: '南京', onBoardDate: '1 个月内到岗', workModel: '全职', industry: '医疗健康' },
      basicInfo: { name: '李娜', age: '27', city: '南京', email: 'lina@example.com', phone: '156-0000-0000', wechat: 'ln_nurse', website: '', politicalStatus: '群众', maritalStatus: '未婚' },
      summary: '5 年三甲医院 ICU 临床护理经验，具备扎实的急救与重症护理技能，责任心强、抗压能力好，多次参与危重症患者抢救。',
      jobObjective: '· 主管护师，熟练掌握气管插管配合与持续监护\n· 参与危重症抢救 100+ 例，操作规范零差错\n· 具备带教新护士与感控管理经验',
      skills: [
        { name: '重症护理', level: 5, tags: ['ICU', 'CRRT'] },
        { name: '急救技能', level: 4, tags: ['CPR', '除颤'] },
        { name: '感染控制', level: 4, tags: ['院感', '无菌'] }
      ],
      workExperience: [
        { company: '××三甲医院', position: 'ICU 主管护师', start: '2020.06', end: '至今', location: '南京', description: '负责重症患者临床护理与带教。', highlights: ['参与并主导危重患者抢救 100+ 例', '获年度优秀护士与技能竞赛一等奖'] },
        { company: '××市人民医院', position: '内科护士', start: '2018.07', end: '2020.05', location: '江苏', description: '负责内科病房日常护理。', highlights: ['负责 30+ 张床位日常护理与管理'] }
      ],
      certificates: [{ name: '护士执业资格证', issuer: '卫健委', date: '2018' }, { name: '重症医学专科护士', issuer: '省护理学会', date: '2021' }],
      education: [{ school: 'XXX 医科大学', major: '护理学', degree: '本科', start: '2014.09', end: '2018.06', gpa: '3.6/4.0', description: '' }],
      training: [{ name: '危重症急救培训班', issuer: '省卫生厅', date: '2022' }],
      hobbies: ['瑜伽', '阅读']
    }
  },
  {
    id: 'content',
    name: '新媒体 / 内容',
    icon: '📱',
    tagline: '文案 / 爆款 / 流量',
    color: '#f97316',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'portfolio', 'skills', 'jobObjective', 'education', 'honors', 'hobbies'],
    data: {
      targetInfo: { position: '新媒体主编', salary: '14K-20K', city: '长沙', onBoardDate: '2 周内到岗', workModel: '全职', industry: '新媒体 / MCN' },
      basicInfo: { name: '谢娜娜', age: '25', city: '长沙', email: 'xienana@example.com', phone: '155-0000-0000', wechat: 'xnn_writer', website: 'mp.example.com', politicalStatus: '团员', maritalStatus: '未婚' },
      summary: '3 年新媒体经验，擅长爆款选题策划与短视频脚本，独立运营公众号与抖音账号，具备从内容到转化的完整操盘能力。',
      jobObjective: '· 独立运营账号涨粉 50w，多篇 10w+ 文章\n· 精通选题、脚本、剪辑与数据复盘\n· 擅长打造 IP 化的内容栏目',
      skills: [
        { name: '内容策划', level: 5, tags: ['选题', '文案'] },
        { name: '视频制作', level: 4, tags: ['剪映', 'PR'] },
        { name: '账号运营', level: 4, tags: ['公众号', '抖音'] }
      ],
      workExperience: [
        { company: '某 MCN 公司', position: '主编', start: '2021.04', end: '至今', location: '长沙', description: '负责美妆个护矩阵账号。', highlights: ['孵化 3 个 10w+ 粉账号，月均阅读 500w+', '内容带货 GMV 月均 300w'] },
        { company: '某公众号平台', position: '新媒体编辑', start: '2019.08', end: '2021.03', location: '长沙', description: '负责公众号内容产出。', highlights: ['产出多篇行业爆款，粉丝实现翻倍'] }
      ],
      portfolio: [
        { title: '个人公众号', url: 'mp.example.com', desc: '10w+ 爆款内容合集' },
        { title: '抖音账号', url: 'douyin.com/@xxx', desc: '短视频作品 200+ 条' }
      ],
      education: [{ school: 'XXX 大学', major: '新闻与传播', degree: '本科', start: '2015.09', end: '2019.06', gpa: '—', description: '' }],
      honors: ['年度爆款内容奖'],
      hobbies: ['追剧', '探店']
    }
  },
  {
    id: 'ecommerce',
    name: '电商运营',
    icon: '🛒',
    tagline: 'GMV / 投放 / 店铺',
    color: '#22c55e',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'workExperience', 'projects', 'skills', 'jobObjective', 'honors', 'education', 'hobbies'],
    data: {
      targetInfo: { position: '电商运营主管', salary: '15K-22K', city: '义乌', onBoardDate: '随时到岗', workModel: '全职', industry: '电商零售' },
      basicInfo: { name: '吴凡', age: '28', city: '义乌', email: 'wufan@example.com', phone: '159-0000-0000', wechat: 'wf_ec', website: '', politicalStatus: '群众', maritalStatus: '未婚' },
      summary: '5 年电商运营经验，深耕淘宝/京东/拼多多平台，擅长爆款打造、直通车投放与供应链协同，多次打造类目 TOP 单品。',
      jobObjective: '· 打造过 3 个类目 TOP10 爆款单品\n· 熟练直通车/引力魔方投放，ROI 稳定 3+ \n· 精通平台规则与搜索排名优化',
      skills: [
        { name: '爆款打造', level: 5, tags: ['选品', '起量'] },
        { name: '付费推广', level: 4, tags: ['直通车', '钻展'] },
        { name: '数据分析', level: 3, tags: ['生意参谋', 'Excel'] }
      ],
      workExperience: [
        { company: '某电商公司', position: '运营主管', start: '2020.05', end: '至今', location: '义乌', description: '负责 5 家店铺整体运营。', highlights: ['年度 GMV 5000w，同比增长 45%', '打造 SKU 月销破万，类目前十'] },
        { company: '某网店', position: '电商运营', start: '2018.07', end: '2020.04', location: '杭州', description: '负责店铺日常运营与活动。', highlights: ['自营店从 0 做到 月销 200w'] }
      ],
      projects: [
        { name: '618 大促战役', role: '总指挥', start: '2022', end: '2022', techStack: '', description: '统筹货品、投放与客服，大促 GMV 破 2000w。' }
      ],
      education: [{ school: 'XXX 学院', major: '电子商务', degree: '大专', start: '2015.09', end: '2018.06', gpa: '—', description: '' }],
      honors: ['平台年货节优秀商家'],
      hobbies: ['机器人', '钓鱼']
    }
  },
  {
    id: 'fresh',
    name: '应届生 / 实习',
    icon: '🎓',
    tagline: '潜力 / 好学者 / 进取',
    color: '#64748b',
    moduleOrder: ['basicInfo', 'targetInfo', 'summary', 'education', 'campusExperience', 'internship', 'skills', 'certificates', 'languages', 'honors', 'hobbies'],
    data: {
      targetInfo: { position: '前端开发工程师（校招）', salary: '10K-15K', city: '全国可选', onBoardDate: '毕业后到岗', workModel: '全职', industry: '互联网' },
      basicInfo: { name: '周同学', age: '22', city: '上海', email: 'zhoutx@example.com', phone: '150-0000-0000', wechat: 'zt_stu', website: 'github.com/zhoutx', politicalStatus: '团员', maritalStatus: '未婚' },
      summary: '计算机专业应届生，具备扎实的计算机基础与前端实习经验，热爱学习新技术，有较强的自驱力与团队协作精神。',
      jobObjective: '· 掌握 Vue3 + TypeScript，能独立完成页面开发\n· 有商城类项目与企业实习实践经历\n· 学习能力强，可快速上手业务',
      skills: [
        { name: 'Web 基础', level: 4, tags: ['HTML', 'CSS', 'JS'] },
        { name: 'Vue / React', level: 3, tags: ['Vue3', 'TS'] },
        { name: '工具链', level: 3, tags: ['Git', 'Vite'] }
      ],
      education: [{ school: 'XXX 大学', major: '计算机科学与技术', degree: '本科', start: '2022.09', end: '2026.06', gpa: '3.6/4.0', description: '主修数据结构、计算机网络；获校级奖学金。' }],
      campusExperience: [
        { company: '校学生会', position: '技术部干事', start: '2023', end: '2024', location: '', description: '负责学生会网站维护与活动技术支持。', highlights: ['开发报名小程序，服务 3000+ 同学'] }
      ],
      internship: [
        { company: '某互联网公司', position: '前端开发实习生', start: '2025.06', end: '2025.09', location: '上海', description: '参与后台管理系统的开发与联调。', highlights: ['独立完成 5 个业务模块开发'] }
      ],
      certificates: [{ name: '计算机等级考试（二级）', issuer: '教育部', date: '2024' }],
      languages: [{ name: '英语', level: 'CET-6', note: '' }],
      honors: ['校一等奖学金', '互联网+ 校级银奖'],
      hobbies: ['编程', '羽毛球']
    }
  },
  {
    id: 'audit',
    name: '通用模版',
    icon: '⭐',
    tagline: '百搭 / 通用 / 空白',
    color: '#1f2937',
    moduleOrder: commonModuleOrder,
    data: {
      targetInfo: { position: '', salary: '', city: '', onBoardDate: '随时到岗', workModel: '全职', industry: '' },
      basicInfo: { name: '姓名', age: '', city: '', email: 'you@example.com', phone: '138-0000-0000', wechat: '', website: '', politicalStatus: '', maritalStatus: '' },
      summary: '在此填写一段凝练的自我评价，突出你的核心竞争与职业方向…',
      jobObjective: '· 用短句/要点列出你的核心优势\n· 用数据量化你的工作成果更佳',
      skills: [{ name: '专业技能', level: 4, tags: ['标签1', '标签2'] }]
    }
  }
]

export function presetById(id: string): ProfessionPreset | undefined {
  return PROFESSIONS.find((p) => p.id === id)
}

export function createResumeFromPreset(preset: ProfessionPreset): ResumeData {
  const base = createEmptyResume()
  return {
    ...base,
    ...preset.data,
    meta: {
      ...base.meta,
      professionId: preset.id,
      title: `${preset.name}简历`,
      accentColor: preset.color
    },
    moduleOrder: [...preset.moduleOrder]
  }
}