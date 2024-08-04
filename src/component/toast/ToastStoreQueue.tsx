import { Bell, X } from "lucide-react";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { resetQueueToast } from "../../Redux/toast";

const ToastStoreQueue = () => {
      const toast_queue = useSelector((state: RootState) => state.toast.toast_queue);
      const dispatch = useDispatch();
      const onResetQueueToast = () => {
            dispatch(resetQueueToast());
      };

      return (
            // <div className="fixed bottom-[2rem] border-[.1rem] border-gray-200 rounded-md p-[1rem_2rem] min-h-[10rem] w-full text-[1.6rem] flex flex-col justify-between">
            // 	<p>
            // 		Số toast đang lưu trữ <span>{toast_queue.length}</span>
            // 	</p>
            // 	<button
            // 		onClick={onResetQueueToast}
            // 		className="text-left bg-slate-800 max-w-[20rem] h-[4rem] text-[#ffffff] p-[1rem] rounded-lg flex items-center"
            // 	>
            // 		Reset hàng đợi
            // 	</button>
            // </div>
            <div className="fixed bottom-[2rem] right-[2rem]  rounded-full p-[1rem_2rem]  w-[60px] h-[60px] flex items-center justify-center bg-blue-400 text-[#fff] text-[1.6rem] ">
                  <div className="absolute left-[-2rem] w-[4rem] bottom-[1rem] h-[2rem] rounded-lg flex items-center justify-center bg-[#fff] border-[1px] border-blue-600">
                        <span className=" font-semibold text-blue-500">{toast_queue.length}</span>
                  </div>
                  <Bell size={40} />
                  <button
                        onClick={onResetQueueToast}
                        className="absolute right-[2rem] top-[-1rem] w-[2rem] h-[2rem]  rounded-full  flex items-center justify-center bg-blue-500 text-[#fff]"
                  >
                        <X size={14} />
                  </button>
            </div>
      );
};

export default ToastStoreQueue;