import {
    ATTENDANCE_DAILY, ATTENDANCE_DETAIL_REPORT,
    ATTENDANCE_SUM,
    DEPARTMENT_WISE_LEAVE,
    EMPLOYEE_LEAVE_COUNT,
    EMPLOYEE_WISE_LEAVE, EMPLOYEES_DETAILS, GRIEVANCE_REP, GRIEVANCE_SUMMARY, LEAVE_ARREAR_MONTHLY
} from "./dataKeys";
import {
    FileProtectOutlined,
    FileSearchOutlined,
    IeOutlined,
    PercentageOutlined,
    SafetyOutlined,
    UserOutlined
} from "@ant-design/icons";
import {GrUserManager} from "react-icons/all";

export const HR_SIDERS = {
    key: "hr-setting",
    icon: "SettingOutlined",
    title: "HR Settings",
    menu: [
        {key: "location-settings", linkURL: "/hr/setting/location", linkTitle: "Location Setting", subMenu: false},
        {key: "dropdown-settings", linkURL: "/hr/setting/drop-down", linkTitle: "Dropdown Settings", subMenu: false},
        {key: "holiday-settings", linkURL: "/hr/setting/holiday", linkTitle: "Holiday Settings", subMenu: false},
        {
            key: "shift-settings", linkURL: "/hr/setting/shift", linkTitle: "Shift Settings", subMenu: true,
            subMenuObj: [{
                key: "leave-settings", title: "Leave Settings",
                subMenuArr: [
                    {key: "add-leave", linkURL: "/hr/setting/leave/add", linkTitle: "Add Leave"},
                    {key: "leave-quota", linkURL: "/hr/setting/leave/leave-quota", linkTitle: "Leave Quota"},
                    // {key: "od-settings", linkURL: "/hr/setting/leave/od-setting", linkTitle: "OD Settings"},
                    {key: "club-rules", linkURL: "/hr/setting/leave/club-rules", linkTitle: "Club Rules"},
                    // {key: "leave-count", linkURL: "/hr/setting/leave/count", linkTitle: "Leave Count"},
                ]
            },
                //     {
                //     key: "attendance", title: "Attendance",
                //     subMenuArr: [
                //         {key: "attendance-settings", linkURL: "/hr/setting/attendance", linkTitle: "Attendance Settings"},
                //         {
                //             key: "attendance-refresh",
                //             linkURL: "/hr/setting/attendance/machine",
                //             linkTitle: "Attendance Refresh"
                //         },
                //         {key: "attendance-edit", linkURL: "/hr/setting/attendance/edit", linkTitle: "Edit Attendance"},
                //     ]
                //
                // }
            ]
        },
        // {key: "assign-no-dues-head", linkURL: "/hr/setting/assign-no-dues-head", linkTitle: "Assign No Dues Head", subMenu: false},
    ]

}

export const HR_MODULUS = "HR"
export const EMPLOYEE_MODULUS = "Employee"
export const NO_DUE_HEAD_MODULUS = "NoDueHead"
export const APPROVAL_MODULUS = "Approval";


export const DANGER_COLOR = "#f50";
export const SUCCESS_COLOR = "#87d068";
export const WARNING_COLOR = "#d0cb68";

export const REPORT_CATEGORIES = [
    {
        name: 'Attendance',
        value: '/hr/reports/attendance',
        active: true
    }, {
        name: 'Leave',
        value: '/hr/reports/leave',
        active: true
    }, {
        name: 'Grievance',
        value: '/hr/reports/grievance',
        active: true
    }, {
        name: 'Time Sheet',
        value: '/hr/reports/time-sheet',
        active: true
    },
    {
        name: 'Employees',
        value: '/hr/reports/employees',
        active: true
    },
]

export const ATTENDANCE_REPORT = [
    // { name: 'Attendance Summary', value: ATTENDANCE_SUM },
    {name: 'Attendance Daily', value: ATTENDANCE_DAILY},
    {name: 'Attendance Detail', value: ATTENDANCE_DETAIL_REPORT},
];


export const LEAVE_REPORT = [
    // { name: 'Employee Leave', value: EMPLOYEE_WISE_LEAVE },
    {name: 'Department Wise Leave', value: DEPARTMENT_WISE_LEAVE},
    {name: 'Leave Count', value: EMPLOYEE_LEAVE_COUNT},
    {name: 'Leave Arrear Monthly', value: LEAVE_ARREAR_MONTHLY},
];
export const GRIEVANCE_REPORT = [
    // { name: 'Grievance Summary', value: GRIEVANCE_SUMMARY },
    {name: 'Grievance', value: GRIEVANCE_REP},
];
export const GRIEVANCE_STATUS = [
    {label: "Approved", key: "is_approved", value: true},
    {label: "Rejected", key: "is_rejected", value: true},
]

