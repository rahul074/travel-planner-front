import {AUTH_LOGOUT_TYPE} from "../reduxConstant";



export const logoutUserAuthAction = (userData) => (dispatch, getState) => {
    return dispatch({
        type: AUTH_LOGOUT_TYPE,
        payload: userData
    });
}


