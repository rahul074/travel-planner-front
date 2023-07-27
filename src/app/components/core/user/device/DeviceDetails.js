import React from 'react';
import {Avatar, Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Spin} from "antd";
import {getAPI, postAPI} from "../../../../utils/apiRequest";
import {DEVICE_DETAIL} from "../../../../constants/api";
import {interpolate} from "../../../../utils/common";
import TextArea from "antd/es/input/TextArea";


class DeviceDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceData: [],
            loading: false,
            deviceName: null,
            total: null,
            startDate: null,
            endDate: null
        }
    }

    componentDidMount() {
        this.loadDeviceDetails();
        this.setState({
            deviceName: this.props.match.params.deviceName
        })
    }

    loadDeviceDetails() {
        let that = this;
        this.setState({
            loading: true
        });
        let successFn = function (data) {
            that.setState({
                deviceData: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            });
        }
        getAPI(interpolate(DEVICE_DETAIL, [that.props.match.params.deviceId]), successFn, errorFn)
    }


    render() {
        const {deviceData, loading, deviceName} = this.state;
        const locationData = deviceData ? deviceData.location_data : null
        console.log(locationData, deviceData)
        const latitude = locationData ? locationData.latitude : null
        const longitude = locationData ? locationData.longitude : null
        let gmap_url = "https://maps.google.com/maps?q=" + latitude + ',' + longitude + "&hl=es;z=14&amp&output=embed"
        if (locationData) {
            return (<Spin spinning={loading}>
                <Row gutter={16}>
                    <Col span={10}>
                        <Card style={{
                            width: "100%",
                            height: 600,
                            margin: "20px",
                            borderRadius: "20px",
                            overflow: "hidden"
                        }}
                              cover={<iframe id="map-iframe" alt="example" src={gmap_url} height="600"/>}>
                        </Card>
                    </Col>
                    <Col span={14}>
                        <Card bordered={false}>
                            <div style={{fontWeight: 'bold', fontSize: 24}}>
                                <span>{deviceName}</span>
                            </div>
                            <br/>
                            <Form layout="vertical"
                                  initialValues={{
                                      ...deviceData,
                                      // user:editData.user.map(function(e){return e.toString()})
                                  }}>
                                <Form.Item
                                    label="Device Name"
                                    name="device_name">
                                    <Input style={{borderRadius:"6px"}} defaultValue={deviceData ? deviceData.device_name : "Device name"}
                                           disabled/>
                                </Form.Item>
                                <Form.Item
                                    label="Description"
                                    name="description">
                                    <TextArea style={{borderRadius:"6px"}} defaultValue={locationData ? locationData.address : "DC Capacity"}
                                              disabled/>
                                </Form.Item>
                                <Form.Item
                                    label="Manager"
                                    name="manager">
                                    <Input style={{borderRadius:"6px"}} defaultValue={locationData ? locationData.manager : "Manager Name"}
                                           disabled/>
                                </Form.Item>
                                <Form.Item
                                    label="Phone"
                                    name="phone">
                                    <Input style={{borderRadius:"6px"}} defaultValue={locationData ? locationData.phone : "Phone"}
                                           disabled/>
                                </Form.Item>
                            </Form>
                        <br/>
                        <Form layout="inline"
                              initialValues={{
                                  ...deviceData,
                                  // user:editData.user.map(function(e){return e.toString()})
                              }}>
                            <Form.Item
                                label="Longitude"
                                name="longitude">
                                <InputNumber style={{borderRadius:"6px"}} defaultValue={locationData ? locationData.longitude : "longitude"}
                                       disabled/>
                            </Form.Item>
                            <Form.Item
                                label="Latitude"
                                name="latitude"
                            >
                                <InputNumber style={{borderRadius:"6px"}} defaultValue={locationData ? locationData.latitude : "latitude"}
                                       disabled/>
                            </Form.Item>
                        </Form>
                        <br/>
                        <Form layout="vertical"
                              initialValues={{
                                  ...deviceData,
                                  // user:editData.user.map(function(e){return e.toString()})
                              }}>
                            <Form.Item
                                label="Inverter Type"
                                name="inverter_type">
                                <Input style={{borderRadius:"6px"}} defaultValue={locationData ? locationData.inverter_type : "Inverter type"}
                                       disabled/>
                            </Form.Item>
                            <Form.Item
                                label="DC Capacity (in KWp)"
                                name="capacity">
                                <Input style={{borderRadius:"6px"}} defaultValue={locationData ? locationData.capacity : "DC Capacity"}
                                       disabled/>
                            </Form.Item>


                        </Form>
                    </Card>
                </Col>

            </Row>
        </Spin>
        );
        }
    }
}

export default DeviceDetails;
