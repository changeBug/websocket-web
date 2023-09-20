<template>
    <el-container :style="{ width: windowStore.width + 'px', padding: 0, height: windowStore.height + 'px' }">
        <el-header class="header" height="60px">
            <Header @collapse="collapse" />
        </el-header>
        <el-container>
            <Transition name="collapse">
                <el-aside v-show="!collapsed" class="aside">
                    <Aside />
                </el-aside>
            </Transition>
            <el-container>
                <el-main :style="{ height: (windowStore.height - 160) +'px',  position: 'relative' }">
                    <div ref="msgEle" class="main">
                        <div class="scroll">
                            <div class="online">{{ onlineCount }}</div>
                            <TransitionGroup name="msg">
                                <div v-for="(msg, index) in msgs" :key="index">
                                    <MsgBox :auth-url="msg.authUrl" :msg="msg.msg" :is-self="msg.isSelf" :auth-name="msg.userName" :type="msg.type" />
                                </div>
                            </TransitionGroup>
                        </div>
                    </div>
                </el-main>
                <el-footer class="foot" :height="windowStore.width <= 768 ? '60px' : '80px'">
                    <Footer @sendMsg="sendMsg" />
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
    
</template>

<script setup lang="ts" name="home">
    import MsgBox from './ChatBox.vue';
    import Header from './Header.vue';
    import Aside from './Aside.vue';
    import Footer from './Footer.vue';
    import { removeLoginInfo } from '@/utils';
    import { MsgData } from '@/types';
    import { useWindowSizeStore, useUserStore, useChatRecordStore } from '@/stores';
    import { $socket } from '@/remote';
    import { nextTick, onBeforeUnmount, ref, TransitionGroup, watch } from 'vue';
    import { ElMessage } from 'element-plus';
    // 连接websocket
    const chat = $socket('', { room: '1' });
    // 是否是在线
    const connectEd = ref(false);
    // 聊天框元素
    const msgEle = ref<HTMLBaseElement | null>(null);
    // 在线人数
    const onlineCount = ref(0);
    // 聊天信息
    const msgs = ref<any[]>([]);
    // 窗口尺寸
    const windowStore = useWindowSizeStore();
    // 当前登录用户信息
    const userStore = useUserStore();
    // 聊天列表
    const chatRecordStore = useChatRecordStore();
    // 是否折叠侧边栏
    const collapsed = ref(false);
    // 监听连接服务器事件
    chat.on('connect', () => {
        connectEd.value = true;
    })
    chat.on('chatList', (data: MsgData[][]) => {
        chatRecordStore.updateChatRecord(data);
    })
    // 监听错误
    chat.on('error', (error: string) => {
        ElMessage.error(error);
        if (error === '您还没有登录,请先登录!') {
            chat.disconnect();
            connectEd.value = false;
            removeLoginInfo();
        }
    })
    // 监听服务器断开
    chat.on('disconnect', () => {
        connectEd.value = false;
    })
    // 点击发送信息
    function sendMsg(msg: string) {
        if (connectEd.value) {
            chat.emit('chat', msg);
        }
    }

    // 点击折叠/展开侧边栏
    function collapse(isCollapsed: boolean) {
        collapsed.value = isCollapsed;
    }
    // 接受信息
    chat.on('message', (data: any) => {
        msgs.value.push({
            type: data.type,
            userId: data.userInfo.id,
            userName: data.userInfo.name,
            authUrl: data.userInfo.authUrl,
            msg: data.msg,
            isSelf: userStore.userInfo?.id === Number(data.userInfo.id)
        });
        msgs.value = msgs.value.map((item) => {
            if (item.userId === data.userInfo.id && (item.authUrl !== data.userInfo.authUrl || item.userName !== data.userInfo.name)) {
                item.userName = data.userInfo.name;
                item.authUrl = data.userInfo.authUrl;
            }
            return item;
        })
    })
    // 在线人数
    chat.on('onlineCount', (onlineNum) => {
        onlineCount.value = onlineNum;
    })
    
    // 组件销毁前
    onBeforeUnmount(() => {
        chat.emit('leaveGroup');
    })
    // 监听消息，滚动到底部
    watch(
        () => msgs.value.length,
        () => {
            nextTick(() => {
                if (msgEle.value) {
                    msgEle.value.scrollTop = msgEle.value.scrollHeight;
                }
            })
    })

</script>

<style lang="scss" scoped>
    .header {
        width: 100%;
        background-color: #b3c0d1;
        margin: 0;
        padding: 0;
        padding: 0 10px;
    }
    .aside {
        width: 200px;
        overflow: hidden;
        background-color: #ccc;
    }
    .foot {
        background-color: #b3c0d1;
        padding: 0;
        transition: all 0.5s ease;
    }
    @media screen and (max-width: 768px) {
        .aside {
            width: 100px;
        }
        .foot {
            background-color: #b3c0d1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }
    }
    .main {
        transition: all 0.5s ease;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        .online {
            position: absolute;
            top: 0;
            left: 10px;
            font-size: 12px;
            &::after {
                content: '';
                position: absolute;
                top: 4px;
                right: 8px;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: lawngreen;
            }
        }
    }

    // 消息框出没动画
    .msg-move, /* 对移动中的元素应用的过渡 */
    .msg-enter-active,
    .msg-leave-active {
        transition: all 0.5s ease;
    }
    .msg-enter-from,
    .msg-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    .msg-leave-active {
        position: absolute;
    }

    // 侧边栏打开收起动画
    .collapse-move, /* 对移动中的元素应用的过渡 */
    .collapse-leave-active,
    .collapse-enter-active {
        transition: all 0.5s ease;
    }
    .collapse-leave-to,
    .collapse-enter-from {
        width: 0;
    }
</style>