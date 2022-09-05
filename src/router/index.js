import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Uploader from "@/components/Uploader";
import AdminSignUp from "@/views/AdminSignUp";

Vue.use(VueRouter)

const routes = [
  {
    path: '/sign-up',
    name: 'SignUp',
    component: Home,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/myMap',
    name: 'MyMap',
    component: () => import('../views/MyMap.vue')
  },
  {
    path: '/customer-main',
    name: 'CustomerMain',
    component: () => import('../views/CustomerMain.vue')
  },
  {
    path: '/driver-main',
    name: 'DriverMain',
    component: () => import('../views/DriverMain.vue')
  },
  {
    path: '/test-upload',
    name: "Uploader",
    component: () => import('../components/Uploader.vue')
  },
  {
    path: '/20f14048540580e8c663373a2cbe671fc7cd338dd291a035e65fb8ccd',
    name: "AdminMain",
    component: () => import('../views/AdminMain.vue')
  },
  {
    path: '/l0g1nf14048540580e8c663373a2cbe671f7cd8dd291a035e65fb8ccd',
    name: "AdminLogin",
    component: () => import('../views/AdminLogin.vue')
  },
  {
    path: '/o9f1404854d78m2m3dc4243241be671fc7cd338dd291a035e65fb8cc1',
    name: "AdminSignUp",
    component: () => import('../views/AdminSignUp.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
