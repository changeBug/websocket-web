<template>
    <div class="auth-edit">
        <div class="auth">
            <div class="auth-wrap">
                <img v-if="userInfo?.authUrl" :src="userInfo?.authUrl" alt="">
                <div v-else class="temp-auth">{{ userInfo?.name.slice(userInfo?.name.length - 2) }}</div>
                <div class="edit-auth-img" @click="openDialog('auth')">
                    <el-icon class="icon"><Edit /></el-icon>
                </div>
            </div>
        </div>
        <div class="id-wrap">
            <div class="id">
                <span class="label">ID: </span>
                <span class="value">{{ userInfo?.id }}</span>
            </div>
            <el-icon @click="copy" class="copy-icon"><CopyDocument /></el-icon>
        </div>
        <div class="id-wrap">
            <div>
                <span class="label">昵称: </span>
                <span class="value">{{ userInfo?.name }}</span>
            </div>
            <el-icon @click="openDialog('name')" class="copy-icon"><Edit /></el-icon>
        </div>
    </div>
    <!-- 修改用户信息弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        title="修改用户信息"
        :width="width < 768 ? '80%' : '30%'"
    >
        <div v-if="dialogType === 'name'" class="changeName">
            <el-input v-model="userName" placeholder="请输入昵称" />
        </div>
        <div v-else class="crop">
            <input ref="fileInput" style="display: none;" type="file" accept="image/*" @change="fileChange($event)"/>
            <div class="img-box">
                <img ref="img" id="img" :src="base64">
            </div>
            <el-button class="upload" type="primary" size="default" @click="selectImg">
                选择相册图片<el-icon class="el-icon--right"><Upload /></el-icon>
            </el-button>
        </div>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="saveAuth">保存</el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
    import Cropper from 'cropperjs';
    import { useUserStore, useWindowSizeStore } from '@/stores';
    import { nextTick, reactive, ref, watch } from 'vue';
    import { ElMessage } from 'element-plus';
    import { $request } from '@/remote';
    import { storeToRefs } from 'pinia';
    import { copyText } from '@/utils';
    // 打开弹窗的类型
    const dialogType = ref('auth');
    // 修改的用户昵称
    const userName = ref('');
    // 登录用户信息
    const userStore = useUserStore();
    // 更新用户信息
    const updateUserInfo = userStore.updateUserInfo;
    const { userInfo } = storeToRefs(userStore);
    // 当前窗口宽度
    const { width } = storeToRefs(useWindowSizeStore());
    // 选中的file
    const base64 = ref();
    // 修改用户信息弹窗
    const dialogVisible = ref(false);
    // 上传图片的input
    const fileInput = ref<HTMLInputElement>();
    // 选中图片的展示img
    const img = ref<HTMLImageElement>();
    // cropper配置
    const config = reactive<Cropper.Options>({
        viewMode: 2,
        aspectRatio: 1,
        zoomable: true
    })
    // cropper实例
    const cropper = ref<Cropper | null>(null);
    // 剪切图片返回file
    function crop(): Promise<File | ''> {
        return new Promise((resolve) => {
            if (cropper.value) {
                cropper.value.getCroppedCanvas().toBlob((blob) => {
                    if (!blob) {
                        resolve('');
                    } else {
                        resolve(new File([blob], '111.jpg', { type: 'image/jpg' }));
                    }
                })
            }
        })
    }
    // 上传剪切图片并更新用户头像
    async function saveAuth() {
        // 请求参数
        let params: any = {};
        if (dialogType.value === 'name') {
            if (!userName.value) {
                ElMessage.error('昵称不能为空');
                return;
            }
            params.name = userName.value;
        } else {
            if (!cropper.value || !base64.value) {
                ElMessage.error('请先选择图片');
                return;
            }
            const file = await crop();
            if (!file) {
                ElMessage.error('剪切失败');
                return;
            }
            const formData = new FormData();
            formData.append('file', file);
            const res = await $request({
                url: '/users/upload',
                method: 'post',
                params: formData
            })
            if (res.code) {
                ElMessage.error(res.msg);
                return;
            }
            params.authUrl = res.data;
        }
        await updateUserInfo(params);
        dialogVisible.value = false;
    }
    // 点击上传本地图片调用input[file]的点击事件
    function selectImg () {
        if (fileInput.value) {
            fileInput.value.click();
        }
    }
    // 选中图片更换cropper剪切图片
    function fileChange(event: any) {
        if (!event.target.files || !event.target.files.length) {
            return;
        }
        const file = event.target.files[0];
        const readFile = new FileReader();
        readFile.readAsDataURL(file);
        readFile.onload = () => {
            base64.value = readFile.result;
            if (readFile.result) {
                cropper.value?.replace(readFile.result as string);
            }
        }
    }
    // 点击复制id
    function copy() {
        copyText(userInfo.value?.id.toString());
        ElMessage.success('复制成功');
    }
    function openDialog(type: string) {
        dialogType.value = type;
        dialogVisible.value = true;
    }
    // 监听弹窗打开初始化cropper
    watch(dialogVisible, () => {
        if (dialogVisible.value) {
            if (dialogType.value === 'auth') {
                // 创建cropper实例
                nextTick(() => {
                    selectImg();
                    if (img.value) {
                        cropper.value = new Cropper(img.value, config);
                    }
                })
            } else {
                userName.value = userInfo.value?.name || '';
            }
        } else {
            base64.value = '';
            userName.value = '';
        }
    })
</script>

<style scoped lang="scss">
    .auth-edit {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .auth {
            position: relative;
            .auth-wrap {
                width: 80px;
                height: 80px;
                overflow: hidden;
                border-radius: 50%;
                img {
                    width: 100%;
                }
                .temp-auth {
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    font-size: 26px;
                    font-weight: bold;
                    color: $authColor;
                    overflow: hidden;
                    line-height: 76px;
                    border: 2px solid $authColor;
                    box-sizing: border-box;
                    border-radius: 50%;
                    background-color: #fff;
                }
            }
            .edit-auth-img {
                cursor: pointer;
                position: absolute;
                bottom: 2px;
                right: -10px;
                width: 20px;
                height: 20px;
                font-size: 16px;
                font-weight: bold;
            }
        }
        .label {
            color: #999;
        }
        .value {
            color: #555;
        }
        .id-wrap {
            display: flex;
            align-items: center;
            padding: 20px 0;
            color: #999;
            .copy-icon {
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
    .crop {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .upload {
            height: 40px;
            margin-top: 20px;
        }
        .img-box {
            width: 80%;
            img {
                width: 100%;
            }
        }
    }
</style>