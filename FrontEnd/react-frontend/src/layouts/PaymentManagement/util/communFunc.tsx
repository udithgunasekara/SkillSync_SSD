

import { toast } from "react-toastify";

export const notifyMessage = (msg: string, type: number) => {
    if (type === 0) {
        toast.error(msg, {
            icon: undefined, // Set icon to undefined
            hideProgressBar: false,
        });
    } else if (type === 1) {
        toast.success(msg, {
            icon: undefined, // Set icon to undefined
            hideProgressBar: false,
        });
    } else if (type === 2) {
        toast.warning(msg, {
            icon: undefined, // Set icon to undefined
            hideProgressBar: false,
        });
    } else if (type === 3) {
        toast.info(msg, {
            icon: undefined, // Set icon to undefined
            hideProgressBar: false,
        });
    } else {
        toast.error(msg, {
            icon: undefined, // Set icon to undefined
            hideProgressBar: false,
        });
    }
};
