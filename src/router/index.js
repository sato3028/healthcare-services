import {createRouter, createWebHashHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import User from '../views/User.vue';
import Mypage from '../views/Mypage.vue';
import Post from '../views/Post.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login',
        hideMenu: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        title: 'Profile'
      }
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta: {
        title: 'User'
      }
    },
        {
      path: '/mypage',
      name: 'Mypage',
      component: Mypage,
      meta: {
        title: 'Mypage'
      }
    },
    {
      path: '/post',
      name: 'Post',
      component: Post,
      meta: {
        title: 'Post'
      }
    },
  ]
})

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router