export const EMPLOYEE_REPORT = [
    // { name: 'Attendance Summary', value: ATTENDANCE_SUM },
    {name: 'Employee Details', value: EMPLOYEES_DETAILS},
];

export const COMP_OFF_LEAVE_ID = 1;

export const ACADEMICS_STATUS = [
    {label: "Full Time", value: 'Full Time'},
    {label: "Part Time", value: 'Part Time'},
]

export const OD_STATUS = [
    {label: "Approved", key: "is_approved", value: true},
    {label: "Rejected", key: "is_rejected", value: true},
    {label: "Pending", key: "is_pending", value: true},
    {label: "Cancelled", key: "is_cancelled", value: true}
]
export const OD_APPROVAL_STATUS = [
    {label: "Approved", key: "is_approved", value: true},
    {label: "Rejected", key: "is_rejected", value: true},
    {label: "To Next Level", key: "to_nxt_level", value: true},
    // {label: "Cancelled", key: "is_cancelled", value: true}
]
export const TRANSACTION_TYPE = [
    {label: "CREDIT", value: "CREDIT"},
    {label: "DEBIT", value: "DEBIT"},
]

export const EMPLOYEE_GRIEVANCE = [
    {label: "Pending", value: "PENDING"},
    {label: "Approved", value: "APPROVED"},
    {label: "Rejected", value: "REJECTED"},
]

export const EMPLOYEE_REPORTING_APPROVAL = [
    {label: "Approve By All Reporting levels", value: true},
    {label: "Approve By Any One Reporting levels", value: false},
]
//Permissions/Roles
export const EMPLOYEE_ROLE = "Employee";
export const APPROVAL_ROLE = "Approval";
export const HR_ROLE = "HR";
export const NO_DUE_HEAD_ROLE = "NoDueHead";
export const WEB_ADMIN_ROLE = "WebAdmin";
export const ACCOUNTS_ROLE = "Accounts";

export const ROLE_STATE_DICT = {
    [EMPLOYEE_ROLE]: {
        url: "/employee/",
        name: "Employee",
        Icon: UserOutlined,
        iconBg:"#08979c"
    }, [APPROVAL_ROLE]: {
        url: "/approval/",
        name: "Approval",
        Icon: FileSearchOutlined,
        iconBg:"#d48806",
        hidden: !JSON.parse(process.env.REACT_APP_HR_MODULE_ON_PROD)
    }, [HR_ROLE]: {
        url: "/hr/",
        name: "HR",
        Icon: SafetyOutlined,
        iconBg:"#722ed1",
        hidden: !JSON.parse(process.env.REACT_APP_HR_MODULE_ON_PROD)
    }, [NO_DUE_HEAD_ROLE]: {
        url: "/no-dues/",
        name: "No Dues",
        Icon: FileProtectOutlined,
        iconBg:"#d4380d",
        hidden: !JSON.parse(process.env.REACT_APP_HR_MODULE_ON_PROD)
    }, [WEB_ADMIN_ROLE]: {
        url: "/web/",
        name: "Web",
        Icon: IeOutlined,
        iconBg: "#c41d7f",
        hidden: !JSON.parse(process.env.REACT_APP_WEB_MODULE_ON_PROD)
    }, [ACCOUNTS_ROLE]: {
        url: "/accounts/",
        name: "Accounts",
        Icon: PercentageOutlined,
        iconBg: "#52c41a",
        hidden: !JSON.parse(process.env.REACT_APP_ACCOUNT_MODULE_ON_PROD)
    }
}

export const LEAVE_STATUS_CODE = [
    {label: "P", value: "P"},
    {label: "A", value: "A"},
    {label: "P/I", value: "P/I"},
    {label: "P/II", value: "P/II"},
    {label: "P/A", value: "P/A"},
    {label: "H", value: "H"},
]

export const COLOUR_STATUS_CODE = [
    {label: "Present", value: "P", colour: 'black'},
    {label: "Absent", value: "A", colour: 'red'},
    {label: "Holiday", value: "H", colour: "orange"},
    {label: "On Duty", value: "OD", colour: "blue"},
    {label: "Comp Off", value: "CO", colour: "yellow"},
    // {label: "Incomplete Attendance", value: "P/A",colour: 'red'},
]

export const HR_COLOUR_STATUS_CODE = [
    {label: "Present", value: "P", colour: 'black'},
    {label: "Absent", value: "A", colour: 'red'},
    {label: "First Half", value: "P/I", colour: "blue"},
    {label: "Second Half", value: "P/II", colour: "blue"},
    {label: "Holiday", value: "H", colour: "orange"},
    {label: "Incomplete Attendance", value: "P/A", colour: 'red'},
]

// PRESENT_COLOUR = "black"
// HR_MODIFIED_COLOUR = "green"
// HOLIDAY_COLOUR = "orange"
// ABSENT_COLOUR = "red"
// HALF_DAY_COLOUR = "blue"

