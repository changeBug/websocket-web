import { useUserStore } from "@/stores";
import axios, { AxiosRequestConfig } from "axios";
import { ElLoading, ElMessage } from "element-plus";
import { io } from 'socket.io-client';

const axiosInstance = axios.create({
    withCredentials: true
})

// 请求配置
interface Config {
    loading?: boolean,
    showErr?: boolean
}
// 默认配置
const defaultConfig: Config = {
    loading: true,
    showErr: true
}
// 请求参数配置
interface RequestConfig {
    url: string,
    method?: 'get' | 'GET' | 'POST' | 'post',
    params?: any,
    config?: Config,
    headers?: AxiosRequestConfig['headers']
}
// 请求地址
const BASE_URL = import.meta.env.VITE_BASE_URL;


export const $request = async (data: RequestConfig) => {
    const userStore = useUserStore();
    let { config, url, method, params, headers } = data;
    // 初始化
    config = config || defaultConfig;
    method = method || 'GET';
    let loading: any;
    if (config && config.loading) {
        loading = ElLoading.service({
            lock: true,
            text: '加载中....',
            background: 'rgba(0, 0, 0, 0.7)'
        })
    }
    try {
        const res = await axiosInstance.request({
            url: url.includes('http') ? url : BASE_URL + url,
            method,
            headers: { Authorization: `bearer ${userStore.userInfo?.token}`, ...(headers || {}) },
            data: method.toUpperCase() === 'POST' ? params : null,
            params: method.toUpperCase() === 'GET' ? params : null
        })
        if (config && config.loading) {
            loading.close();
        }
        return res.data;
    } catch(e: any) {
        console.log(`加载失败：${e.message}`);
        if (config.showErr) {
            ElMessage({
                type: 'error',
                message: `请求失败：${e.message}`
            })
        }
        if (config && config.loading) {
            loading.close();
        }
    }
}

export const $socket = (url: string, params: any = {}) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return io(BASE_URL + url, { 
        transports: ['websocket'],
        query: {
            ...params,
            userId: userInfo.id,
            userName: userInfo.name,
            userAuthUrl: userInfo.authUrl,
            token: userInfo.token
        },
    })
}