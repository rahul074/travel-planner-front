import React from 'react';
import {Form, Input, Button, Layout, Card, Spin} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {displayMessage} from "../../../../utils/common";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import {postAPI} from "../../../../utils/apiRequest";
import {USER_REGISTER} from "../../../../constants/api";

const {Content} = Layout;

class FormUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    onFinish = (values) => {
        let that = this;
        that.setState({loading: true})
        let reqData = {
            ...values
        }
        that.setState({
            loading: true
        })
        let successFn = function (result) {
            displayMessage(SUCCESS_MSG_TYPE, "User added Successfully.")
            that.props.onSelectTab('view-users')
            that.setState({
                loading: false
            })

        }
        let errorFn = function (error) {
            that.setState({
                loading: false
            })
            Object.values(error).map(item =>
                displayMessage(ERROR_MSG_TYPE, item)
            );
        }

        postAPI(USER_REGISTER, reqData, successFn, errorFn);

    }


    render() {
        const tailLayout = {
            wrapperCol: {offset: 4, span: 18},
        };
        const {loading} = this.state
        return (<Spin spinning={loading}>
                <Form name="basic"
                      labelCol={{span: 4}}
                      wrapperCol={{span: 18}}
                      initialValues={{remember: true}}
                      onFinish={this.onFinish}
                    // onFinishFailed={onFinishFailed}
                      autoComplete="off">
                        <Form.Item
                            label="First name"
                            name="first_name"
                            rules={[{required: true, message: 'Please input your first name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Last name"
                            name="last_name"
                            rules={[{required: true, message: 'Please input your last name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{required: true, message: 'Please input your first name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Mobile"
                            name="mobile"
                            rules={[{required: true, message: 'Please input your mobile number!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{required: false, message: 'Please input your address!'}]}
                        >
                            <TextArea/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{required: true, message: 'Please input your password!!'}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            name="confirm_password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[{required: true, message: 'Please confirm your password!'},
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
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
                </Form>
            </Spin>
        );
    }
}

export default FormUser;