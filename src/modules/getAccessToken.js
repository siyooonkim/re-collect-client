import { logoutThunk } from '../modules/sign';
import axios from 'axios';

export const getAccessToken = () => (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');

  axios
    .get(`https://api.recollect.today/auth/token`, {
      headers: { authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    })
    .then((res) => {
      const newAccessToken = res.data.accessToken;
      localStorage.setItem(`accessToken`, newAccessToken);
    })
    .catch(() => {
      dispatch(logoutThunk());
    });
};
