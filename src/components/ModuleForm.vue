<template>
  <div class="module-form">
    <template v-if="active === 'basicInfo'">
      <div class="avatar-row">
        <div class="avatar-box">
          <img v-if="data.basicInfo.avatar" :src="data.basicInfo.avatar" class="avatar-img" alt="头像" />
          <span v-else class="avatar-ph"><el-icon><Plus /></el-icon></span>
          <input ref="fileRef" type="file" accept="image/*" hidden @change="onPickAvatar" />
        </div>
        <div class="avatar-controls">
          <el-button size="small" @click="fileRef?.click()">上传头像</el-button>
          <el-input size="small" placeholder="或粘贴头像图片 URL" :model-value="data.basicInfo.avatar" @update:model-value="patch('basicInfo.avatar', $event)" clearable>
            <template #append>
              <el-button :disabled="!data.basicInfo.avatar" @click="patch('basicInfo.avatar','')">清除</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="field-grid">
        <Field label="姓名"><el-input v-model="d.basicInfo.name" placeholder="你的姓名" /></Field>
        <Field label="性别">
          <el-select v-model="d.basicInfo.gender" placeholder="请选择" clearable><el-option v-for="g in ['男','女','保密']" :key="g" :label="g" :value="g" /></el-select>
        </Field>
        <Field label="年龄"><el-input v-model="d.basicInfo.age" placeholder="如 26" /></Field>
        <Field label="出生年月"><el-date-picker v-model="d.basicInfo.birthDate" type="month" value-format="YYYY.MM" format="YYYY.MM" style="width:100%" /></Field>
        <Field label="手机号"><el-input v-model="d.basicInfo.phone" placeholder="13800000000" /></Field>
        <Field label="邮箱"><el-input v-model="d.basicInfo.email" placeholder="you@example.com" /></Field>
        <Field label="所在城市"><el-input v-model="d.basicInfo.city" placeholder="上海" /></Field>
        <Field label="微信"><el-input v-model="d.basicInfo.wechat" placeholder="微信号" /></Field>
        <Field label="主页 / GitHub"><el-input v-model="d.basicInfo.website" placeholder="https://..." /></Field>
        <Field label="政治面貌"><el-input v-model="d.basicInfo.politicalStatus" placeholder="党员/团员/群众" /></Field>
        <Field label="婚姻状况">
          <el-select v-model="d.basicInfo.maritalStatus" clearable placeholder="请选择"><el-option v-for="m in ['未婚','已婚','其他']" :key="m" :label="m" :value="m" /></el-select>
        </Field>
        <Field label="现居地址"><el-input v-model="d.basicInfo.address" placeholder="省市/街道" /></Field>
      </div>
    </template>

    <template v-else-if="active === 'targetInfo'">
      <div class="field-grid">
        <Field label="期望职位"><el-input v-model="d.targetInfo.position" placeholder="前端开发工程师" /></Field>
        <Field label="期望城市"><el-input v-model="d.targetInfo.city" placeholder="上海" /></Field>
        <Field label="期望薪资"><el-input v-model="d.targetInfo.salary" placeholder="12K-18K / 面议" /></Field>
        <Field label="到岗时间"><el-input v-model="d.targetInfo.onBoardDate" placeholder="随时到岗" /></Field>
        <Field label="工作模式">
          <el-select v-model="d.targetInfo.workModel" clearable><el-option v-for="m in ['全职','兼职','实习','远程']" :key="m" :label="m" :value="m" /></el-select>
        </Field>
        <Field label="目标行业"><el-input v-model="d.targetInfo.industry" placeholder="互联网 / 教育..." /></Field>
      </div>
    </template>

    <template v-else-if="active === 'summary'">
      <TextArea title="自我评价" :model-value="d.summary" placeholder="用 3-5 句话概括你的职业定位、核心能力与工作成果…" @update:model-value="(v)=>patch('summary', v)" />
    </template>

    <template v-else-if="active === 'jobObjective'">
      <TextArea title="求职优势" :model-value="d.jobObjective" placeholder="每行一条，用 ● 或 - 开头，突出亮点与数据" rows="8" @update:model-value="(v)=>patch('jobObjective', v)" />
    </template>

    <template v-else-if="active === 'education'">
      <ListEditor :model="d.education" module-label="教育经历" title-key="school" :schema="educationSchema" @update="(l)=>patch('education', l)" />
    </template>

    <template v-else-if="active === 'workExperience'">
      <ListEditor :model="d.workExperience" module-label="工作经历" title-key="company" :schema="experienceSchema" @update="(l)=>patch('workExperience', l)" />
    </template>

    <template v-else-if="active === 'internship'">
      <ListEditor :model="d.internship" module-label="实习经历" title-key="company" :schema="experienceSchema" @update="(l)=>patch('internship', l)" />
    </template>

    <template v-else-if="active === 'campusExperience'">
      <ListEditor :model="d.campusExperience" module-label="校园经历" title-key="company" :schema="experienceSchema" @update="(l)=>patch('campusExperience', l)" />
    </template>

    <template v-else-if="active === 'projects'">
      <ListEditor :model="d.projects" module-label="项目经历" title-key="name" :schema="projectSchema" @update="(l)=>patch('projects', l)" />
    </template>

    <template v-else-if="active === 'skills'">
      <ListEditor :model="d.skills" module-label="技能" title-key="name" :schema="skillSchema" @update="(l)=>patch('skills', l)" />
      <p class="muted">熟练度：了解 → 基础 → 熟练 → 精通 → 专家</p>
    </template>

    <template v-else-if="active === 'certificates'">
      <ListEditor :model="d.certificates" module-label="证书" title-key="name" :schema="certSchema" @update="(l)=>patch('certificates', l)" />
    </template>

    <template v-else-if="active === 'languages'">
      <ListEditor :model="d.languages" module-label="语言" title-key="name" :schema="langSchema" @update="(l)=>patch('languages', l)" />
    </template>

    <template v-else-if="active === 'training'">
      <ListEditor :model="d.training" module-label="培训" title-key="name" :schema="trainingSchema" @update="(l)=>patch('training', l)" />
    </template>

    <template v-else-if="active === 'portfolio'">
      <ListEditor :model="d.portfolio" module-label="作品/链接" title-key="title" :schema="portfolioSchema" @update="(l)=>patch('portfolio', l)" />
    </template>

    <template v-else-if="active === 'hobbies' || active === 'honors'">
      <SimpleTagList :title="active === 'hobbies' ? '兴趣爱好' : '荣誉奖励'" :model="d[active]" @update="(l)=>patch(active, l)" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ResumeData, ResumeModuleKey } from '@/types/resume'
