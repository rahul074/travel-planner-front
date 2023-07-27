import React from 'react';
import {Form, Input, Button, Layout, Card, InputNumber, Spin, Select} from 'antd';
import {displayMessage, interpolate} from "../../../../utils/common";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE, INVERTER_TYPE_ABB, INVERTER_TYPE_SUNGROW} from "../../../../constants/dataKeys";
import {getAPI, postAPI, putAPI} from "../../../../utils/apiRequest";
import {DEVICE, DEVICE_DETAIL, LOCATION, LOCATION_DETAIL, USERS_LIST} from "../../../../constants/api";
import TextArea from "antd/es/input/TextArea";
import {usersDropDownListViewConverter} from "../../../../utils/locationUtils";
import {_get} from "../../../../utils/lodashUtils";
import editUser from "../userManagment/EditUser";
import {Option} from "antd/es/mentions";

const {Content} = Layout;

class AddOrEditLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            usersData: [],
            selected_user: []
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
                usersData: usersDropDownListViewConverter(result),
                loading: false,
                selected_user: that.props.editData && that.props.editData.user ? that.props.editData.user : []
            })
        }
        let errorFn = function (error) {
            that.setState({loading: false})
        }
        getAPI(USERS_LIST, successFn, errorFn, apiParams)
    }
    onHandleUser = (value, option) => {
        this.setState({
            selected_user: value
        })
    }

    onFinish = (values) => {
        let that = this;
        let {selected_user} = that.state
        that.setState({
            loading: true
        })
        const {editData} = that.props;
        let reqData = {
            ...values,
            user: selected_user
        }
        let successFn = function (result) {
            that.onSubmitSuccessMSG()
            that.props.onSelectTab('view-location')
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
        if (editData) {
            // reqData.id = editData.id
            // postAPI(LOCATION, reqData, successFn, errorFn)
            putAPI(interpolate(LOCATION_DETAIL, [editData.id]), reqData, successFn, errorFn)
        } else {
            postAPI(LOCATION, reqData, successFn, errorFn)
        }
    }
    onSubmitSuccessMSG = () => {
        const {editData} = this.props;
        if (editData) {
            displayMessage(SUCCESS_MSG_TYPE, 'Location Update Successfully.')
        } else {
            displayMessage(SUCCESS_MSG_TYPE, 'Location Added Successfully.')
        }
    }


    render() {
        const tailLayout = {
            wrapperCol: {offset: 4, span: 18},
        };
        let {loading} = this.state
        let {usersData} = this.state
        const {editData} = this.props;
        console.log(editData)
        return (<Spin spinning={loading}>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        height: '100%'
                    }}>
                    <Form labelCol={{span: 4,}}
                          wrapperCol={{span: 18,}}
                          layout="horizontal"
                          onFinish={this.onFinish}
                          autoComplete="off"
                        // key={editData ? editData.id + Math.random() : '1'}
                          initialValues={{
                              ...editData,
                              // user:editData.user.map(function(e){return e.toString()})
                          }}
                    >
                        <Form.Item
                            label="Location"
                            name="name"
                            rules={[{required: true, message: 'Please enter location nam!'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"Inverter Type"} name={"inverter_type"} rules={[{required: true}]}>
                            <Select placeholder="Select inverter type"
                                allowClear>
                                <Option value={INVERTER_TYPE_ABB}>{INVERTER_TYPE_ABB}</Option>
                                <Option value={INVERTER_TYPE_SUNGROW}>{INVERTER_TYPE_SUNGROW}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{required: true, message: 'Please input your address!'}]}
                        >
                            <TextArea/>
                        </Form.Item>
                        <Form.Item
                            label="Latitude"
                            name="latitude"
                            rules={[{required: true, message: 'Please input Latitude!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Longitude"
                            name="longitude"
                            rules={[{required: true, message: 'Please input Longitude!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Manager"
                            name="manager"
                            rules={[{required: false, message: 'Please input manager name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{required: false, message: 'Please input phone number!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="DC Capacity(in KWp)"
                            name="capacity"
                            rules={[{required: false, message: 'Please input capacity!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"User"} name={"user"} rules={[{required: false}]}>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{width: '100%'}}
                                placeholder="Please select"
                                defaultValue={editData && editData.user ? editData.user.map(function (e) {
                                    return e.toString()
                                }) : []}
                                onChange={this.onHandleUser}
                            >
                                {usersData.map((option, index) => (
                                    <Select.Option
                                        key={index}
                                        label={option.label}
                                        value={option.id.toString()}
                                    >{option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                            <br/>
                            {/*<Select*/}
                            {/*    mode="multiple"*/}
                            {/*    disabled*/}
                            {/*    style={{ width: '100%' }}*/}
                            {/*    placeholder="Please select"*/}
                            {/*    defaultValue={['a10', 'c12']}*/}
                            {/*    onChange={this.handleChange}*/}
                            {/*>*/}
                            {/*    {children}*/}
                            {/*</Select>*/}
                        </Form.Item>
                        <Form.Item
                            label="Pincode"
                            name="pincode"
                            rules={[{required: true, message: 'Please input pincode!'}]}
                        >
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button color="#ff5c5c" type="primary" className={'theme-color'}
                                    htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Content>
            </Spin>
        );
    }
}

export default AddOrEditLocation;