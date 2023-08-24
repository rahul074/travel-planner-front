import React from "react";

import UserHeader from "./UserHeader";

import {Route, Switch} from "react-router-dom";
import {Layout, Menu, Breadcrumb} from 'antd';
import UserHome from "./UserHome";
import lockr from 'lockr';
import UserProfile from "./UserProfile";
import MapView from "./MapView";

const {Header, Content, Footer} = Layout;


class UserBase extends React.Component {

    state = {
        collapsed: false,
    };
    componentDidMount() {
        let token = lockr.get('token')
        let is_superuser = lockr.get('is_superuser')

        if(token && is_superuser){
            this.props.history.push('/admin/users')
        }
        else if(!token){
            this.props.history.push('/auth/user/login')
        }
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        return (<Layout>
                <UserHeader {...this.state} toggle={this.toggle}/>
                <Content
                    className="site-layout"
                    style={{
                        padding: '0 50px',
                        marginTop: 14,
                    }}
                >
                    {/*<Breadcrumb*/}
                    {/*    style={{*/}
                    {/*        margin: '16px 0',*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>List</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>App</Breadcrumb.Item>*/}
                    {/*</Breadcrumb>*/}
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            minHeight: 500,
                            borderRadius: "30px"
                        }}
                    >
                        <Switch>
                            <Route
                                path={"/profile"}
                                render={(route) => <UserProfile {...route} />}
                            />
                            <Route
                                path={"/"}
                                render={(route) => <UserHome {...route} />}
                            />
                            <Route
                                path={"/map-view"}
                                render={(route) => <MapView {...route} />}
                            />
                        </Switch>
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                </Footer>

            </Layout>
        );
    }
}

export default UserBase;