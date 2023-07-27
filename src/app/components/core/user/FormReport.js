import React from "react";
import {Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import {Option} from "antd/es/mentions";
import {displayMessage, interpolate} from "../../../utils/common";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import {getAPI, postAPI, putAPI} from "../../../utils/apiRequest";
import {LOCATION, LOCATION_DETAIL, LOCATION_USER_LIST, REPORTS} from "../../../constants/api";
import moment from "moment";
import {_debounce} from "../../../utils/lodashUtils";
import {locationDropDownListViewConverter, usersDropDownListViewConverter} from "../../../utils/locationUtils";

const {RangePicker} = DatePicker;


class FormReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationData: [],
            selected_location: [],
            loading: false,
            total:null,
            fromDate:moment().format('YYYY-MM-DD'),
            toDate:moment().format('YYYY-MM-DD')
        }
    }
    componentDidMount() {
        this.loadLocations()
    }

    loadLocations(page = 1) {
        let that = this;
        const {searchString} = this.state;
        this.setState({
            loading: true
        });
        let successFn = function (data) {
            if (data.current === 1) {
                that.setState({
                    locationData: locationDropDownListViewConverter(data.results),
                    total: data.count,
                    nextPage: data.next,
                    // locationData: data.results,
                    loading: false
                })
            } else {

                that.setState(function (prevState) {
                    return {
                        locationData: locationDropDownListViewConverter(data.results),
                        total: data.count,
                        nextPage: data.next,
                        // locationData: [...prevState.locationData, ...data.results],
                        loading: false
                    }
                })
            }
        }
        let errorFn = function (error) {
            that.setState({
                loading: false
            });
            Object.values(error).map(item =>
                displayMessage(ERROR_MSG_TYPE, item)
            );
        }
        let params = {
            page,
            date: this.state.selected_date,
            action_taken: true,
            name__icontains: searchString || undefined
        }
        getAPI(LOCATION_USER_LIST, successFn, errorFn, {...params})
    }

    onFinish = (values) => {
        let that = this;
        let {selected_location, fromDate, toDate} = that.state

        that.setState({
            loading: true
        })
        const {editData} = that.props;
        console.log(values, selected_location)
        let reqData = {
            ...values,
            location : selected_location,
            from_date : this.state.fromDate ? moment(this.state.fromDate).format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD'),
            to_date : this.state.toDate ? moment(this.state.toDate).format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD')
        }

        let successFn = function (result) {
            displayMessage(SUCCESS_MSG_TYPE, 'Report bundle added Successfully.')
            that.props.history.push("/report")
            that.setState({
                loading: false
            })
            this.props.history.push('/')
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
            postAPI(REPORTS, reqData, successFn, errorFn)
        }
    }
    onHandleLocation = (value, option) => {
        this.setState({
            selected_location: value
        })
    }
    onChangeDateRange = (dates, dateStrings) => {
        let that = this
        that.setState({
            fromDate: dates && dates[0],
            toDate: dates && dates[1]
        }, function () {
            that.loadLocations()
        })
    }
    render() {
        const tailLayout = {
            wrapperCol: {offset: 4, span: 18},
        };
        const dateFormat = 'YYYY/MM/DD';
        let {locationData} = this.state
        return(<div style={{fontFamily: "Open Sans Reguler"}}>
            <div style={{fontWeight: 'bold', fontSize: 24}}>
               <span>Add Reports Bundle</span>
            </div>
                <br/>
            <Form labelCol={{span: 4,}}
                  wrapperCol={{span: 18,}}
                  layout="horizontal"
                  onFinish={this.onFinish}
                  autoComplete="off"
                // key={editData ? editData.id + Math.random() : '1'}
                //   initialValues={{
                //       ...editData,
                      // user:editData.user.map(function(e){return e.toString()})
                  // }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true, message: 'Please enter name!'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label={"Report Type"} name={"frequency"} rules={[{required: true}]}>
                    <Select
                        placeholder="Select a option and change input text above"
                        allowClear
                    >
                        <Option value="daily">Daily</Option>
                        {/*<Option value="monthly">Monthly</Option>*/}
                        {/*<Option value="yearly">Yearly</Option>*/}
                    </Select>
                </Form.Item>
                <Form.Item label="Date" name={"date"} rules={[{required: true}]}>
                    <RangePicker
                        allowClear={true}
                        format={dateFormat}
                        onChange={this.onChangeDateRange}
                    />
                </Form.Item>
                <Form.Item label={"Report Category"} name={"category"} rules={[{required: true}]}>
                    <Select
                        placeholder="Select category"
                        allowClear
                    >
                        <Option value="siteAnalysis">Site Analysis</Option>
                    </Select>
                </Form.Item>
                <Form.Item label={"Site"} name={"location"} rules={[{required: false}]}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                        onChange={this.onHandleLocation}
                    >
                        {locationData.map((option, index) => (
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
                <Form.Item {...tailLayout}>
                    <Button color="#ff5c5c" type="primary" className={'theme-color'}
                            htmlType="submit">Add</Button>
                </Form.Item>

            </Form>
            </div>
        );
    }

}
export default FormReport;