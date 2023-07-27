import React from 'react';
import {Avatar, Button, Card, Col, Divider, Form, Input, Popconfirm, Row, Space, Table} from "antd";
import {DEVICE_DETAIL, USER, USER_PASSWORD_CHANGE} from "../../../constants/api";
import {getAPI, postAPI} from "../../../utils/apiRequest";
import {UserOutlined} from "@ant-design/icons";
import {displayMessage, interpolate} from "../../../utils/common";
import lockr from "lockr";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";


class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.loadUserData();
    }

    loadUserData(page = 1) {
        let that = this;
        this.setState({
            loading: true
        });
        let successFn = function (data) {
            console.log("duserased on loca", data)
            that.setState({
                userData: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            });
        }
        let userId = lockr.get('id')
        getAPI(interpolate(USER, [userId]), successFn, errorFn)
    }

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
            that.props.history.push('/');
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
        const {userData, loading} = this.state;
        return (
            <Row gutter={1} type="flex" style={{marginTop: 20}}>

                <Col xs={24} sm={24} md={6} lg={6} xl={6} style={{textAlign: 'left'}}>
                    <Avatar size={100} icon={<UserOutlined/>} style={{
                        // alignContent: "center",
                        display: "block",
                        // marginLeft: 200,
                        // marginRight: 2,
                        background: "#3faecc",
                        verticalAlign: "top",
                    }}/>
                    <br/>
                    <h4>Name: {userData.first_name} {userData.last_name}</h4>
                    <h4>Email: {userData.email}</h4>
                    <h4>Phone: {userData.mobile}</h4>
                </Col>
                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                    <h2>Change Password</h2>
                    <Form name="basic"
                          labelCol={{span: 4}}
                          wrapperCol={{span: 18}}
                          initialValues={{remember: true}}
                          onFinish={this.onFinish}
                        // onFinishFailed={onFinishFailed}
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
                                <Button style={{backgroundColor:"#3faecc"}}type="primary" className={'theme-color'}
                                        htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Card>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default UserProfile;





