import {Table, Space, Card, Button, Divider, Popconfirm, Select, Tag} from 'antd';
import React from 'react';
import moment from "moment";

import {LOCATION, LOCATION_DETAIL, USER} from "../../../../constants/api";
import {getAPI, putAPI} from "../../../../utils/apiRequest";
import {displayMessage, interpolate} from "../../../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import InfiniteFeedLoaderButton from "../../../../common/InfiniteFeedLoaderButton";


class ViewLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationData: [],
            loading: false,
            total: null,
        }
    }

    componentDidMount() {
        this.loadLocations();
    }

    loadLocations(page = 1) {
        let that = this;
        this.setState({
            loading: true
        });
        let successFn = function (data) {
            if (data.current === 1) {
                that.setState({
                    total: data.count,
                    nextPage: data.next,
                    locationData: data.results,
                    loading: false
                })
            } else {
                that.setState(function (prevState) {
                    return {
                        total: data.count,
                        nextPage: data.next,
                        locationData: [...prevState.locationData, ...data.results],
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
            action_taken: true
        }
        getAPI(LOCATION, successFn, errorFn, {...params})
    }

    editObject = (record) => {
        this.props.onSelectTab('add-location', record)
    }
    deleteObject = (record) => {
        let that = this;
        that.setState({loading: true})
        let reqData = {
            ...record,
            is_active: false
        }
        let successFn = function (result) {
            displayMessage(SUCCESS_MSG_TYPE, "Location deleted Successfully!")
            that.setState({loading: false})
            that.loadLocations();
        }
        let errorFn = function (error) {
            that.setState({loading: false})
        }
        putAPI(interpolate(LOCATION_DETAIL, [record.id]), reqData, successFn, errorFn)
    }

    render() {
        const {locationData, loading} = this.state;

        const columns = [
            {
                title: "S. No.",
                key: "s_no",
                render: (item, record, index) => locationData.indexOf(record) + 1
            },
            {
                title: "Name",
                key: "name",
                dataIndex: 'name',
                render: (item, record) => record.name
            },
            {
                title: "Inverter Type",
                key: "inverter_type",
                dataIndex: 'inverter_type',
                render: (item, record) => record.inverter_type
            },{
                title: "Pincode",
                key: "pincode",
                dataIndex: 'pincode',
                render: (item, record) => record.pincode
            }, {
                title: "Address",
                key: "address",
                dataIndex: 'address',
                render: (item, record) => record.address
            },{
                title: "Latitude",
                key: "latitude",
                dataIndex: 'latitude',
                render: (item, record) => record.latitude
            },{
                title: "Longitude",
                key: "longitude",
                dataIndex: 'longitude',
                render: (item, record) => record.longitude
            },{
                title: "Manager",
                key: "manager",
                dataIndex: 'manager',
                render: (item, record) => record.manager
            },{
                title: "Phone",
                key: "phone",
                dataIndex: 'phone',
                render: (item, record) => record.phone
            },{
                title: "DC Capacity(KWp)",
                key: "capacity",
                dataIndex: 'capacity',
                render: (item, record) => record.capacity
            },{
                title: 'Users',
                key: 'user',
                dataIndex: 'user',
                render: (item, record) => <span>
                    {record.user ?
                        record.user_data.map((item) => <Tag>{`${item.first_name} `}</Tag>)
                        : "--"}
                </span>
            },
            {
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
                    <Table loading={loading} columns={columns} dataSource={locationData} pagination={false}/>
                    <InfiniteFeedLoaderButton
                        loaderFunction={() => this.loadLocations(this.state.nextPage)}
                        hidden={!this.state.nextPage}
                    />
            </div>
        );
    }
}

export default ViewLocation;