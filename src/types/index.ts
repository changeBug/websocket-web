export interface RegisterData {
    phone: string
    pwd: string
    captcha: string
    name: string
}

export interface User {
    id: number
    name: string
    phone: string
    token?: string
    authUrl?: string
}

export interface UpdateUser {
    name?: string
    phone?: string
    password?: string
    authUrl?: string
}

export interface MsgData {
    id: number
    msg: string
    type: string
    isDelete: boolean
    isRead: boolean
    userId: number
    friendId: number
    createdAt: Date
    name: string
    friendName: string
    authUrl?: string
    friendAuthUrl?: string
}