import ListEditor, { type FieldSchema } from './forms/ListEditor.vue'
import SimpleTagList from './forms/SimpleTagList.vue'
import Field from './forms/Field.vue'
import TextArea from './forms/TextArea.vue'

const props = defineProps<{ data: ResumeData; active: ResumeModuleKey }>()

const d = reactive(props.data)
const fileRef = ref<HTMLInputElement>()

function patch(path: string, value: any) {
  const segs = path.split('.')
  if (segs.length === 1) {
    ;(d as any)[segs[0]] = value
  } else {
    const obj: any = d[segs[0] as keyof ResumeData]
    obj[segs[1]] = value
  }
}

function onPickAvatar(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    d.basicInfo.avatar = reader.result as string
    if (fileRef.value) fileRef.value.value = ''
  }
  reader.readAsDataURL(file)
}

const educationSchema: FieldSchema[] = [
  { key: 'school', label: '学校', type: 'text', placeholder: '学校名称', span: 2 },
  { key: 'major', label: '专业', type: 'text', placeholder: '专业名称' },
  { key: 'degree', label: '学历', type: 'text', placeholder: '本科/硕士' },
  { key: 'start', label: '入学时间', type: 'month' },
  { key: 'end', label: '毕业时间', type: 'month' },
  { key: 'gpa', label: '绩点 / 成绩', type: 'text', placeholder: '3.6/4.0 或前 10%' },
  { key: 'description', label: '描述(可选)', type: 'textarea', rows: 2, placeholder: '主修课程、荣誉、相关经历', span: 2 }
]

