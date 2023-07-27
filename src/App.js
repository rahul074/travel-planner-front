import React from 'react'
import './App.css';
import {
    BrowserRouter as Router,
    Route, Switch
} from "react-router-dom";
import AuthBase from "./app/components/auth/admin/AuthBase";
import AppBase from "./app/components/core/admin/AppBase";
import 'antd/dist/antd.min.css';
import UserBase from "./app/components/core/user/UserBase";
import UserAuthBase from "./app/components/auth/user/UserAuthBase";
import lockr from 'lockr'

// import { useNavigate } from 'react-router-dom'


class App extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        path={"/auth/admin"}
                        render={(route) => <AuthBase {...route} />}
                    />
                    <Route
                        path={"/auth/user"}
                        render={(route) => <UserAuthBase {...route} />}
                    />
                    <Route
                        path={"/admin"}
                        render={(route) => <AppBase {...route} />}
                    />
                    <Route
                        path={"/"}
                        render={(route) => <UserBase {...route}/>}
                    />
                </Switch>
            </Router>
        );
    }
}

// function App() {
//     // const navigate = useNavigate()
//
// }

export default App;
