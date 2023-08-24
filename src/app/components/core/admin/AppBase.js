import React from "react";
import {Layout, Menu} from 'antd';

import AppSider from "./AppSider";
import AppHeader from "./AppHeader";
import FormDevice from "./device/AddOrEditDevice";
import {Route, Switch} from "react-router-dom";
import FormUser from "./userManagment/FormUser";
import EditUser from "./userManagment/EditUser";
import PasswordReset from "./userManagment/PasswordReset";
import ViewUsers from "./userManagment/ViewUsers";
import ViewDevice from "./device/Index";
import ChangePassword from "./ChangePassword";
import Device from "./device/Index";
import Users from "./userManagment/Index";
import lockr from "lockr";
import AdminProfile from "./AdminProfile";

const {Content} = Layout;


class AppBase extends React.Component {

    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    componentDidMount() {
        let token = lockr.get('token')
        let is_superuser = lockr.get('is_superuser')
        if(token && ! is_superuser){
            this.props.history.push('/')
        }
        else if(!token){
            this.props.history.push('/auth/admin/login')
        }

    }

    render() {
        return (<Layout style={{minHeight: '100vh'}}>
            <AppSider className='sidebar'  {...this.state}/>
            <Layout className="site-layout">
                <AppHeader {...this.state} toggle={this.toggle}/>
                <Switch>
                    <Route
                        path={"/admin/users"}
                        render={(route) => <Users {...route} />}
                    />
                    <Route
                        path={"/admin/add-user"}
                        render={(route) => <FormUser {...route} />}
                    />
                    <Route
                        path={"/admin/edit-user"}
                        render={(route) => <EditUser {...route} />}
                    />
                    <Route
                        path={"/admin/password-reset"}
                        render={(route) => <PasswordReset {...route} />}
                    />
                    <Route
                        path={"/admin/view-users"}
                        render={(route) => <ViewUsers {...route} />}
                    />
                    <Route
                        path={"/admin/device"}
                        render={(route) => <Device {...route} />}
                    />
                    <Route
                        path={"/admin/add-device"}
                        render={(route) => <FormDevice {...route} />}
                    />
                    <Route
                        path={"/admin/device"}
                        render={(route) => <Device {...route} />}
                    />
                    <Route
                        path={"/admin/add-device"}
                        render={(route) => <FormDevice {...route} />}
                    />
                    <Route
                        path={"/admin/view-device"}
                        render={(route) => <ViewDevice {...route} />}
                    />
                    <Route
                        path={"/admin/change-password"}
                        render={(route) => <ChangePassword {...route} />}
                    />
                    <Route
                        path={"/admin/profile"}
                        render={(route) => <AdminProfile {...route} />}
                    />
                </Switch>
            </Layout>
        </Layout>);
    }
}

export default AppBase;