import {Table, Card, Divider, Popconfirm, Spin} from 'antd';
import React from 'react';
import {getAPI, putAPI} from "../../../../utils/apiRequest";
import {LOCATION_DETAIL, USER, USERS_LIST} from "../../../../constants/api";
import {interpolate} from "../../../../utils/common";
import InfiniteFeedLoaderButton from "../../../../common/InfiniteFeedLoaderButton";


class ViewUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersData: [],
            loading: false,
            total: null,
        }
    }

    componentDidMount() {
        this.loadUsers();
    }

    loadUsers(page = 1) {
        let that = this;
        this.setState({
            loading: true
        });
        let successFn = function (data) {
            if (data.current === 1) {
                that.setState({
                    total: data.count,
                    nextPage: data.next,
                    usersData: data.results,
                    loading: false
                })
            } else {
                that.setState(function (prevState) {
                    return {
                        total: data.count,
                        nextPage: data.next,
                        usersData: [...prevState.usersData, ...data.results],
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
        getAPI(USERS_LIST, successFn, errorFn, {...params})
    }
    editObject = (record) => {
        this.props.onSelectTab('add-location', record)
    }
    deleteObject = (record) => {
        let that = this;
        that.setState({loading:true})
        let reqData = {
            ...record,
            is_active: false
        }
        let successFn = function (result) {
            that.setState({loading:false})
            that.loadUsers();
        }
        let errorFn = function (error) {
            that.setState({loading:false})
        }
        putAPI(interpolate(USER, [record.id]), reqData, successFn, errorFn)
    }
    render() {
        const {usersData, loading} = this.state;

        const columns = [
            {
                title: "S. No.",
                key: "s_no",
                render: (item, record, index) => usersData.indexOf(record) + 1
            },
            {
                title: "Name",
                key: "name",
                dataIndex: 'name',
                render: (item, record) => record.first_name
            },
            {
                title: "Email",
                key: "email",
                dataIndex: 'email',
                render: (item, record) => record.email
            },
            {
                title: "Address",
                key: "address",
                dataIndex: 'address',
                render: (item, record) => record.address
            },
            {
                title: "Mobile",
                key: "mobile",
                dataIndex: 'mobile',
                render: (item, record) => record.mobile
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
                    <Table loading={loading} columns={columns} dataSource={usersData} pagination={false}/>
                    <InfiniteFeedLoaderButton
                        loaderFunction={() => this.loadUsers(this.state.nextPage)}
                        hidden={!this.state.nextPage}
                    />
            </div>
        );
    }
}

export default ViewUsers;