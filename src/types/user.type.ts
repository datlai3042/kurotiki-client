export interface UserAddress {
      _id: string
      address_street: string
      address_ward: {
            code: string
            text: string
      }
      address_district: {
            code: string
            text: string
      }
      address_province: {
            code: string
            text: string
      }
      address_text: string

      type: 'Home' | 'Company' | 'Private'
      address_default: boolean
      address_creation_time: Date
}

export type UserResponse = {
      _id: string
      email: string
      verify_email: boolean
      gender: 'Male' | 'Female' | 'Other'
      sercel_url: string
      bob: Date
      fullName: string
      nickName: string
      avatar: UserAvatar
      avatar_url_default: 'https://res.cloudinary.com/demonodejs/image/upload/v1705389477/static/o5gxkgehijtg9auirdje.jpg'
      avatar_used: UserAvatarUsed[]
      isOpenShop?: boolean
      createdAt: Date
      user_address: UserAddress[]
      roles: UserRoles[]
}

type UserRoles = 'user' | 'shop' | 'admin'

export type UserAvatarUsed = {
      public_id: string
      secure_url: string
      _id: string
      date_update: Date
}

export type UserAvatar = {
      secure_url: string
      public_id: string
      date_update: Date
}
