import React from 'react';
import {Card, Divider, Popconfirm, Space, Table} from "antd";
import moment from "moment";
import {getAPI, putAPI} from "../../../../utils/apiRequest";
import {SEARCHES, DEVICE_DETAIL, LOCATION_DETAIL} from "../../../../constants/api";
import {_get} from "../../../../utils/lodashUtils";
import {displayMessage, interpolate} from "../../../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import InfiniteFeedLoaderButton from "../../../../common/InfiniteFeedLoaderButton";
import {userNameAndCode} from "../../../../common/commonFunctions";

class ViewSearches extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceData: [],
            loading: false,
        }
    }
    componentDidMount() {
        this.loadSearchHistory();
    }
    loadSearchHistory(page = 1) {
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
        getAPI(SEARCHES, successFn, errorFn, {...params})
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
            that.loadSearchHistory();
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
                title: "User Name",
                key: "user_name",
                dataIndex: 'device_name',
                render: (item, record) =>  <span>{userNameAndCode(_get(record, 'user_data'))}</span>
            },{
                title: "Origin",
                key: "origin",
                dataIndex: 'origin',
                render: (item, record) =>  record.origin
            },{
                title: "Destination",
                key: "destination",
                dataIndex: 'destination',
                render: (item, record) =>  record.destination
            }
            // , {
            //     title: 'Action',
            //     key: 'action',
            //     render: (text, record) => (
            //         <span>
            //             <a onClick={() => this.editObject(record)}> Edit</a>
            //             <Divider type="vertical"/>
            //             <Popconfirm
            //                 title="Are you sure to delete this?"
            //                 onConfirm={() => this.deleteObject(record)}
            //                 okText="Yes"
            //                 cancelText="No"
            //             >
            //                 <a>Delete</a>
            //             </Popconfirm>
            //         </span>
            //     ),
            // }
            ];
        return (<div>
                        <Table loading={loading} columns={columns} dataSource={deviceData} pagination={false}/>
                        <InfiniteFeedLoaderButton
                            loaderFunction={() => this.loadSearchHistory(this.state.nextPage)}
                            hidden={!this.state.nextPage}
                        />
            </div>

        );
    }
}

export default ViewSearches;