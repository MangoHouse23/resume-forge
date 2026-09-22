<template>
  <div class="mm-form">
    <template v-if="active === 'basicInfo'">
      <div class="mm-avatar">
        <span class="mm-avatar-label">头像</span>
        <van-uploader
          v-model="avatarFiles"
          :max-count="1"
          :after-read="onAvatar"
          :preview-image="true"
          class="mm-uploader"
        />
        <van-button v-if="d.basicInfo.avatar" size="mini" class="mm-clear" @click="clearAvatar">清除</van-button>
      </div>
      <van-cell-group inset>
        <van-field v-model="d.basicInfo.name" label="姓名" placeholder="你的姓名" clearable />
        <van-field label="性别" class="mm-radio-field">
          <template #input>
            <van-radio-group v-model="d.basicInfo.gender" direction="horizontal">
              <van-radio name="男">男</van-radio>
              <van-radio name="女">女</van-radio>
              <van-radio name="保密">保密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="d.basicInfo.age" label="年龄" type="digit" placeholder="如 26" clearable />
        <van-field v-model="d.basicInfo.birthDate" label="出生年月" placeholder="如 2000.01" clearable />
        <van-field v-model="d.basicInfo.phone" label="手机号" type="tel" placeholder="13800000000" clearable />
        <van-field v-model="d.basicInfo.email" label="邮箱" type="email" placeholder="you@example.com" clearable />
        <van-field v-model="d.basicInfo.city" label="所在城市" placeholder="上海" clearable />
        <van-field v-model="d.basicInfo.wechat" label="微信" placeholder="微信号" clearable />
        <van-field v-model="d.basicInfo.website" label="主页/GitHub" placeholder="https://..." clearable />
        <van-field v-model="d.basicInfo.politicalStatus" label="政治面貌" placeholder="党员/团员/群众" clearable />
        <van-field label="婚姻状况">
          <template #input>
            <van-radio-group v-model="d.basicInfo.maritalStatus" direction="horizontal">
              <van-radio name="未婚">未婚</van-radio>
              <van-radio name="已婚">已婚</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="d.basicInfo.address" label="现居地址" placeholder="省市/街道" clearable />
      </van-cell-group>
    </template>

    <template v-else-if="active === 'targetInfo'">
      <van-cell-group inset>
        <van-field v-model="d.targetInfo.position" label="期望职位" placeholder="前端开发工程师" clearable />
        <van-field v-model="d.targetInfo.city" label="期望城市" placeholder="上海" clearable />
        <van-field v-model="d.targetInfo.salary" label="期望薪资" placeholder="12K-18K / 面议" clearable />
        <van-field v-model="d.targetInfo.onBoardDate" label="到岗时间" placeholder="随时到岗" clearable />
        <van-field v-model="d.targetInfo.industry" label="目标行业" placeholder="互联网 / 教育..." clearable />
        <van-field label="工作模式">
          <template #input>
            <van-radio-group v-model="d.targetInfo.workModel" direction="horizontal">
              <van-radio v-for="m in ['全职','兼职','实习','远程']" :key="m" :name="m">{{ m }}</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>
    </template>

    <template v-else-if="active === 'summary'">
      <van-cell-group inset>
        <van-field
          v-model="d.summary"
          label="自我评价"
          type="textarea"
          rows="5"
          autosize
          show-word-limit
          placeholder="用 3-5 句话概括职业定位、核心能力与成果…"
        />
      </van-cell-group>
    </template>

    <template v-else-if="active === 'jobObjective'">
      <van-cell-group inset>
        <van-field
          v-model="d.jobObjective"
          label="求职优势"
          type="textarea"
          rows="6"
          autosize
          placeholder="每行一条，用 ● 或 - 开头，突出亮点与数据"
        />
      </van-cell-group>
    </template>

    <template v-else-if="active === 'education'">
      <MobileListEditor :model="d.education" module-label="教育经历" title-key="school" :schema="educationSchema" />
    </template>
    <template v-else-if="active === 'workExperience'">
      <MobileListEditor :model="d.workExperience" module-label="工作经历" title-key="company" :schema="experienceSchema" />
    </template>
    <template v-else-if="active === 'internship'">
      <MobileListEditor :model="d.internship" module-label="实习经历" title-key="company" :schema="experienceSchema" />
    </template>
    <template v-else-if="active === 'campusExperience'">
      <MobileListEditor :model="d.campusExperience" module-label="校园经历" title-key="company" :schema="experienceSchema" />
    </template>
    <template v-else-if="active === 'projects'">
      <MobileListEditor :model="d.projects" module-label="项目经历" title-key="name" :schema="projectSchema" />
    </template>
    <template v-else-if="active === 'skills'">
      <MobileListEditor :model="d.skills" module-label="技能" title-key="name" :schema="skillSchema" :accent="accent" />
      <p class="mm-muted">熟练度：了解 → 基础 → 熟练 → 精通 → 专家</p>
    </template>
    <template v-else-if="active === 'certificates'">
      <MobileListEditor :model="d.certificates" module-label="证书" title-key="name" :schema="certSchema" />
    </template>
    <template v-else-if="active === 'languages'">
      <MobileListEditor :model="d.languages" module-label="语言" title-key="name" :schema="langSchema" />
    </template>
    <template v-else-if="active === 'training'">
      <MobileListEditor :model="d.training" module-label="培训" title-key="name" :schema="trainingSchema" />
    </template>
    <template v-else-if="active === 'portfolio'">
      <MobileListEditor :model="d.portfolio" module-label="作品/链接" title-key="title" :schema="portfolioSchema" />
    </template>
    <template v-else-if="active === 'hobbies' || active === 'honors'">
      <div class="mm-tagwrap">
        <MobileTags :label="active === 'hobbies' ? '兴趣爱好' : '荣誉奖励'" v-model="d[active]" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ResumeData, ResumeModuleKey } from '@/types/resume'
