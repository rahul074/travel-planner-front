import React from 'react'
import {Button, Card, Form, Input, Select} from "antd";
import {LockOutlined} from "@ant-design/icons";
import {Content} from "antd/es/layout/layout";
import {displayMessage} from "../../../utils/common";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import {postAPI} from "../../../utils/apiRequest";
import {LOCATION, USER_PASSWORD_CHANGE} from "../../../constants/api";


class ChangePassword extends React.Component {

    onFinish = (values) => {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (result) {
            displayMessage(SUCCESS_MSG_TYPE, "Password changed Successfully.")
            that.setState({
                loading: false
            })
            // let path = `/`;
            // this.navigate(path);
            // that.props.history.push("/")
            // this.navigate('/');

        }
        let errorFn = function (error) {
            that.setState({
                loading: false
            })
            Object.values(error).map(item =>
                displayMessage(ERROR_MSG_TYPE, item)
            );
        }
        postAPI(USER_PASSWORD_CHANGE, values, successFn, errorFn);

    }

    render() {
        const tailLayout = {
            wrapperCol: {offset: 4, span: 18},
        };
        const {noPadding} = this.props;
        return (
            <Content style={{
                padding: noPadding ? 0 : 10,
                height: `calc(100vh - 65px)`,
                overflow: 'auto'
            }}>
                <h2>Change Password</h2>
                <Form name="basic"
                      labelCol={{span: 4}}
                      wrapperCol={{span: 18}}
                      initialValues={{remember: true}}
                      onFinish={this.onFinish}
                      autoComplete="off">
                    <Card>
                        <Form.Item
                            label="Current Password"
                            name="old_password"
                            rules={[{required: true, message: 'Please input your current password!!'}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="new_password"
                            rules={[{required: true, message: 'Please input your password!!'}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            name="confirm_password"
                            dependencies={['new_password']}
                            hasFeedback
                            rules={[{required: true, message: 'Please confirm your password!'},
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('new_password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button color="#ff5c5c" type="primary" className={'theme-color'}
                                    htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Card>
                </Form>
            </Content>
        );
    }
}

export default ChangePassword;