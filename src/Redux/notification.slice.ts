import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationAttribute, NotificationMessage } from "../types/notification.type";
import { NotificationType } from "../apis/notification.service";


type NotificationState = {
      [key in NotificationType]: {
            cache: NotificationMessage[],
            page: number
      }
}

const initialState: NotificationState = {
      USER: {
            cache: [],
            page: 1
      },
      PRODUCT: {
            cache: [],
            page: 1
      },

      SHOP: {
            cache: [],
            page: 1
      },

      SYSTEM: {
            cache: [],
            page: 1
      },

      ADMIN: {
            cache: [],
            page: 1
      },

}

const notificationSlice = createSlice({
      name: 'notification',
      initialState,
      reducers: {
            onSocketAddNotification: (state, actions: PayloadAction<{ type: NotificationType, data: NotificationMessage[] }>) => {
                  const { type, data } = actions.payload
                  state[type as NotificationType].cache = data.concat(state[type as NotificationType].cache)

            },
            onAddPageNotification: (state, actions: PayloadAction<{ type: NotificationType, data: NotificationMessage[], page: number }>) => {
                  const { type, data, page } = actions.payload
                  state[type as NotificationType].cache = state[type as NotificationType].cache.concat(data)
                  state[type as NotificationType].page = page
            },
            onClearCacheNotifiaction: (state, actions: PayloadAction<{ type: NotificationType }>) => {
                  const { type, } = actions.payload

                  state[type].cache = []
                  state[type].page = 1
            }
      }
})

export const { onSocketAddNotification, onAddPageNotification, onClearCacheNotifiaction } = notificationSlice.actions
export default notificationSlice.reducer