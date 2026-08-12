import { onLoading } from '../Redux/authenticationSlice'
import { AddressForm } from '../forms/FormAddress'
import store from '../store'
import { Address } from '../types/address.type'
import { TResponseApi } from '../types/axiosResponse'
import { UserAddress, UserAvatarUsed, UserResponse } from '../types/user.type'
import axiosCustom from './http'

class AccountService {
      static async getMeQuery() {
            store.dispatch(onLoading())
            return axiosCustom.get<TResponseApi<{ user: UserResponse }>>('/v1/api/account/getMe')
      }

      static async getMe() {
            return axiosCustom.post<TResponseApi<{ user: UserResponse }>>('/v1/api/account/getMe')
      }

      static async updateInfo(data: any) {
            return axiosCustom.post<TResponseApi<{ user: UserResponse }>>('/v1/api/account/update-info', data)
      }

      static async updateAvatar(data: any) {
            return axiosCustom.post('v1/api/account/update-avatar', data, { headers: { 'content-Type': 'multipart/form-data' } })
      }

      static async getAllAvatar() {
            return axiosCustom.get<TResponseApi<{ avatar_used: UserAvatarUsed[] }>>('v1/api/account/getAllAvatar')
      }

      static async deleteAvatarUsed(public_id: string) {
            return axiosCustom.post<TResponseApi<{ user: UserResponse }>>('v1/api/account/deleteAvatarUsed', { public_id })
      }

      static async deleteAvatar() {
            return axiosCustom.post<TResponseApi<{ user: UserResponse }>>('v1/api/account/deleteAvatar')
      }

      static async addAddress({ payload }: { payload: Address }) {
            return axiosCustom.post<TResponseApi<{ user: UserResponse }>>('v1/api/account/add-address', { addressPayload: payload })
      }

      static async setAddressDefault(form: Pick<UserAddress, '_id'>) {
            return axiosCustom.post<TResponseApi<{ user: UserResponse }>>('v1/api/account/set-address-default', { addressPayload: form })
      }

      static async deleteAddress({ address_id }: { address_id: string }) {
            return axiosCustom.delete<TResponseApi<{ user: UserResponse }>>(`v1/api/account/delete-address/${address_id}`)
      }

      static async securityPassword({ password }: { password: string }) {
            return axiosCustom.post<TResponseApi<{ message: boolean }>>('/v1/api/account/check-password', { password })
      }

      static async updateEmail({ password, newEmail }: { password: string; newEmail: string }) {
            return axiosCustom.post<TResponseApi<{ user: UserResponse }>>('/v1/api/account/update-email', { password, newEmail })
      }

      static async updatePassword({ password, newPassword }: { password: string; newPassword: string }) {
            return axiosCustom.post<TResponseApi<{ user: UserResponse; message: string }>>('/v1/api/account/update-password', {
                  password,
                  newPassword,
            })
      }
}

export default AccountService
