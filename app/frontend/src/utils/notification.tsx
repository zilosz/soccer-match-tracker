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

export function notifySuccess(caption: string) {
  showNotification({
    title: "Success",
    caption: caption,
    kind: "success",
  });
}

export function notifyError(title: string, caption: string) {
  showNotification({
    title: title,
    caption: caption,
    kind: "error",
  });
}

export function notifyAPIError(err: any, message: string) {
  if (err.response) {
    notifyError(`Error ${err.response.status}`, message);
  } else {
    notifyError("Unexpected Error", message);
    console.error(err.message);
  }
}
