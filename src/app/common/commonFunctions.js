import lockr from 'lockr'
import {postAPI} from "../utils/apiRequest";
import {USER_LOGOUT} from "../constants/api";


export const checkLogin = function (that){
    const is_superuser = lockr.get('is_superuser')
    const token = lockr.get('token')
    if( token && is_superuser){
        that.props.history.push("/admin/users");
    }
    else if( token && !is_superuser){
        that.props.history.push("/");
    }
}

export const logoutUser = function (successFn, errorFn){
    postAPI(USER_LOGOUT, {}, successFn, errorFn)
}