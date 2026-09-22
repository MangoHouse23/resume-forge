import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/editor/:id?', name: 'editor', component: () => import('@/views/EditorView.vue') }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})