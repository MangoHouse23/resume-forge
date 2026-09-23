// 简历数据模型

export type ResumeModuleKey =
  | 'basicInfo'
  | 'jobObjective'
  | 'summary'
  | 'education'
  | 'workExperience'
  | 'projects'
  | 'skills'
  | 'certificates'
  | 'languages'
  | 'hobbies'
  | 'honors'
  | 'training'
  | 'internship'
  | 'campusExperience'
  | 'portfolio'

export interface BasicInfo {
  name: string
  avatar: string
  gender: string
  age: string
  birthDate: string
  phone: string
  email: string
  city: string
  wechat: string
  website: string
  politicalStatus: string
  maritalStatus: string
  address: string
}

export interface TargetInfo {
  // 求职意向
  position: string
  salary: string
  city: string
  onBoardDate: string
  workModel: string // 全职/兼职/实习/远程
  industry: string
}

export interface EducationItem {
  school: string
  major: string
  degree: string
  start: string
  end: string
  gpa: string
  description: string
}

export interface ExperienceItem {
  company: string
  position: string
  start: string
  end: string
  location: string
  description: string
  highlights: string[]
}

export interface ProjectItem {
  name: string
  role: string
  start: string
  end: string
  techStack: string
  description: string
}

export interface SkillItem {
  name: string
  level: number // 1-5 熟练度
  tags: string[]
}

export interface CertificateItem {
  name: string
  issuer: string
  date: string
}

export interface LanguageItem {
  name: string
  level: string
  note: string
}

export interface TrainingItem {
  name: string
  issuer: string
  date: string
}

export interface PortfolioItem {
  title: string
  url: string
  desc: string
}

export interface ResumeData {
  meta: {
    title: string
    professionId: string
    templateId: string // 视觉风格
    accentColor: string
    font: string // 自定义字体（FONTS 的 id），'default' 表示跟随默认
  }
  targetInfo: TargetInfo
  basicInfo: BasicInfo
  jobObjective: string
  summary: string
  education: EducationItem[]
  workExperience: ExperienceItem[]
  projects: ProjectItem[]
  skills: SkillItem[]
  certificates: CertificateItem[]
  languages: LanguageItem[]
  hobbies: string[]
  honors: string[]
  training: TrainingItem[]
  internship: ExperienceItem[]
  campusExperience: ExperienceItem[]
  portfolio: PortfolioItem[]
  moduleOrder: ResumeModuleKey[]
}