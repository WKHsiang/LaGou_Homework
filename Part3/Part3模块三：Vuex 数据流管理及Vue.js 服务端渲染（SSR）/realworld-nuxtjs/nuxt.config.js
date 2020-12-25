module.exports = {
    router: {
        // 自定义路由表规则
        extendRoutes(routes, resolve) {

            // 清除Nuxt自动生成的路由表规则
            routes.splice(0)

            routes.push(...[
                {
                    path: "/",
                    component: resolve(__dirname, "pages/layout/"),
                    children: [
                        {
                            path: "",
                            name: "home",
                            component: resolve(__dirname, "pages/home/")
                        },
                        {
                            path: '/login',
                            name: 'login',
                            component: resolve(__dirname, 'pages/login/')
                        },
                        {
                            path: '/register',
                            name: 'register',
                            component: resolve(__dirname, 'pages/login/')
                        },
                        {
                            path: '/settings',
                            name: 'settings',
                            component: resolve(__dirname, 'pages/settings/')
                        },
                        {
                            path: '/profile/:id',
                            name: 'profile',
                            component: resolve(__dirname, 'pages/profile/')
                        },
                        {
                            path: '/createarticle',
                            name: 'createarticle',
                            component: resolve(__dirname, 'pages/createarticle/')
                        },
                        {
                            path: '/editarticle/:id',
                            name: 'editarticle',
                            component: resolve(__dirname, 'pages/editarticle/')
                        },
                        {
                            path: '/article',
                            name: 'article',
                            component: resolve(__dirname, 'pages/article/')
                        },
                    ]
                }
            ])
        }
    }
}