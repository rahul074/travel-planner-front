import React from 'react';
import {Col, DatePicker, Divider, Popconfirm, Row, Space, Table, Tag} from "antd";
import {getAPI, postAPI} from "../../../utils/apiRequest";
import {LOCATION_DEVICE} from "../../../constants/api";
import moment from "moment";
import {Link} from "react-router-dom";
import InfiniteFeedLoaderButton from "../../../common/InfiniteFeedLoaderButton";
import Search from "antd/es/input/Search";
import {_debounce} from "../../../utils/lodashUtils";

const {RangePicker} = DatePicker;

class UserDevices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceData: [],
            loading: false,
            locationName: null,
            total: null,
            startDate: null,
            endDate: null
        }
        this.searchString = _debounce(this.searchString, 500)
    }

    componentDidMount() {
        this.loadDevices();
        this.setState({
            locationName: this.props.match.params.locationName
        })
    }

    loadDevices(page = 1) {
        const {state} = this.props.location
        const {searchString} = this.state;
        let that = this;
        this.setState({
            loading: true
        });
        let reqData = {
            location: that.props.match.params.deviceId
        }
        let successFn = function (data) {
            console.log("devices based on loca", data)
            if (data.current === 1) {
                that.setState({
                    total: data.count,
                    nextPage: data.next,
                    deviceData: data.results,
                    loading: false
                })
            } else {
                that.setState(function (prevState) {
                    return {
                        total: data.count,
                        nextPage: data.next,
                        deviceData: [...prevState.deviceData, ...data.results],
                        loading: false
                    }
                })
            }
        }
        let errorFn = function () {
            that.setState({
                loading: false
            });
        }
        let params = {
            ...page,
            device_name__icontains: searchString || undefined,
            location: that.props.match.params.deviceId,
            start_date: this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD'),
            end_date: this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD'),
            action_taken: true,
        }
        getAPI(LOCATION_DEVICE, successFn, errorFn, params)
    }

    onChangeDateRange = (dates, dateStrings) => {
        let that = this
        that.setState({
            startDate: dates && dates[0],
            endDate: dates && dates[1]
        }, function () {
            that.loadDevices()
        })
    }
    searchString = (value) => {
        this.setState(function (prevState) {
            return {searchString: value}
        }, function () {
            this.loadDevices();
        })
    }

    render() {
        const {deviceData, loading, locationName} = this.state;
        const dateFormat = 'YYYY/MM/DD';
        const columns = [
            {
                title: "S. No.",
                key: "s_no",
                render: (item, record, index) => deviceData.indexOf(record) + 1
            }, {
                title: "Device Name",
                key: "device_name",
                dataIndex: 'device_name',
                render: (item, record) =>
                    <Link
                        to={{
                            pathname: "/device-overview/" + record.id.toString() + "/" + record.device_name.toString()
                        }}
                    >
                        {record.device_name}
                    </Link>
            }, {
                title: "Unit Key",
                key: "location",
                dataIndex: 'location',
                render: (item, record) => "-",
            }, {
                title: "Status",
                key: "address",
                dataIndex: 'alarms',
                render: (item, record) => {
                    if (record.summary.status === "Offline") {
                        return <center><Tag color="red" style={{
                            borderRadius: "20px",
                        }}>Offline</Tag></center>;
                    }
                    if (record.summary.status === "Online") {
                        return <center><Tag color="green" style={{
                            borderRadius: "20px",
                        }}>Online</Tag></center>;
                    }
                    if (record.summary.status === "On-Error") {
                        return <center><Tag color="red" style={{
                            borderRadius: "20px",
                        }}>On-Error</Tag></center>;
                    }
                    return <center><Tag color="orange" style={{
                        borderRadius: "20px",
                    }}>Alarm</Tag></center>;
                }
            }, {
                title: "Operation State",
                key: "alarm_ops_state",
                dataIndex: 'alarm_ops_state',
                render: (item, record) => {
                    if (record.alarm_ops_state !== null) {
                        return record.summary.alarm_ops_state;
                    } else {
                        return "-"
                    }
                },
            }, {
                title: 'Alarm Name',
                key: 'alarm_name',
                dataIndex: 'alarm_name',
                render: (item, record) => {
                    if (record.summary.alarm_name === "OK") {
                        return <center><Tag color="green" style={{
                            borderRadius: "20px",
                        }}>OK</Tag></center>;
                    }
                    return <center><Tag color="red" style={{
                        borderRadius: "20px",
                    }}>{record.summary.alarm_name}</Tag></center>;
                }
            }, {
                title: 'Alarm Date',
                key: 'alarm_date',
                dataIndex: 'alarm_date',
                render: (item, record) => {
                    if (record.summary.alarm_date !== null) {
                        return record.summary.alarm_date;
                    } else {
                        return "-"
                    }
                },

            }, {
                title: "Category",
                key: "address",
                dataIndex: 'alarms',
                render: (item, record) => <center><Tag color="blue" style={{
                    borderRadius: "20px",
                }}>Inverter</Tag></center>
            }, {
                title: "E.Today(kWh)",
                key: "address",
                dataIndex: 'alarms',
                render: (item, record) => {
                    if (record.summary.daily_energy !== null) {
                        return record.summary.daily_energy !== 0 ? parseFloat(record.summary.daily_energy).toFixed(2) : record.summary.daily_energy;
                    } else {
                        return "-"
                    }
                },
            }, {
                title: "E.Total(kWh)",
                key: "address",
                dataIndex: 'alarms',
                render: (item, record) => {
                    if (record.summary.total_energy !== null) {
                        return record.summary.total_energy !== 0 ? parseFloat(record.summary.total_energy).toFixed(2) : record.summary.total_energy;
                    } else {
                        return "-"
                    }
                },
            }, {
                title: "IMEI",
                key: "imei",
                dataIndex: 'imei',
                render: (item, record) => {
                    if (record.imei !== null) {
                        return record.imei;
                    } else {
                        return "-"
                    }
                },
            }, {
                title: "UID",
                key: "address",
                dataIndex: 'uid',
                render: (item, record) => {
                    if (record.summary.uid !== null) {
                        return record.summary.uid;
                    } else {
                        return "-"
                    }
                },
            }
        ];
        return (
            <div style={{fontFamily: "Open Sans Reguler"}}>
                <div style={{fontWeight: 'bold', fontSize: 24}}>
                    <span>{locationName}</span>
                </div>
                <br/>
                <div style={{display: 'block'}}>
                    <Row>
                        <Col span={22}>
                            <RangePicker
                                allowClear={true}
                                // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                                format={dateFormat}
                                onChange={this.onChangeDateRange}
                            />
                        </Col>
                        <Col span={2}>
                            <h1></h1>
                        </Col>
                    </Row>
                    <br/>
                    <Search placeholder="Search device here" onChange={(e) => this.searchString(e.target.value)}/>

                    {/*<Input placeholder={"Search Location.."} onChange={(e) => this.searchString(e.target.value)}*/}
                    {/*       className={"mb-10"} icon={<SearchOutlined />}/>*/}
                    <br/>
                    <br/>
                    <Table columns={columns} loading={loading} dataSource={deviceData} pagination={false}
                           size='small' onChange={this.handleChange} scroll={{x: 1300}}/>
                    <InfiniteFeedLoaderButton
                        loaderFunction={() => this.loadLocations(this.state.nextPage)}
                        hidden={!this.state.nextPage}
                    />
                </div>
            </div>
        );
    }
}

export default UserDevices;