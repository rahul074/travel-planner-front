import React from 'react';
import {Card, Divider, Popconfirm, Space, Table} from "antd";
import moment from "moment";
import {getAPI, putAPI} from "../../../../utils/apiRequest";
import {DEVICE, DEVICE_DETAIL, LOCATION_DETAIL} from "../../../../constants/api";
import {_get} from "../../../../utils/lodashUtils";
import {displayMessage, interpolate} from "../../../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import InfiniteFeedLoaderButton from "../../../../common/InfiniteFeedLoaderButton";

class ViewDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceData: [],
            loading: false,
        }
    }
    componentDidMount() {
        this.loadDevices();
    }
    loadDevices(page = 1) {
        let that = this;
        this.setState({
            loading: true
        });
        let successFn = function (data) {
            if (data.current === 1) {
                that.setState({
                    total: data.count,
                    nextPage: data.next,
                    deviceData: data.results,
                    loading: false
                })
            } else {
                that.setState(function (prevState) {
                    // console.log(data.results)
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
            page,
            action_taken: true,
              }
        getAPI(DEVICE, successFn, errorFn, {...params})
    }
    editObject = (record) => {
        this.props.onSelectTab('add-device', record)
    }
    deleteObject = (record) => {
        let that = this;
        that.setState({loading:true})
        let reqData = {
            ...record,
            is_active: false
        }
        let successFn = function (result) {
            displayMessage(SUCCESS_MSG_TYPE, "Device deleted Successfully!")
            that.setState({loading:false})
            that.loadDevices();
        }
        let errorFn = function (error) {
            that.setState({loading:false})
        }
        putAPI(interpolate(DEVICE_DETAIL, [record.id]), reqData, successFn, errorFn)
    }
    render() {
        const {deviceData, loading} = this.state;

        const columns = [
            {
                title: "S. No.",
                key: "s_no",
                render: (item, record, index) => deviceData.indexOf(record) + 1
            },{
                title: "Device Name",
                key: "device_name",
                dataIndex: 'device_name',
                render: (item, record) =>  record.device_name
            },{
                title: "IMEI",
                key: "imei",
                dataIndex: 'imei',
                render: (item, record) =>  record.imei
            },{
                title: "Location",
                key: "location",
                dataIndex: 'location',
                render: (item, record) =>  <span>{_get(record, 'location') ?
                    _get(record, 'location_data.name') : "--"}</span>
            }, {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a onClick={() => this.editObject(record)}> Edit</a>
                        <Divider type="vertical"/>
                        <Popconfirm
                            title="Are you sure to delete this?"
                            onConfirm={() => this.deleteObject(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    </span>
                ),
            }
            ];
        return (<div>
                        <Table loading={loading} columns={columns} dataSource={deviceData} pagination={false}/>
                        <InfiniteFeedLoaderButton
                            loaderFunction={() => this.loadDevices(this.state.nextPage)}
                            hidden={!this.state.nextPage}
                        />
            </div>

        );
    }
}

export default ViewDevice;