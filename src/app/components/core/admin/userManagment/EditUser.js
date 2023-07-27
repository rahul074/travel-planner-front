import React from 'react';
import {Form, Input, Button, Select, Card, Row, Col} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {Content} from "antd/es/layout/layout";
import {usersDropDownListViewConverter} from "../../../../utils/locationUtils";
import {getAPI, putAPI} from "../../../../utils/apiRequest";
import {USER, USERS_LIST} from "../../../../constants/api";
import {displayMessage} from "../../../../utils/common";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import {interpolate} from "../../../../utils/common";


class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersData: [],
            editData: [],
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
        let successFn = function (result) {
            that.setState({
                usersData: usersDropDownListViewConverter(result),
            })
        }
        let errorFn = function (error) {

        }
        getAPI(USERS_LIST, successFn, errorFn, apiParams)
    }

    async onHandleUser(value, option){
        await this.setState({selected_user: value})
        this.loadUserData()
    }

    loadUserData = () => {
        let {selected_user} = this.state
        let that = this;
        let apiParams = {
            pagination: false
        }
        let successFn = function (result) {
            that.setState({
                editData: result,
            })
        }
        let errorFn = function (error) {
        }
        getAPI(interpolate(USER, [selected_user]), successFn, errorFn)
    }

    onFinish = (values) => {
        let that = this;
        let {selected_user} = that.state
        that.setState({loading: true})
        let reqData = {
            ...values,
            user: selected_user
        }
        let successFn = function (result) {
            displayMessage(SUCCESS_MSG_TYPE, "User edited Successfully.")
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
        putAPI(interpolate(USER, [values.user]), reqData, successFn, errorFn)
    }

    render() {
        const tailLayout = {
            wrapperCol: {offset: 4, span: 18},
        };
        const {noPadding} = this.props;
        let {usersData, editData} = this.state
        return (
            <Content
                style={{
                    padding: noPadding ? 0 : 10,
                    height: `calc(100vh - 65px)`,
                    overflow: 'auto'
                }}>
                <h2>Edit User</h2>
                <Row>
                    <Col span={12} offset={6}>
                        <Select
                            showSearch
                            allowClear
                            style={{width: '100%'}}
                            placeholder={"Users"}
                            optionFilterProp="children"
                            onChange={(value, option) => this.onHandleUser(value, option)}
                        >
                            {usersData.map((option, index) => (
                                <Select.Option
                                    key={index}
                                    label={option.label}
                                    value={option.id}
                                >{option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Form name="basic"
                      labelCol={{span: 4}}
                      wrapperCol={{span: 18}}
                      initialValues={{
                          ...editData,
                      }}
                      onFinish={this.onFinish}
                    // onFinishFailed={onFinishFailed}
                      autoComplete="off">
                    <Card>

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
                            rules={[{required: false, message: 'Please input your last name!'}]}
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

export default EditUser;