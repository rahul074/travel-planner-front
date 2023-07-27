import axios from "axios";
import {handleErrorResponse, makeURL} from "./common";
import lockr from 'lockr'
import {AUTH_TOKEN} from "../constants/dataKeys";
// import {_get} from "./lodashUtils";
// import {logErrorToSlackChannel} from "../crashHandling/utils/crashHandlingUtils";


export const getAuthToken = function () {
    const token = lockr.get(AUTH_TOKEN);
    return token;
};
export const clearStorage = function () {
    localStorage.clear()
}
export const putAPI = function (URL, data, successFn, errorFn, headerConfig = {}) {
    let token = getAuthToken();
    let authHeaders = {};
    if (token) {
        authHeaders.Authorization = `Token ${token}`
    }
    axios({
        method: 'put',
        url: makeURL(URL),
        data: data,
        headers: {
            ...authHeaders,
            ...headerConfig
        }
    }).then(function (response) {
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        handleErrorResponse(error);
        errorFn(error.response.data);
    });
};

export const postAPI = function (URL, data, successFn, errorFn, headerConfig = {}) {
    let token = getAuthToken();
    let authHeaders = {};
    if (token) {
        authHeaders.Authorization = `Token ${token}`
    }
    axios({
        method: 'post',
        url: makeURL(URL),
        data: data,
        headers: {
            ...authHeaders,
            ...headerConfig
        }
    }).then(function (response) {
        console.log(response.data)
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        // if (_get(error, 'request.status') === 500) {
        //     let errorInfo;
            // logErrorToSlackChannel(JSON.stringify(data), errorInfo = {componentStack: _get(error, 'request.status')});
        // }
        handleErrorResponse(error);
        errorFn(error.response.data);
    });
};
export const postOuterAPI = function (URL, data, successFn, errorFn, headerConfig = {}) {
    axios({
        method: 'post',
        url: URL,
        data: data,
        headers: {
            ...headerConfig
        }
    }).then(function (response) {
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        handleErrorResponse(error);
        errorFn(error.response.data);
    });
};

export const getAPI = function (URL, successFn, errorFn, params = {}) {
    let token = getAuthToken();
    let authHeaders = {};
    if (token) {
        authHeaders.Authorization = `Token ${token}`
    }
    axios({
        method: 'get',
        url: makeURL(URL),
        headers: {
            ...authHeaders
        },
        params: params
    }).then(function (response) {
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        handleErrorResponse(error);
        errorFn();
    });
};

export const deleteAPI = function (URL, successFn, errorFn) {
    axios({
        method: 'delete',
        url: makeURL(URL),
        headers: {
            // Authorization: 'Bearer ' + getAuthToken()
        }
    }).then(function (response) {
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        handleErrorResponse(error);
        errorFn();
    });
};

export const convertRouteSearchToObj = function (searchString) {
    if (searchString) {
        let returnObj = {};
        let searchStringAfterTrim = searchString.substr(1);
        let searchStringGroups = searchStringAfterTrim.split('&');
        searchStringGroups.forEach(function (pairString) {
            let valuePair = pairString.split('=');
            returnObj[valuePair[0]] = valuePair[1];
        })
        return returnObj;
    }
    return {};
}

export const postWithOutTokenAPI = function (URL, data, successFn, errorFn, headerConfig = {}) {
    axios({
        method: 'post',
        url: makeURL(URL),
        data: data,
        headers: {
            ...headerConfig
        }
    }).then(function (response) {
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        handleErrorResponse(error);
        errorFn(error.response.data);
    });
};
