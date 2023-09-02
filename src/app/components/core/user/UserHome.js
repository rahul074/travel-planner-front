import React from 'react'
import {Button, Card, Checkbox, Col, Form, Image, Input, Modal, Row, Table, Tag} from "antd";
import {getAPI, postAPI, putAPI} from "../../../utils/apiRequest";
import {OVERVIEW_DATA, LOCATION_USER_LIST, DEVICE_DETAIL, SEARCHES, CHATGPT} from "../../../constants/api";
import InfiniteFeedLoaderButton from "../../../common/InfiniteFeedLoaderButton";
import {displayMessage, interpolate} from "../../../utils/common";
import {ERROR_MSG_TYPE} from "../../../constants/dataKeys";
import lockr from "lockr";
import {_debounce,} from "../../../utils/lodashUtils";
import moment from "moment";

class UserHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: []
        }
    }
    componentDidMount() {
        let token = lockr.get('token')

    }

    onFinish = (values) => {
        console.log("sjdfsjdhfkjsdhf")
        let that = this;
        that.setState({loading: true})
        let reqData = {
            ...values,
        }
        let successFn = function (result) {
            console.log("sjdfsjdhfkjsdhf---------------")
            that.setState({
                showModal: true,
                modalData: result // Set the response data here
            });
            console.log("sjdfsjdhfkjsdhf-----wer----------")
            // that.onSubmitSuccessMSG()
            // that.props.onSelectTab('/')
            that.setState({
                loading: false
            })
        }
        let errorFn = function (error) {
            console.log("sjdfsjdhfkjsdhf23423333333333")
            that.setState({
                loading: false
            })
            Object.values(error).map(item =>
                displayMessage(ERROR_MSG_TYPE, item)
            );
        }
        postAPI(CHATGPT, reqData, successFn, errorFn)
        // postWithOutTokenAPI(SEARCHES, reqData, successFn, errorFn);
    }
    handleModalOk = () => {
        const { selectedOptions } = this.state;
        lockr.set('selectedLocations', selectedOptions);
        this.setState({
            showModal: false,
            modalData: null
        });
        this.props.history.push("/profile"); // Assuming your route is named "map-view"
    }
    handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const [latitude, longitude] = value.split('-');

        this.setState(prevState => {
            if (checked) {
                return { selectedOptions: [...prevState.selectedOptions, { latitude, longitude }] };
            } else {
                return { selectedOptions: prevState.selectedOptions.filter(option => option.latitude !== latitude || option.longitude !== longitude) };
            }
        });
    }
    render() {
        // Rest of the render method...
        return (
            <div style={{ fontFamily: 'Open Sans Reguler', padding: '20px', background: '#92d0c9' }}>
                {/* Single Image */}
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <Image src="/map_graphic.jpg" preview={false} style={{ maxWidth: '100vw'}} />
                </div>
                {/* Form */}
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                    onFinish={this.onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="From"
                        name="from"
                        rules={[{ required: true, message: 'Please enter "From" location!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Destination"
                        name="destination"
                        rules={[{ required: true, message: 'Please enter "Destination" location!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center', margin: '20px' }}>
                        <Button
                            style={{ backgroundColor: '#ff5c5c', borderColor: '#ff5c5c' }}
                            type="primary"
                            className={'theme-color'}
                            htmlType="submit"
                        >
                            Find Best Places
                        </Button>
                    </Form.Item>
                </Form>
                <br />
                <br />
                <Modal
                    title="Select Locations"
                    visible={this.state.showModal}
                    onOk={this.handleModalOk}
                    onCancel={() => this.setState({ showModal: false })}
                >
                    {this.state.modalData && this.state.modalData.map((item, index) => (
                        <div key={index}>
                            <Checkbox
                                value={`${item.latitude}-${item.longitude}`}
                                checked={this.state.selectedOptions.some(option => option.latitude === item.latitude && option.longitude === item.longitude)}
                                onChange={this.handleCheckboxChange}
                            >
                                {item.name}
                            </Checkbox>
                        </div>
                    ))}
                </Modal>
            </div>
        );
    }
}

export default UserHome;