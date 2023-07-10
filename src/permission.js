import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getToken
} from '@/utils/auth'
import {
  isRelogin
} from '@/utils/request'
import {
  getInfo
} from "@/api/login";
NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login', '/register']

function getUserInfoToLogin(to, from, next) {
  if (store.getters.roles.length === 0) {
    isRelogin.show = true
    // 判断当前用户是否已拉取完user_info信息
    store.dispatch('GetInfo').then((res) => {
      isRelogin.show = false
      store.dispatch('GenerateRoutes').then(accessRoutes => {
        // 根据roles权限生成可访问的路由表
        router.addRoutes(accessRoutes) // 动态添加可访问路由表
        const ind = res.roles.findIndex(item => {
          return item == 'dispatcher' || item == 'handler'
        });
        if (ind > -1&&to.path!='/mytask'&&to.path!='/user/profile'&&to.path!='/mytask/detail') {
          next({
            path: '/mytask'
          })
        } else {
          next({
            ...to,
            replace: true
          }) // hack方法 确保addRoutes已完成
        }


      })
    }).catch(err => {
      store.dispatch('LogOut').then(() => {
        Message.error(err)
        next({
          path: '/'
        })
      })
    })
  } else {
    const ind = store.getters.roles.findIndex(item => {
      return item == 'dispatcher' || item == 'handler'
    });
    if (ind > -1&&to.path!='/mytask'&&to.path!='/user/profile'&&to.path!='/mytask/detail') {
      next({
        path: '/mytask'
      })
    } else {
      next()
    }  
   
  }
}

function getUserIsResponisibly() {
  return new Promise(function (resolve) {
    getInfo().then(res => {
      if (res.roles && res.roles.length > 0) {
        const ind = res.roles.findIndex(item => {
          return item == 'dispatcher' || item == 'handler'
        });
        resolve(ind) 
      }
    })
  })

}

router.beforeEach((to, from, next) => {
  NProgress.start();
  const token = to.query.token || null;
  //URL带token处理
  if (token) {
    store.dispatch("LoginSSO", token).then(() => {
      // 刷新页面
      getToken();
      to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
      /* has token*/
      getUserInfoToLogin(to, from, next);

    })
  } else if (getToken()) { //登录未失效
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      getUserIsResponisibly().then(ind => {
        if (ind > -1) {
          next({
            path: '/mytask'
          })
        } else {
          next({
            path: '/'
          })
         
        }
      })

      NProgress.done()
    } else {
      getUserInfoToLogin(to, from, next);
    }
  } else {
    //尚未登录 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
