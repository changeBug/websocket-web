<template>
        <div class="foot-input">
            <el-input
                ref="chatInput"
                type="textarea"
                @keypress.enter.native.prevent="countKeyPressTime($event as KeyboardEvent)"
                @keyup.enter.native.prevent="countKeyPressTime($event as KeyboardEvent)"
                v-model="chatValue"
                placeholder="输入聊天内容"
                clearable
                resize="none"
                :input-style="{ height: '100%', fontSize: '16px', boxSizing: 'border-box' }"
            />
            <el-button type="primary" size="default" @click="sendMsg">发送</el-button>
            
        </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    const chatValue = ref('');
    const chatInput = ref<HTMLBaseElement | null>(null);
    const emit = defineEmits(['sendMsg']);
    // 按下按键的时间
    const timestamp = ref(0);
    const isLineFree = ref(false);

    // 按键松开时计算按下了多久
    function countKeyPressTime(e: KeyboardEvent) {
        if (e.ctrlKey && e.keyCode === 13 && e.type === 'keyup') {
            chatValue.value += '\n';
            timestamp.value = 0;
            return;
        }
        if (!timestamp.value && e.type === 'keypress' && !isLineFree.value) {
            timestamp.value = Date.now();
        }
        if (e.type === 'keypress' && !isLineFree.value) {
            if (Date.now() - timestamp.value > 1000) {
                chatValue.value += '\n'
                timestamp.value = 0;
                isLineFree.value = true;
                return;
            }
        }
        if (e.type === 'keyup') {
            if (!isLineFree.value) sendMsg();
            timestamp.value = 0;
            isLineFree.value = false;
        }
    }
    // 发送信息
    function sendMsg() {
        if (/^\s*$/.test(chatValue.value)) return;
        emit('sendMsg', chatValue.value);
        chatValue.value = '';
    }
</script>

<style scoped>
    .foot-input {
        display: flex;
        width: 100%;
        height: 100%;
        .el-input {
            height: 50px;
            width: 60%;
            margin-right: 20px;
            font-size: 16px;
        }
        .el-button {
            height: 60px;
            display: none;
        }
    }
    @media screen and (max-width: 768px) {
        .foot-input {
            display: flex;
            width: 100%;
            .el-input {
                height: 50px;
                width: 60%;
                margin-right: 20px;
                font-size: 16px;
            }
            .el-button {
                height: 58px;
                display: block;
            }
        }
    }
</style>