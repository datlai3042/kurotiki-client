namespace Toast {
      namespace ToastCommon {
            type Common = {
                  _id: string;
                  toast_title: string;
            };
      }

      namespace ToastSuccess {
            type ToastSuccessCore = Toast.ToastCommon.Common & {
                  type: "SUCCESS";
                  core: {
                        message: string;
                  };
            };
      }

    

      namespace ToastWarning {
            type ToastWarningCore = Toast.ToastCommon.Common & {
                  type: "WARNING";
                  core: {
                        message: string;
                  };
            };
      }

      namespace ToastError {
            type ToastErrorCore = Toast.ToastCommon.Common & {
                  type: "ERROR";
                  core: {
                        message: string;
                  };
            };
      }

      type ToastCore = ToastSuccess.ToastSuccessCore | ToastWarning.ToastWarningCore | ToastError.ToastErrorCore

}