import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Create from '../views/Create.vue'
import Update from '../views/Update.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta:{
      title:"หน้าแรก"
    },
  },
  {
    path: '/Create',
    name: 'Create',
    component: Create,
    meta:{
      title:"เพิ่มข้อมูล"
    },
  },
  {
    path: '/Update/:id',
    name: 'Update',
    component: Update,
    meta:{
      title:"แก้ไข"
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) =>{
  document.title = `${to.meta.title}`;  
  next();
  })

export default router
