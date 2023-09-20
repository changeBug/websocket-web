import { ref } from 'vue'
import { defineStore } from 'pinia'
import { MsgData, UpdateUser, User } from '@/types';
import { $request } from '@/remote';
import { ElMessage } from 'element-plus';

// 检测窗口大小变化
export const useWindowSizeStore = defineStore('windowSize', () => {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const updateSize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  }

  return { width, height, updateSize };
});

// 存储当前登录用户信息
export const useUserStore = defineStore('user', () => {
  // 获取本地存储的登录信息
  const localUser = localStorage.getItem('userInfo');
  const userInfo = ref<User | undefined>(localUser ? JSON.parse(localUser) : undefined);
  const saveUserInfo = (user?: User) => {
    userInfo.value = user;
    localStorage.setItem('userInfo', JSON.stringify(user));
  }
  
  // 更新用户信息
  const updateUserInfo = async (data: UpdateUser) => {
    const res = await $request({
      url: '/users/update',
      method: 'post',
      params: data
    })
    if (res.code) {
      ElMessage.error(`更新用户信息失败：${res.msg}`);
      return;
    }
    ElMessage.success('更新成功');
    userInfo.value = { ...res.data, token: userInfo.value?.token };
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  }
  return { userInfo, saveUserInfo, updateUserInfo };
})

// 聊天列表
export const useChatRecordStore = defineStore('chatRecord', () => {
  const records = ref<MsgData[][]>([]);

  function updateChatRecord(chatList: MsgData[][]) {
    records.value = chatList;
  }

  return { records, updateChatRecord };
})