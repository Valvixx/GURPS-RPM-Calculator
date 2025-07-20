// router.js
import { createRouter, createWebHistory } from 'vue-router'
import IncantationMagic from './views/IncantationMagic.vue'
import RPM from "./views/RPM.vue";

const routes = [
    { path: '/', name: 'RPM', component: RPM },
    { path: '/incantation', name: 'IncantationMagic', component: IncantationMagic },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