import MobileListEditor from './forms/MobileListEditor.vue'
import MobileTags from './forms/MobileTags.vue'

const props = defineProps<{ data: ResumeData; active: ResumeModuleKey; accent: string }>()

const d = reactive(props.data)
const avatarFiles = ref<any[]>([])

function onAvatar(file: { content: string }) {
  if (file.content) {
    d.basicInfo.avatar = file.content
  }
}
function clearAvatar() {
  d.basicInfo.avatar = ''
  avatarFiles.value = []
}

const educationSchema = [
  { key: 'school', label: '学校', type: 'text', placeholder: '学校名称' },
  { key: 'major', label: '专业', type: 'text', placeholder: '专业名称' },
  { key: 'degree', label: '学历', type: 'text', placeholder: '本科/硕士' },
  { key: 'start', label: '入学时间', type: 'text', placeholder: '2020.09' },
  { key: 'end', label: '毕业时间', type: 'text', placeholder: '2024.06' },
  { key: 'gpa', label: '绩点/成绩', type: 'text', placeholder: '3.6/4.0' },
  { key: 'description', label: '描述', type: 'textarea', rows: 2 }
] // 复用桌面端类型，字段结构一致
const experienceSchema = [
  { key: 'company', label: '公司/组织', type: 'text' },
  { key: 'position', label: '职位', type: 'text' },
  { key: 'start', label: '开始时间', type: 'text', placeholder: '2021.06' },
  { key: 'end', label: '结束时间', type: 'text', placeholder: '至今' },
  { key: 'highlights', label: '工作亮点', type: 'tags', placeholder: '' },
  { key: 'description', label: '职责描述', type: 'textarea', rows: 2 }
]
const projectSchema = [
  { key: 'name', label: '项目名称', type: 'text' },
  { key: 'role', label: '担任角色', type: 'text' },
  { key: 'start', label: '开始', type: 'text', placeholder: '2022' },
  { key: 'end', label: '结束', type: 'text', placeholder: '2023' },
  { key: 'techStack', label: '技术栈/相关', type: 'text' },
  { key: 'description', label: '项目描述', type: 'textarea', rows: 3 }
]
const skillSchema = [
  { key: 'name', label: '技能名称', type: 'text' },
  { key: 'level', label: '熟练度', type: 'level' },
  { key: 'tags', label: '细分标签', type: 'tags' }
]
const certSchema = [
  { key: 'name', label: '证书/资质', type: 'text' },
  { key: 'issuer', label: '颁发机构', type: 'text' },
  { key: 'date', label: '获得时间', type: 'text', placeholder: '如 2022' }
]
const langSchema = [
  { key: 'name', label: '语言', type: 'text', placeholder: '如 英语' },
  { key: 'level', label: '水平', type: 'text', placeholder: 'CET-6' },
  { key: 'note', label: '备注', type: 'text', placeholder: '可流利沟通…' }
]
const trainingSchema = [
  { key: 'name', label: '培训/课程', type: 'text' },
  { key: 'issuer', label: '主办机构', type: 'text' },
  { key: 'date', label: '时间', type: 'text', placeholder: '如 2023' }
]
const portfolioSchema = [
  { key: 'title', label: '标题', type: 'text' },
  { key: 'url', label: '链接', type: 'text', placeholder: 'https://...' },
  { key: 'desc', label: '简介', type: 'text' }
]
</script>

<style scoped>
.mm-form { padding: 12px 0 30px; }
.mm-avatar { display: flex; align-items: center; gap: 12px; padding: 10px 16px 16px; }
.mm-avatar-label { font-size: 14px; color: #323233; }
.mm-clear { margin-left: 4px; }
.mm-radio-field :deep(.van-field__input) { min-height: auto; }
.mm-muted { color: #94a3b8; font-size: 12px; padding: 8px 18px 0; }
.mm-tagwrap { padding: 6px 16px; }
</style>