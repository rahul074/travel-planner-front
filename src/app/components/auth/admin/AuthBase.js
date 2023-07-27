import React from "react";
import {Layout} from "antd";
import AuthLogin from "./AuthLogin";
import AuthForgot from "./AuthForgot";
import {Route, Switch} from "react-router-dom";
import {BrowserRouter as Router} from "react-router-dom";
// import { useNavigate } from 'react-router-dom'


class AuthBase extends React.Component {
    // navigate({ pathname: {route} })
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
                    <Router>
                        <Switch>
                            <Route
                                path={"/auth/admin/login"}
                                render={(route) => <AuthLogin {...route} />}
                            />
                            <Route
                                path={"/forgot"}
                                render={(route) => <AuthForgot {...route} />}
                            />
                        </Switch>
                    </Router>
                </div>
            </Layout>)
            ;

    }
}

export default AuthBase;