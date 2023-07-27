/*** Base URLs **/
export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
export const API_URL = BACKEND_BASE_URL + "/api/v1";
export const IMAGE_BASE_URL = BACKEND_BASE_URL + "/media";
export const USER = "users/%s/";
export const LOGIN = "users/login/";
export const USERS_LIST = "users/users_list/";
export const USER_REGISTER = "users/register/";
export const USER_LOGOUT = "users/logout/";
export const USER_PASSWORD_CHANGE= "users/password_change/";
export const SUPERADMIN_PASSWORD_RESET= "users/superadmin_password_reset/";

export const DEVICE = "device/";
export const DEVICE_DETAIL = "device/%s/";
export const LOCATION_DEVICE = "device/location_devices/";
export const LOCATION = "location/";
export const LOCATION_DETAIL = "location/%s/";
export const LOCATION_LIST = "location/location_list/";
export const LOCATION_USER_LIST = "location/user_locations/";
export const OVERVIEW_DATA = "location/account_overview/";
export const REPORTS = "report/";
export const REPORTS_DETAIL = "report/%s/";
export const REPORTS_ZIP = "report/report_zip/";
export const DE_GRAPH_DATA = "location/de_vs_time/";
export const OAP_GRAPH_DATA = "location/oap_vs_time/";