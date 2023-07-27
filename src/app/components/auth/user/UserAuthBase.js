import React from "react";
import {Layout} from "antd";
import {Switch, Route
} from "react-router-dom";
import UserAuthLogin from "./UserAuthLogin";
import UserAuthForgot from "./UserAuthForgot";




class UserAuthBase extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Layout className={"authMainLayout"}>
                <div className={'authContainer'}>
                    <div className={"authLogoContainer"}>
                        <img src={'/logo512.png'} className={"authLogo"}></img>
                    </div>
                        <Switch>
                            <Route
                                path={"/auth/user/login"}
                                render={(route) => <UserAuthLogin {...route} />}
                            />
                            <Route
                            path={"/auth/user/forgot"}
                            render={(route) => <UserAuthForgot {...route} />}
                        />
                        </Switch>
                </div>
            </Layout>)
            ;

    }
}

export default UserAuthBase;