<template>
    <div class="header">
        <div class="collapse" @click="collapse">
            <el-icon>
                <Transition name="collapse">
                    <Expand v-if="collapsed" />
                    <Fold v-else />
                </Transition>
            </el-icon>
        </div>
        <div class="add-friend">
            <input v-model="searchUserId" class="search-user" placeholder="搜索用户Id" type="text" />
            <el-icon @click="handleSearch" class="icon"><Search /></el-icon>
        </div>
        <div class="auth-center" @click="authEditOpen = !authEditOpen">
            <div class="auth-info">
                <div class="auth-name">
                    {{ userInfo?.name }}
                </div>
                <div class="online" :style="{ backgroundColor: 'lawngreen' || '#999' }"></div>
            </div>
            <div class="auth">
                <img v-if="userInfo?.authUrl" :src="userInfo?.authUrl" alt="">
                <div v-else class="temp-auth">{{ userInfo?.name }}</div>
            </div>
        </div>
    </div>
    <!-- 点击用户头像的用户信息编辑 -->
    <el-drawer
        class="auth-drawer"
        v-model="authEditOpen"
        title="用户详情"
        direction="rtl"
        :size="windowStore.width < 768 ? '80%' : '30%'"
    >
        <AuthEdit />
    </el-drawer>
</template>

<script lang="ts" setup>
    import { useUserStore, useWindowSizeStore } from '@/stores';
    import AuthEdit from './AuthEdit.vue';
    import { ref } from 'vue';
    import { storeToRefs } from 'pinia';
import { $request } from '@/remote';
    // 登录用户信息
    const { userInfo } = storeToRefs(useUserStore());
    const windowStore = useWindowSizeStore();
    const collapsed = ref(false);
    const authEditOpen = ref(false);
    const emit = defineEmits(['collapse']);
    const searchUserId = ref('');

    function collapse() {
        collapsed.value = !collapsed.value;
        emit('collapse', collapsed.value);
    }

    async function handleSearch() {
        if (!searchUserId.value) return;
        const user = await $request({
            url: `/users/${searchUserId.value}`,
            config: {
                loading: false
            }
        });
        console.log(user);
        
    }

</script>

<style lang="scss" scoped>
    .header {
        display: flex;
        height: 100%;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        .collapse {
            user-select: none;
            cursor: pointer;
            border-radius: 50%;
            background-color: #ccc;
            width: 40px;
            height: 40px;
            color: #555;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.5s ease;
            .el-icon {
                transition: all 0.5s ease;
            }
            &:hover {
                box-shadow: 0 0 14px #fff;
            }
            &:hover .el-icon{
              transform: scale(1.2);
            }
        }
        .auth-center {
            cursor: pointer;
            display: flex;
            align-items: center;
            height: 100%;
            .auth {
                border: 1px solid $authColor;
                border-radius: 50%;
                height: 40px;
                width: 40px;
                overflow: hidden;
                img {
                    height: 100%;
                }
                .temp-auth {
                    width: 100%;
                    font-size: 16px;
                    text-align: center;
                    font-weight: bold;
                    line-height: 40px;
                    color: $authColor;
                    background-color: #fff;
                }
            }
            .auth-info {
                height: 80%;
                margin-right: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                .auth-name {
                    font-size: 18px;
                    font-weight: bold;
                }
                .online {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: lawngreen;
                }
            }
        }
        .add-friend {
            overflow: hidden;
            border-radius: 10px;
            width: 30px;
            transition: all 0.5s ease;
            position: relative;
            .icon {
                position: absolute;
                cursor: pointer;
                top: 7px;
                right: 5px;
            }
            &:hover {
                width: 200px;
                .search-user {
                    border-color: rgba($color: #000000, $alpha: 0.3);
                }
            }
            .search-user {
                transition: all 0.5s ease 0.1s;
                border-radius: 10px;
                box-sizing: border-box;
                width: 100%;
                height: 30px;
                border: none;
                outline: none;
                padding: 10px 30px 10px 20px;
                background-color: #B5C0CF;
                caret-color: #555;
                color: #555;
                font-size: 14px;
                border: solid 1px transparent;
            }
        }
        
    }

    .collapse-enter-active {
        transition: all 0.5s ease;
    }
    .collapse-enter-from {
        opacity: 0;
    }
</style>