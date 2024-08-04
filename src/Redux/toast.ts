import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { ToastCore, ToastErrorCore, ToastSuccessCore, ToastWarningCore } from "../component/toast/ToastProvider";

type InitialState = {
      toast_stack: Toast.ToastCore[];
      toast_queue: Toast.ToastCore[];
      toast_timer: number;
      toast_max_show: number;
};

const initialState: InitialState = {
      toast_stack: [],
      toast_queue: [],
      toast_timer: 6,
      toast_max_show: 4,
};

const toastSlice = createSlice({
      name: "toast",
      initialState,
      reducers: {
            addOneToast: (state, data: PayloadAction<{ toast_item:ToastCore }>) => {
                  const { toast_item } = data.payload;
                  state.toast_stack.length >= state.toast_max_show ? state.toast_queue.push(toast_item) : state.toast_stack.push(toast_item);
            },

            addOneToastSuccess: (state, data: PayloadAction<{ toast_item: ToastSuccessCore }>) => {
                  const { toast_item } = data.payload;
                  state.toast_stack.length >= state.toast_max_show ? state.toast_queue.push(toast_item) : state.toast_stack.push(toast_item);
            },

            addOneToastWarning: (state, data: PayloadAction<{ toast_item: ToastWarningCore }>) => {
                  const { toast_item } = data.payload;
                  state.toast_stack.length >= state.toast_max_show ? state.toast_queue.push(toast_item) : state.toast_stack.push(toast_item);
            },

            addOneToastError: (state, data: PayloadAction<{ toast_item: ToastErrorCore }>) => {
                  const { toast_item } = data.payload;
                  state.toast_stack.length >= state.toast_max_show ? state.toast_queue.push(toast_item) : state.toast_stack.push(toast_item);
            },

           

            resetQueueToast: (state) => {
                  state.toast_queue = [];
            },

            removeOneToast: (state, data: PayloadAction<{ toast_item_id: string }>) => {
                  const { toast_item_id } = data.payload;
                  state.toast_stack = state.toast_stack.filter((toast) => {
                        if (toast._id === toast_item_id) return null;
                        return toast;
                  });
                  if (state.toast_queue.length > 0) {
                        const toast_level_up = state.toast_queue.shift() as Toast.ToastCore;
                        state.toast_stack.push(current(toast_level_up));
                  }
            },

            onUpdateToastGlobal: (state) => {
                  state.toast_stack.shift();
                  if (state.toast_stack.length < state.toast_max_show && state.toast_queue.length >= 1) {
                        const toast_level_up = state.toast_queue.shift() as Toast.ToastCore;
                        state.toast_stack.push(current(toast_level_up));
                  }
            },
      },
});

export const {
      addOneToast,
      addOneToastSuccess,
      addOneToastWarning,
      addOneToastError,
      resetQueueToast,
      removeOneToast,
      onUpdateToastGlobal,
} = toastSlice.actions;
export default toastSlice.reducer;