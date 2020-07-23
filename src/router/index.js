import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";
import findLast from "lodash/findLast";
import { notification } from "ant-design-vue";

import "nprogress/nprogress.css";
import NotFound from "../views/404";
import Forbidden from "../views/403";
import { isLogin, checkAuthority } from "../Authority/Authority";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    // 注册路由
    {
      hideInMenu: true,
      path: "/user",
      component: () =>
        // webpackChunkName 通过标识符，让webpack打包做到分包，把相同名字的组件打包到一起
        import(/* webpackChunkName: "user" */ "../layouts/UserLayout"),
      children: [
        // 通过重定向路由，简化访问路径，方便用户输入地址
        {
          path: "/user",
          redirect: "/user/login"
        },
        {
          path: "/user/login",
          name: "login",
          component: () =>
            import(/* webpackChunkName: "user" */ "../views/User/Login")
        },
        {
          path: "/user/register",
          name: "register",
          component: () =>
            import(/* webpackChunkName: "user" */ "../views/User/Register")
        }
      ]
    },
    // 根路由 - 匹配到页面框架组件
    {
      path: "/",
      component: () =>
        import(/* webpackChunkName: "layout" */ "../layouts/BasicLayout"),
      children: [
        // dashboard
        /*
          为什么通过重定向的方式二次跳转：这里把框架和视图拆分了.
          所以要继续往视图路由跳转。把内容视图组件渲染到框架的router-view中
        */

        {
          path: "/",
          redirect: "/dashboard/analysis"
        },
        {
          path: "/dashboard",
          meta: { icon: "dashboard", title: "仪表盘", authority: ["user"] },
          name: "dashboard",
          component: { render: h => h("router-view") },
          children: [
            {
              path: "/dashboard/analysis",
              meta: { title: "分析页" },
              name: "analysis",
              component: () =>
                import(
                  /* webpackChunkName: "dashboard" */ "../views/Dashboard/Analysis"
                )
            }
          ]
        },
        // form
        {
          path: "/form",
          name: "form",
          meta: { icon: "form", title: "表单" },
          component: { render: h => h("router-view") },
          children: [
            {
              path: "/form/basic-form",
              name: "basicform",
              meta: { title: "基础表单", authority: ["admin"] },
              component: () =>
                import(
                  /* webpackChunkName: "form" */ "../views/Forms/BasicForm"
                )
            },
            {
              path: "/form/step-form",
              name: "stepform",
              hideChildrenInMenu: true,
              meta: { title: "分布表单" },
              component: () =>
                import(
                  /* webpackChunkName: "form" */ "../views/Forms/StepForm"
                ),
              children: [
                {
                  path: "/form/step-form",
                  redirect: "/form/step-form/info"
                },
                {
                  path: "/form/step-form/info",
                  name: "info",
                  component: () =>
                    import(
                      /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step1"
                    )
                },
                {
                  path: "/form/step-form/confirm",
                  name: "confirm",
                  component: () =>
                    import(
                      /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step2"
                    )
                },
                {
                  path: "/form/step-form/result",
                  name: "result",
                  component: () =>
                    import(
                      /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step3"
                    )
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: "*",
      name: "404",
      hideInMenu: true,
      component: NotFound
    },
    {
      path: "/403",
      name: "403",
      hideInMenu: true,
      component: Forbidden
    }
  ]
});

// 权限判断。如果先判断login信息则每个路由都需要判断
// 所以先判断权限，如果不通过则判断login
// 判断login，如果未登录，则跳转登录页面

router.beforeEach((to, from, next) => {
  console.log(to.matched);
  if (to.path !== from.path) {
    NProgress.start();
  }
  const record = findLast(to.matched, record => {
    if (record.meta.authority && record.meta.authority.length) {
      return record.meta.authority;
    }
  });
  if (record && !checkAuthority(record.meta.authority)) {
    // 未登录
    if (!isLogin() && to.path !== "/user/login") {
      next({
        path: "/user/login"
      });
    } else if (to.path !== "/403") {
      // 已登录 - 无权限
      notification.error({
        message: "403",
        description: "你没有权限访问，请联系管理员咨询。"
      });
      next({
        path: "/403"
      });
    }
    NProgress.done();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
