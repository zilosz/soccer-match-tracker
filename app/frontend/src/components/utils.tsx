import { ToastNotification, type ToastNotificationProps } from "@carbon/react";
import { toast } from "react-toastify";

export const showNotification = (props?: ToastNotificationProps) => {
	toast(<ToastNotification {...props} />, {
		theme: "dark",
		autoClose: 1000,
		closeOnClick: true,
	});
};
