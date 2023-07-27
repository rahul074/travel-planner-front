import React from "react";
import {Layout, Menu} from "antd";
import {
    UploadOutlined,
    UsergroupAddOutlined,
    WindowsOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";

const {Sider} = Layout;
const {SubMenu} = Menu;

class AppSider extends React.Component {
    render() {
        return (<Sider  style={{background:'black'}} trigger={null} collapsible collapsed={this.props.collapsed}>
            <div className="logo"/>
            <img src={'/logo512.png'} className={"authLogo"}></img>

            <Menu className='sidebar' theme="dark" mode="inline" defaultSelectedKeys={['1']}
                  style={{background:'black'}}>
                <SubMenu key="user" title="User Management" icon={<UsergroupAddOutlined/>}>
                    <Menu.Item key={'/admin/users'}>
                        <Link to={'/admin/users'}>Users</Link>
                    </Menu.Item>
                    <Menu.Item key={'admin/edit-user'}>
                        <Link to={'/admin/edit-user'}>Edit User</Link>
                    </Menu.Item>
                    <Menu.Item key={'/admin/password-reset'}>
                        <Link to={'/admin/password-reset'}>Reset Password</Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key={'/admin/location'} icon={<WindowsOutlined/>}>
                    <Link to={'/admin/location'}>Locations</Link>
                </Menu.Item>
                <Menu.Item key={'/admin/device'} icon={<UploadOutlined/>}>
                    <Link to={'/admin/device'}>Devices</Link>
                </Menu.Item>

            </Menu>
        </Sider>);
    }
}

export default AppSider;