const experienceSchema: FieldSchema[] = [
  { key: 'company', label: '公司 / 组织', type: 'text', placeholder: '公司名称', span: 2 },
  { key: 'position', label: '职位', type: 'text', placeholder: '职位名称' },
  { key: 'location', label: '城市', type: 'text', placeholder: '城市' },
  { key: 'start', label: '开始时间', type: 'month' },
  { key: 'end', label: '结束时间', type: 'month' },
  { key: 'highlights', label: '工作亮点(可多添，用数据更佳)', type: 'tags', placeholder: '输入后回车', span: 2 },
  { key: 'description', label: '职责描述', type: 'textarea', rows: 3, placeholder: '简要描述工作职责', span: 2 }
]

const projectSchema: FieldSchema[] = [
  { key: 'name', label: '项目名称', type: 'text', placeholder: '项目名', span: 2 },
  { key: 'role', label: '担任角色', type: 'text', placeholder: '负责人/核心开发' },
  { key: 'techStack', label: '技术栈 / 相关', type: 'text', placeholder: '如 Vue3 / Node' },
  { key: 'start', label: '开始', type: 'month' },
  { key: 'end', label: '结束', type: 'month' },
  { key: 'description', label: '项目描述', type: 'textarea', rows: 3, placeholder: '项目背景、你的职责与成果', span: 2 }
]

const skillSchema: FieldSchema[] = [
  { key: 'name', label: '技能名称', type: 'text', placeholder: '如 Java' },
  { key: 'level', label: '熟练度', type: 'level' },
  { key: 'tags', label: '细分标签', type: 'tags', placeholder: '如 Spring、MySQL', span: 2 }
]

const certSchema: FieldSchema[] = [
  { key: 'name', label: '证书 / 资质', type: 'text', placeholder: '证书名称', span: 2 },
  { key: 'issuer', label: '颁发机构', type: 'text' },
  { key: 'date', label: '获得时间', type: 'text', placeholder: '如 2022' }
]

const langSchema: FieldSchema[] = [
  { key: 'name', label: '语言', type: 'text', placeholder: '如 英语' },
  { key: 'level', label: '水平', type: 'text', placeholder: 'CET-6 / 精通' },
  { key: 'note', label: '备注(可选)', type: 'text', placeholder: '可流利沟通…' }
]

const trainingSchema: FieldSchema[] = [
  { key: 'name', label: '培训 / 课程', type: 'text', placeholder: '培训名称', span: 2 },
  { key: 'issuer', label: '主办机构', type: 'text' },
  { key: 'date', label: '时间', type: 'text', placeholder: '如 2023' }
]

const portfolioSchema: FieldSchema[] = [
  { key: 'title', label: '标题', type: 'text', placeholder: '作品集 / 主页' },
  { key: 'url', label: '链接', type: 'text', placeholder: 'https://...' },
  { key: 'desc', label: '简介', type: 'text', placeholder: '一句话说明', span: 2 }
]
</script>

<style scoped>
.module-form { padding: 4px 2px 20px; }
.avatar-row { display: flex; gap: 16px; align-items: center; margin-bottom: 18px; }
.avatar-box {
  width: 72px; height: 72px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  background: #eef2ff; display: grid; place-items: center;
  border: 2px dashed #c7d2fe; color: #94a3b8; cursor: pointer;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-ph { font-size: 22px; }
.avatar-controls { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.field-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.muted { margin: 8px 0 0; }
</style>