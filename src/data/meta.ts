import type { ResumeModuleKey } from '@/types/resume'

export interface ModuleMeta {
  key: ResumeModuleKey
  label: string
  hint: string
  isList: boolean
}

export const MODULE_CATALOG: ModuleMeta[] = [
  { key: 'basicInfo', label: '基本信息', hint: '姓名、联系方式、住址等个人档案', isList: false },
  { key: 'targetInfo', label: '求职意向', hint: '期望职位、薪资、城市、到岗时间', isList: false },
  { key: 'summary', label: '自我评价', hint: '一段高度概括个人优势的自我介绍', isList: false },
  { key: 'jobObjective', label: '求职优势', hint: '你的核心竞争力与职业亮点', isList: false },
  { key: 'education', label: '教育经历', hint: '从最高学历开始填写的学习经历', isList: true },
  { key: 'workExperience', label: '工作经历', hint: '工作职责与成果，用数据量化更佳', isList: true },
  { key: 'projects', label: '项目经历', hint: '参与或负责的项目、产品、成果', isList: true },
  { key: 'skills', label: '专业技能', hint: '技能标签 + 熟练度，突出核心能力', isList: true },
  { key: 'certificates', label: '证书资质', hint: '职业资格、语言证书、认证等', isList: true },
  { key: 'languages', label: '语言能力', hint: '外语/方言水平，可标注是否证书', isList: true },
  { key: 'honors', label: '荣誉奖励', hint: '获奖、表彰、荣誉称号', isList: true },
  { key: 'training', label: '培训经历', hint: '技能培训、进修、课程认证', isList: true },
  { key: 'internship', label: '实习经历', hint: '实习项目、岗位职责与收获', isList: true },
  { key: 'campusExperience', label: '校园经历', hint: '社团、学生会、志愿活动等', isList: true },
  { key: 'portfolio', label: '作品集链接', hint: '个人主页、作品展示、Github 链接', isList: true },
  { key: 'hobbies', label: '兴趣爱好', hint: '丰富人设，展示生活化一面', isList: true }
]

export const MODULE_MAP: Record<ResumeModuleKey, ModuleMeta> = Object.fromEntries(
  MODULE_CATALOG.map((m) => [m.key, m])
)

export const LIST_MODULES: ResumeModuleKey[] = MODULE_CATALOG.filter((m) => m.isList).map(
  (m) => m.key
)

// 视觉风格
export interface TemplateMeta {
  id: string
  name: string
  desc: string
}

export const TEMPLATES: TemplateMeta[] = [
  { id: 'clean', name: '简约商务', desc: '单栏清晰排版，稳重大气，适合绝大多数岗位' },
  { id: 'elegant', name: '典雅双栏', desc: '左侧边栏 + 右侧主体，信息结构化、职业感强' },
  { id: 'vibrant', name: '创意活力', desc: '色块与点缀元素丰富，适合设计/创意/运营岗位' },
  { id: 'timeline', name: '时间轴', desc: '以纵向时间线呈现经历，适合经历丰富的岗位' },
  { id: 'modern', name: '极简现代', desc: '去装饰化排版，留白充足，适合设计/前沿岗位' },
  { id: 'editorial', name: '杂志排版', desc: '衬线杂志风，侧栏强调，适合文职/媒体/管理' }
]