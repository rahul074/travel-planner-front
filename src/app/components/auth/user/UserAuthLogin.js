import React from 'react'
import {Form, Input, Button, Layout} from "antd";
import {Link, Redirect} from "react-router-dom";
import {postOuterAPI, postWithOutTokenAPI} from "../../../utils/apiRequest";
import {LOGIN} from "../../../constants/api";
import {displayMessage} from "../../../utils/common";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import lockr from 'lockr'
import {checkLogin} from "../../../common/commonFunctions";


class UserAuthLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }

    }

    // navigate = useNavigate();
    componentDidMount() {
        let that = this;
        checkLogin(that);
    }

    onFinish = (values) => {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (result) {
            if (result.user.is_superuser) {
                displayMessage(ERROR_MSG_TYPE, "Please use admin login!.")
                that.setState({
                    loading: false
                })
            } else {
                lockr.set('token', result.token); // Saved as string
                lockr.set('id', result.user.id);
                lockr.set('first_name', result.user.first_name);
                lockr.set('last_name', result.user.last_name);
                lockr.set('is_superuser', result.user.is_superuser);
                displayMessage(SUCCESS_MSG_TYPE, "User Logged Successfully.")
                that.setState({
                    loading: false
                })
                that.props.history.push("/");
            }
        }
        let errorFn = function (error) {
            that.setState({
                loading: false
            })
            Object.values(error).map(item =>
                displayMessage(ERROR_MSG_TYPE, item)
            );
        }
        postWithOutTokenAPI(LOGIN, values, successFn, errorFn);

    }


    render() {

        return (<Layout style={{backgroundColor: "white"}}>
            <Form
                name="basic"
                labelCol={{span: 6}}
                wrapperCol={{span: 17}}
                initialValues={{remember: true}}
                onFinish={this.onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Link to={'/auth/forgot'}>Forgot Password</Link>
        </Layout>);
    }
}

export default UserAuthLogin;