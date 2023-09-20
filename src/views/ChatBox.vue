<template>
    <div v-if="type === 'notify'" class="notify">{{ msg }}</div>
    <div v-else class="chart-box">
        <div v-if="!isSelf" class="chart-item">
            <div class="auth">
                <img v-if="authUrl" :src="authUrl" alt="">
                <div v-else class="temp-auth">{{ authName ? authName.slice(authName.length - 2) : '' }}</div>
            </div>
            <div class="msg-box">
                <div class="auth-name">{{ authName }}</div>
                <div class="msg">{{ msg }}</div>
            </div>
        </div>
        <div v-else class="chart-item self">
            <div class="msg-box">
                <div class="auth-name">{{ authName }}</div>
                <div class="msg">{{ msg }}</div>
            </div>
            <div class="auth">
                <img v-if="authUrl" :src="authUrl" alt="">
                <div v-else class="temp-auth">{{ authName ? authName.slice(authName.length - 2) : '' }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps({
        msg: { type: String, required: true },
        authUrl: { type: String, required: false },
        isSelf: { type: Boolean, default: false },
        authName: { type: String, required: false },
        type: { 
            type: String, required: false, default: 'msg',
            validator: (value: string) => {
                return ['msg', 'notify'].includes(value);
            }
        },
    })
</script>

<style lang="scss" scoped>
    .notify {
        padding: 20px;
        text-align: center;
        color: #ccc;
    }
    .chart-box {
        padding: 10px;
        .chart-item {
            display: flex;
            align-items: center;
            &.self {
                justify-content: flex-end;
                .auth {
                    margin-left: 10px;
                }
                .msg-box {
                    .auth-name {
                        text-align: right;
                    }
                }
            }
            .auth {
                border: 1px solid rgba($color: $authColor, $alpha: .8);
                margin-right: 10px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 100%;
                }
                .temp-auth {
                    width: 100%;
                    font-size: 20px;
                    text-align: center;
                    font-weight: bold;
                    line-height: 50px;
                    color: $authColor;
                    background-color: #fff;
                }
            }
            .msg-box {
                .auth-name {
                    margin-bottom: 5px;
                    font-weight: bold;
                    font-size: 12px;
                    color: #aaa;
                }
                .msg {
                    box-shadow: 0 0 7px 2px rgba($color: #000000, $alpha: .5);
                    background-color: #b3c0d1;
                    padding: 5px;
                    border-radius: 10px;
                    max-width: 200px;
                    white-space: normal;
                    word-wrap: break-word;
                }
            }
        }
    }
</style>