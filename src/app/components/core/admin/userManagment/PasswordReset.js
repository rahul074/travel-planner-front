import React from 'react'
import {Button, Card, Form, Input, Select, Spin} from "antd";
import {Content} from "antd/es/layout/layout";
import {usersDropDownListViewConverter} from "../../../../utils/locationUtils";
import {getAPI, postAPI, putAPI} from "../../../../utils/apiRequest";
import {SUPERADMIN_PASSWORD_RESET, USER, USERS_LIST} from "../../../../constants/api";
import {displayMessage, interpolate} from "../../../../utils/common";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import {_get} from "../../../../utils/lodashUtils";


class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersData: [],
            loading: false,
            selected_user: null
        }
    }

    componentDidMount() {
        this.loadUsers()
    }

    loadUsers = () => {
        let that = this;
        let apiParams = {
            pagination: false
        }
        that.setState({loading: true})
        let successFn = function (result) {
            that.setState({
                usersData: usersDropDownListViewConverter(result), loading: false
            })
        }
        let errorFn = function (error) {
            that.setState({loading: false})
        }
        getAPI(USERS_LIST, successFn, errorFn, apiParams)
    }
    onHandleUser = (value, option) => {
        this.setState({
            selected_user: _get(value, 'key')
        })
    }
    onFinish = (values) => {
        let that = this;
        let {selected_user} = that.state
        let reqData = {
            ...values
        }
        that.setState({
            loading: true
        })
        let successFn = function (result) {
            displayMessage(SUCCESS_MSG_TYPE, "Password updated Successfully.")
            that.setState({
                loading: false
            })
        }
        let errorFn = function (error) {
            that.setState({
                loading: false
            })
            Object.values(error).map(item => displayMessage(ERROR_MSG_TYPE, item));
        }
        postAPI(SUPERADMIN_PASSWORD_RESET, reqData, successFn, errorFn)
    }

    render() {
        const tailLayout = {
            wrapperCol: {offset: 4, span: 18},
        };
        const {noPadding} = this.props;
        let {usersData, loading} = this.state
        return (<Spin spinning={loading}>
            <Content style={{
                padding: noPadding ? 0 : 10, height: `calc(100vh - 65px)`, overflow: 'auto'
            }}>
                <h2>Reset User Password</h2>
                <Form name="basic"
                      labelCol={{span: 4}}
                      wrapperCol={{span: 18}}
                      initialValues={{remember: true}}
                      onFinish={this.onFinish}
                    // onFinishFailed={onFinishFailed}
                      autoComplete="off">
                    <Card>
                        <Form.Item label={"Select Employee"} name={"user"} rules={[{required: true}]}>
                            <Select
                                showSearch
                                allowClear
                                style={{width: '100%'}}
                                placeholder={"Users"}
                                optionFilterProp="children"
                                onChange={(value, option) => this.onHandleUser(value, option)}
                            >
                                {usersData.map((option, index) => (<Select.Option
                                    key={index}
                                    label={option.label}
                                    value={option.id}
                                >{option.label}
                                </Select.Option>))}
                            </Select>
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
                            rules={[{required: true, message: 'Please confirm your password!'}, ({getFieldValue}) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button color="#ff5c5c" type="primary" className={'theme-color'}
                                    htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Card>
                </Form>
            </Content>
        </Spin>);
    }
}

export default PasswordReset;