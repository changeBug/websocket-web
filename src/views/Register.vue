<template>
    <h1 class="title">欢迎{{ title }}</h1>
    <el-row class="main">
        <el-col :lg="12" :sm="24" :offset="0" class="left">
            <img src="@/assets/2.jpg" alt="花小烙">
        </el-col>
        <el-col :lg="12" :sm="24" :offset="0" class="right">
            <el-form :model="registerData" ref="registerForm" :rules="rules" label-width="120px" :inline="false" size="default">
                <el-form-item label="用户名称" prop="name" v-if="title === '注册'">
                    <el-input class="input" v-model="registerData.name" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="用户手机号" prop="phone">
                    <el-input class="input" v-model="registerData.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="用户密码" prop="pwd">
                    <el-input type="password" show-password class="input" v-model="registerData.pwd" placeholder="请输入用户密码" />
                </el-form-item>
                <el-form-item label="图片验证码" prop="captcha">
                    <el-input class="input" v-model="registerData.captcha" placeholder="验证码" />
                    <div @click="resetCaptchaSvg" class="svg" ref="captchaSvgEle"></div>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" size="default" @click="register(registerForm)">{{ title }}</el-button>
                    <el-button type="primary" size="default" @click="toPage">去{{ title === '登录' ? '注册' : '登录' }}</el-button>
                </el-form-item>
            </el-form>
            
        </el-col>
    </el-row>
    
</template>

<script lang="ts" setup name="Register">
    import { ElMessage, FormInstance, FormRules } from 'element-plus';
    import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
    import { RegisterData } from '../types/index';
    import { $request } from '../remote/index';
    import { useRoute, useRouter } from 'vue-router';
    import { useUserStore } from '@/stores';
    // 路由
    const router = useRouter();
    // 标题
    const title = ref<string>('注册');
    // 用户路由
    const route = useRoute();
    // 当前登录信息
    const userStore = useUserStore();
    // 图形验证码
    const captchaSvg = ref('');
    // form元素
    const registerForm = ref<FormInstance>();
    // 验证码元素
    const captchaSvgEle = ref<HTMLBaseElement | null>(null);
    // 用户数据
    const registerData = reactive<RegisterData>({
        name: '',
        phone: '',
        pwd: '',
        captcha: ''
    });
    // 检验
    //用户名校验
    const validateName = (rule: any, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请输入用户名'));
        } else if (value.length < 2 || value.length > 20) {
            callback(new Error('用户名长度2-20'));
        } else {
            callback();
        }
    }
    // 手机号校验
    const validatePhone = (rule: any, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请输入手机号'));
        } else if (!/^1[3456789]\d{9}$/.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }
    // 密码校验
    const validatePwd = (rule: any, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请输入密码'));
        } else if (value.length < 6 || value.length > 16) {
            callback(new Error('密码长度6-16'));
        } else {
            callback();
        }
    }
    const rules = reactive<FormRules<RegisterData>>({
        name: [{ validator: validateName, trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        pwd: [{ validator: validatePwd, trigger: 'blur' }],
        captcha: [{ required: true, message: '必填项目', trigger: 'blur' }],
    });
    // 注册|登录
    const register = async (formEl?: FormInstance) => {
        if (!formEl) return;
        const flag = await formEl.validate();
        if (flag) {
            const res = await $request({
                url: `/users/${title.value === '登录' ? 'login' : 'register'}`,
                method: 'POST',
                params: registerData
            });
            if (res.code) {
                ElMessage({
                    type: 'error',
                    message: `${title.value}失败：${res.msg}`
                });
                return;
            }
            if (title.value === '登录') {
                userStore.saveUserInfo(res.data);
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                router.push('/');
            }
            ElMessage({
                type: 'success',
                message: `${title.value}成功！`
            });
        }
    }

    // 请求图片验证码
    const getCaptchaSvg = async () => {
        const res = await $request({ url: '/users/captcha', config: { loading: false } });
        captchaSvg.value = res;
        nextTick(() => {    
            if (captchaSvgEle.value) {
                captchaSvgEle.value.innerHTML = res;
            }
        })
    }
    // 点击图片刷新验证码
    const resetCaptchaSvg = () => {
        getCaptchaSvg();
    }
    // 去注册/登录
    const toPage = () => {
        if (title.value === '登录') {
            router.push('/register');
        } else {
            router.push('/login');
        }
    }
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            register(registerForm.value);
        }
    }
    watch(
        () => route.name,
        (pathName) => {
            if (pathName === 'login') {
                title.value = '登录';
            } else {
                title.value = '注册';
            }
            registerForm.value?.resetFields();
            getCaptchaSvg();
        },
        { immediate: true }
    )
    // 初始化
    onMounted(async () => {
        await getCaptchaSvg();
        // 监听enter触发注册/登录
        window.addEventListener('keydown', handleKeyDown);
    })
    // 组件注销前
    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeyDown);
    })
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 768px) {
        .main {
            flex-direction: column;
            .right {
                .el-input {
                    width: 80%;
                }
            }
        }
    }
    .title {
        text-align: center;
        padding: 50px 0;
    }
    .left {
        text-align: center;
        img {
            width: 80%;
        }
    }
    .right {
        padding: 20px;
        .input {
            width: 50%;
            height: 40px;
        }
        .svg {
            width: 150px;
            height: 50px;
        }
        .el-form-item {
            margin-bottom: 30px;
        }
    }
</style>