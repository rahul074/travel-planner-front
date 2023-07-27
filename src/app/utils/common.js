import {message} from 'antd';
import {API_URL, IMAGE_BASE_URL} from "../constants/api";
import {ERROR_MESSAGE_400, ERROR_MESSAGE_401, ERROR_MESSAGE_404, ERROR_MESSAGE_500} from "../constants/message";
import {ERROR_MSG_TYPE, INFO_MSG_TYPE, SUCCESS_MSG_TYPE, WARNING_MSG_TYPE} from "../constants/dataKeys";
import {clearStorage} from "./apiRequest";
export const makeURL = function (URL) {
    return API_URL + '/' + URL;
};
export const makeFileURL = function (URL) {
    return IMAGE_BASE_URL + '/' + URL;
}


export const handleErrorResponse = function (error) {
    let response = error.response;
    if (response) {
        let status = response.status;
        if (status === 400) {
            if(Array.isArray(response.data)){
                response.data.forEach(function(errObject){
                    if(errObject.detail){
                        message.error(errObject.detail);
                    }
                })
            }
           else if (response.data.detail) {
                message.error(response.data.detail);
            } else {
                message.error(ERROR_MESSAGE_400);
            }
        } else if (status === 404) {
            if (response.data.detail) {
                message.error(response.data.detail);
            } else {
                message.error(ERROR_MESSAGE_404);
            }
        } else if (status === 500) {
            message.error(ERROR_MESSAGE_500);
        }else if (status === 401) {
            clearStorage();
            window.location.reload()
            if (response.data.detail) {
                message.error(response.data.detail);
            } else {
                message.error(ERROR_MESSAGE_401);
            }

        }
    } else {
        // message.error(ERROR_INTERNET_CONNECTIVITY);
    }
};

export const interpolate = function (theString, argumentArray) {
    var regex = /%s/;
    var _r = function (p, c) {
        return p.replace(regex, c);
    };
    return argumentArray.reduce(_r, theString);
};


export const displayMessage = function (type, msg) {
    if (type === SUCCESS_MSG_TYPE)
        message.success(msg);
    else if (type === INFO_MSG_TYPE)
        message.info(msg);
    else if (type === WARNING_MSG_TYPE)
        message.warning(msg);
    else if (type === ERROR_MSG_TYPE)
        message.error(msg);
};

export const startLoadingMessage = function (msg) {
    return message.loading(msg, 0);
};
export const stopLoadingMessage = function (msgFn, finishMsgType, finishMsg) {
    msgFn();
    if (finishMsgType)
        displayMessage(finishMsgType, finishMsg);
    return true;
}
export const stripHTML = function (html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}
