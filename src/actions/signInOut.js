import _axios from '../lib/axiosConfig';
import dayjs from 'dayjs';
export const LOGIN_INITIALIZE = 'LOGIN_INITIALIZE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const loginInitialize = () => ({ type: LOGIN_INITIALIZE });

export const loginThunk = (userinfo) => async (dispatch) => {
	try {
		const result = await _axios.post(
			'/login',
			{
				pwd: userinfo.password,
				email: userinfo.email,
			},
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);

		const accessToken = result.data.accessToken;
		const expiresAt = dayjs(new Date())
			.add(15, 'minute')
			.format('YYYY-MM-DD HH:mm:ss');

		if (accessToken) {
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('expiresAt', expiresAt);
			dispatch({ type: LOGIN_SUCCESS });
		} else {
			dispatch({ type: LOGIN_FAIL, error: 'Login failed' });
		}
	} catch (e) {
		if (e.response) {
			dispatch({ type: LOGIN_FAIL, error: e.response.data.message });
			return;
		}
		dispatch({ type: LOGIN_FAIL, error: 'unknown error occured' });
	}
};

export const logoutThunk = () => () => {
	_axios
		.get('/logout')
		.then(() => {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('expiresAt');
		})
		.catch(() => {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('expiresAt');
		});
};
