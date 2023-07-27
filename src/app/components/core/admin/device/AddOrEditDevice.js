import React from 'react';
import {Form, Input, Button, Select, Layout, Card, Spin} from 'antd';
import {displayMessage, interpolate} from "../../../../utils/common";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import {getAPI, postAPI, postWithOutTokenAPI, putAPI} from "../../../../utils/apiRequest";
import {DEVICE, DEVICE_DETAIL, LOCATION, LOCATION_DETAIL, LOCATION_LIST} from "../../../../constants/api";
import {locationDropDownListViewConverter} from "../../../../utils/locationUtils";
import {_get} from "../../../../utils/lodashUtils";

const {Content} = Layout;

class AddOrEditLocation extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            locationData: [],
            loading: false,
            selected_location: null
        }
    }

    componentDidMount() {
        this.loadLocation()
    }

    loadLocation = () => {
        let that = this;
        let apiParams = {
            pagination: false
        }
        let edit_location = that.props.editData && that.props.editData.location ? that.props.editData.location : null
        that.setState({loading: true, selected_location: edit_location})
        let successFn = function (result) {
            that.setState({
                locationData: locationDropDownListViewConverter(result), loading: false
            })
        }
        let errorFn = function (error) {
            that.setState({loading: false})
        }
        getAPI(LOCATION_LIST, successFn, errorFn, apiParams)
    }

    onFinish = (values) => {
        let that = this;
        let {selected_location} = that.state
        const {editData} = that.props;
        that.setState({loading: true})
        let reqData = {
            ...values,
            location: selected_location
        }
        // that.setState({
        //     loading: true
        // })
        let successFn = function (result) {
            that.onSubmitSuccessMSG()
            that.props.onSelectTab('view-device')
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
            putAPI(interpolate(DEVICE_DETAIL, [editData.id]), reqData, successFn, errorFn)
        } else {
            postAPI(DEVICE, reqData, successFn, errorFn)
        }
        // postWithOutTokenAPI(DEVICE, reqData, successFn, errorFn);
    }
    onSubmitSuccessMSG = () => {
        const {editData} = this.props;
        if (editData) {
            displayMessage(SUCCESS_MSG_TYPE, 'Location Updated Successfully.')
        } else {
            displayMessage(SUCCESS_MSG_TYPE, 'Location Added Successfully.')
        }
    }

    onHandleLocation = (value, option) => {
        this.setState({
            selected_location: value
        })
    }

    render() {
        let that = this;
        let {locationData, loading} = that.state
        const tailLayout = {
            wrapperCol: {offset: 4, span: 18},
        };
        const {editData} = this.props;
        return (
            <Spin spinning={loading}>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        height: '100%',
                    }}>
                    <Form labelCol={{span: 4,}}
                          wrapperCol={{span: 18,}}
                          layout="horizontal"
                          onFinish={this.onFinish}
                          // key={editData ? editData.id + Math.random() : '1'}

                          initialValues={{
                              ...editData,
                              location:editData && editData.location ? editData.location.toString() : null
                          }}>
                            <Form.Item label={"Location"} name={"location"} rules={[{required: true}]}>
                                <Select
                                    loading={loading}
                                    showSearch
                                    allowClear
                                    style={{width: '100%'}}
                                    placeholder={"Location"}
                                    // optionFilterProp="location_id"
                                    onChange={(value, option) => that.onHandleLocation(value, option)}
                                >
                                    {locationData.map((option, index) => (
                                        <Select.Option
                                            key={option.id}
                                            label={option.label}
                                            value={option.id.toString()}
                                        >{option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Device" name="device_name" rules={[{required: true}]}>
                                <Input placeholder="Device name"/>
                            </Form.Item>
                            <Form.Item label="IMEI" name="imei" rules={[{required: true}]}>
                                <Input placeholder="IMEI number"/>
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