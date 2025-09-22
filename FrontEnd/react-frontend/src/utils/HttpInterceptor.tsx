import axios from 'axios';
import Cookies from 'js-cookie';

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('_auth');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axios;