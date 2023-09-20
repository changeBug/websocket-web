import { useUserStore } from "@/stores";

// 随机字符串
export const randomString = (num: number) => {
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < num; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

// 去除登录信息，跳转到登录页面
export const removeLoginInfo = () => {
    localStorage.removeItem('userInfo');
    const userStore = useUserStore();
    userStore.saveUserInfo();
    window.location.href = '/login';
}

// 复制内容
export const copyText = (text?: string) => {
    if (!text) {
        return;
    }
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}