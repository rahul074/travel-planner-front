import React from 'react'
import {Button, Card, Col, Form, Image, Input, Row, Table, Tag} from "antd";
import {getAPI, postAPI, putAPI} from "../../../utils/apiRequest";
import {OVERVIEW_DATA, LOCATION_USER_LIST, DEVICE_DETAIL, DEVICE, CHATGPT} from "../../../constants/api";
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
            that.props.history.push("/profile");
            console.log("sjdfsjdhfkjsdhf---------------")
            that.onSubmitSuccessMSG()
            that.props.onSelectTab('/')
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
        // postWithOutTokenAPI(DEVICE, reqData, successFn, errorFn);
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
            </div>
        );
    }
}

export default UserHome;