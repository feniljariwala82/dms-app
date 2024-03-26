import { toast } from "react-toastify";

export const showToast = (
  message: string,
  type: "info" | "success" | "warning" | "error"
) => {
  switch (type) {
    case "info":
      toast.info(message);
      break;
    case "success":
      toast.success(message);
      break;
    case "warning":
      toast.warn(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
  }
};
