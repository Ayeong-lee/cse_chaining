import {createRouter, createWebHistory} from 'vue-router'
import PageHome from '@/views/PageHome.vue'
import Board_Rest from "@/views/board/Board_Rest.vue"
import Login_Rest from '@/views/Login_rest.vue'
import Account from '@/views/account.vue'
import store from '../store';

const routes = [
    {
        path: '/',
        name: 'PageHome',
        component: PageHome
    },
    {
        path: '/account',
        name: 'Account',
        component: Account
    },
    {
        path: '/register2',
        name: 'register2',
        component: () => import('../views/member_Register2.vue')
    },
    {
        path: '/login',
        name: 'login_rest',
        component: Login_Rest
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/member_Register.vue')
    },
    {
        path: '/Profile',
        name: 'Profile',
        component: () => import('../views/Nft/Nfts.vue')
    },
    {
        path: '/connect',
        name: 'connect',
        component: () => import('../views/Contract/connect.vue')
    },
    {
        path: '/showNFT',
        name: 'showNFT',
        component: () => import('../views/Nft/Nfts_get.vue')
    },
    {
        path: '/Publish',
        name: 'Publish',
        component: () => import('../views/Nft/Nfts_post.vue')
    },
    // {
    //     path: '/sendCompleted',
    //     name: 'sendCompleted',
    //     component: () => import('../views/Contract/sendComplete.vue')
    // },
    {
        path: '/BoardRest',
        name: 'Board',
        component: () => import('../views/Board.vue'),
        children: [
            {
                path: '',
                name: 'BoardRest',
                component: Board_Rest,
            },
            {
                path: '/BoardView',
                name: 'BoardView',
                component: () => import('../views/board/Board_RestView.vue'),
            },
            {
                path: '/boardRestWrite',
                name: 'boardRestWrite',
                component: () => import('../views/board/Board_RestWrite.vue'),
                meta: { requireLogin: true }
            },
            {
                path: '/boardRestedit',
                name: 'BoardRestEdit',
                component: () => import('../views/board/Board_RestEdit.vue'),
                meta: { requireLogin: true }
            },
        ]
    },
    {
        path: '/about',
        name: 'PageAbout',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/PageAbout.vue')
    },
    // {
    //     path: '/score',
    //     name: 'Score',
    //     component: () => import('../views/Score.vue'),
    //     // beforeEnter: (to, from, next) => {
    //     //     const isLogin = store.getters['loginStore/isLogin'];
    //     //     if (!isLogin) {
    //     //         next('/login?returnUrl=' + to.fullPath);
    //     //     } else {
    //     //         next();
    //     //     }
    //     // }
    // }
    // {
    //     path: '/board/list',
    //     name: 'BoardList',
    //     component: BoardList
    // },
    // {
    //     path: '/board/detail',
    //     name: 'BoardDetail',
    //     component: BoardDetail
    // },
    // {
    //     path: '/board/write',
    //     name: 'BoardWrite',
    //     component: BoardWrite
    // },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
router.beforeEach((to, from, next) => {
    console.log(to);
    if (to.matched.some(record => record.meta.requireLogin)) {
        const isLogin = store.getters['loginStore/isLogin'];
        if (!isLogin) {
            var result = confirm("로그인되어야 사용 가능합니다.\n로그인 하시겠습니까?");
            if (result) {
                next({name: 'login_rest', query: { returnUrl: to.fullPath }});
            }
        } else {
            next();
        }
    } else {
        next();
    }
});
export default router