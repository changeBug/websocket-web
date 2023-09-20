<template>
    <div class="aside">
        <div class="chat-item" v-for="(item, index) in chatRecordStore.records" :key="index">
            <div v-if="getPoint(index)" class="chat-point">{{ getPoint(index) }}</div>
            <div class="chat-item-author">
                <img :src="getChatRecord(index).friendAuthUrl" alt="" srcset="">
            </div>
            <div class="chat-info">
                <div class="chat-name">{{ getChatRecord(index).friendName }}</div>
                <div class="chat-msg">{{ item[0].msg }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useChatRecordStore, useUserStore } from '@/stores';
    import { computed } from 'vue';
    const userStore = useUserStore();
    const chatRecordStore = useChatRecordStore();

    // 获取聊天框头像&名字
    const getChatRecord =  computed(() => (index: number) => {
        const userId = userStore.userInfo?.id;
        const record = chatRecordStore.records[index].find(o => o.friendId === userId);
        return { friendAuthUrl: record?.authUrl, friendName: record?.name };
    })

    // 获取小红点
    const getPoint = computed(() => (index: number) => {
        const record = chatRecordStore.records[index].filter(o => o.friendId === userStore.userInfo?.id && !o.isRead);
        return record.length;
    })
</script>

<style lang="scss" scoped>
    .aside {
        box-sizing: border-box;
        width: 100%;
        .chat-item {
            box-sizing: border-box;
            width: 100%;
            display: flex;
            padding: 10px;
            height: 60px;
            position: relative;
            &:hover {
                background-color: #ddd;
            }
            .chat-point {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background-color: red;
                position: absolute;
                top: 3px;
                left: 43px;
                color: #fff;
                text-align: center;
                line-height: 14px;
            }
            .chat-item-author {
                width: 40px;
                margin-right: 10px;
                overflow: hidden;
                border-radius: 5px;
                img {
                    width: 100%;
                }
            }
            .chat-info {
                .chat-name {
                    color: #555;
                }
                .chat-msg {
                    color: #999;
                }
            }
        }
    }
</style>