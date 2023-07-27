import React from 'react'
import {postAPI} from "../../../utils/apiRequest";
import {USER_LOGOUT} from "../../../constants/api";
import {Avatar, Dropdown, Menu} from "antd";
import {LogoutOutlined, HomeOutlined, FileImageOutlined,UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {Header} from "antd/es/layout/layout";
import {logoutUser} from "../../../common/commonFunctions";
import lockr from "lockr";


class UserHeader extends React.Component {
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
            <Menu.Item icon={<UserOutlined/>} key={"/profile"}>
                <Link to={"/profile"}>Profile</Link>
            </Menu.Item>
            {/*<Menu.Item icon={<UnlockOutlined/>} key={'/change-password'}><Link to={`/change-password`}>Change*/}
            {/*    Password</Link></Menu.Item>*/}
            <Menu.Item icon={<LogoutOutlined/>} key={'logout'}>Log Out</Menu.Item>
        </Menu>
        return (
            <Header className="site-layout-background" style={{
                height: '60px', // Adjust the height as per your requirement
                padding: 0,
            }}>
                <Dropdown overlay={userMenu}>
                    <Avatar icon={<UserOutlined/>} style={{
                        float: "right",
                        alignContent: "center",
                        marginBottom: 8,
                        marginLeft: 3,
                        marginRight: 20,
                        marginTop: 10,
                        display: "block",
                        background: "#4f6c6a"
                    }}/>
                </Dropdown>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{padding: 0}}>
                    {/*<Menu.Item key={'/user/home'} icon={<HomeOutlined/>}>*/}
                    {/*    <Link to={'/'}>Home</Link>*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key={'/report'} icon={<FileImageOutlined/>}>*/}
                    {/*    <Link to={'/report'}>Reports</Link>*/}
                    {/*</Menu.Item>*/}
                </Menu>
            </Header>
        );
    }
}

export default UserHeader;

