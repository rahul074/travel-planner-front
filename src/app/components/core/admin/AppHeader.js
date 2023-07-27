import React from "react";
import {MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, UnlockOutlined, LogoutOutlined} from "@ant-design/icons";

import {Layout, Avatar, Menu, Dropdown} from "antd";
import {Link} from "react-router-dom";
import {USER_LOGOUT} from "../../../constants/api";
import {postAPI} from "../../../utils/apiRequest";
import {logoutUserAuthAction} from "../../../redux/actions/authReduxActions"
import lockr from "lockr";
import {logoutUser} from "../../../common/commonFunctions";

const {Header} = Layout;

class AppHeader extends React.Component {
    constructor(props) {
        super(props);

    }

    logOutUser = () => {
        let that = this
        let successFn = function (result) {
            that.props.logoutUserAuthAction()
        }
        let errorFn = function (error) {

        }
        postAPI(USER_LOGOUT, {}, successFn, errorFn)
    }
    onHandleLink = (event) => {
        let {history} = this.props;
        let successFn = function (result) {
            lockr.flush()
            window.location.reload();
        }

        if (event.key === 'logout') {
            logoutUser(successFn, successFn )
        } else {
            history.push(event.key)
        }

    }
    render() {
        let userMenu = <Menu onClick={this.onHandleLink}>
            <Menu.Item icon={<UserOutlined/>} key={"/admin/profile"}>
                <Link to={"/admin/profile"}>Profile</Link>
            </Menu.Item>
            {/*<Menu.Item icon={<UnlockOutlined/>} key={'/admin/change-password'}><Link to={`/admin/change-password`}>Change*/}
            {/*    Password</Link></Menu.Item>*/}
            <Menu.Item icon={<LogoutOutlined/>} key={'logout'}>Log Out</Menu.Item>
        </Menu>
        return (
            <Header className="site-layout-background" style={{padding: 0}}>
                {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    style:{marginLeft: 13},
                    onClick: this.props.toggle,
                })}
                <Dropdown overlay={userMenu}>
                    <Avatar icon={<UserOutlined/>} style={{
                        float: "right",
                        alignContent: "center",
                        marginBottom: 8,
                        marginLeft: 3,
                        marginRight: 20,
                        marginTop: 10,
                        display: "block",
                        background: "#06377b"}}/>
                </Dropdown>
            </Header>
        );
    }
}
export default AppHeader;