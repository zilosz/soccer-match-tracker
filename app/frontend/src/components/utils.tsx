import { ToastNotification, type ToastNotificationProps } from "@carbon/react";
import { toast } from "react-toastify";

export function showNotification(props?: ToastNotificationProps) {
  toast.dismiss();
  toast.clearWaitingQueue();

  toast(<ToastNotification {...props} />, {
    theme: "dark",
    autoClose: 1000,
    closeOnClick: true,
  });
}
