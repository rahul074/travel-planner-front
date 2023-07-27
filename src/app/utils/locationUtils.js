import {_get} from "./lodashUtils";


export const locationDropDownListViewConverter = function (locationData) {
    if (locationData) {
        let returningList = locationData.map(location => {
            return {label: `${_get(location, 'name')}`, id: `${_get(location, 'id')}`}
        });
        return returningList;
    }
    return [];
}

export const usersDropDownListViewConverter = function (usersData) {
    if (usersData) {
        let returningList = usersData.map(user => {
            return {
                id: `${_get(user, 'id')}`,
                label: `${_get(user, 'first_name')}`,
                // last_name: `${_get(user, 'last_name')}`,
                email: `${_get(user, 'email')}`
                // address: `${_get(user, 'address')}`,
                // mobile: `${_get(user, 'mobile')}`
            }
        });
        return returningList;
    }
    return [];
}
