import React from 'react'
import {Col, DatePicker, Divider, Menu, Popconfirm, Row, Table, Tag} from "antd";
import {Link} from "react-router-dom";
import {DeleteOutlined, DownloadOutlined, ExportOutlined} from "@ant-design/icons";
import {getAPI, putAPI} from "../../../utils/apiRequest";
import {IMAGE_BASE_URL,REPORTS,REPORTS_DETAIL,REPORTS_ZIP} from "../../../constants/api";
import moment from "moment";
import InfiniteFeedLoaderButton from "../../../common/InfiniteFeedLoaderButton";
import {displayMessage, interpolate} from "../../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import Search from "antd/es/input/Search";
import {_debounce} from "../../../utils/lodashUtils";


class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reportsData: [],
            loading: false,
            total: null,
        }
        this.searchString = _debounce(this.searchString, 500)
    }

    componentDidMount() {
        this.loadReports();
    }

    loadReports(page = 1) {
        let that = this;
        const {searchString} = this.state;
        this.setState({
            loading: true
        });
        let successFn = function (data) {
            console.log(data)
            if (data.current === 1) {
                that.setState({
                    total: data.count,
                    nextPage: data.next,
                    reportsData: data.results,
                    loading: false
                })
            } else {
                that.setState(function (prevState) {
                    return {
                        total: data.count,
                        nextPage: data.next,
                        reportsData: [...prevState.reportsData, ...data.results],
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
            name__icontains: searchString || undefined,
            action_taken: true
        }
        getAPI(REPORTS, successFn, errorFn, {...params})
    }

    deleteObject = (record) => {
        let that = this;
        that.setState({loading: true})
        let reqData = {
            ...record,
            is_active: false
        }
        let successFn = function (result) {
            displayMessage(SUCCESS_MSG_TYPE, "Record deleted Successfully!")
            that.setState({loading: false})
            that.loadReports();
        }
        let errorFn = function (error) {
            that.setState({loading: false})
        }
        putAPI(interpolate(REPORTS_DETAIL, [record.id]), reqData, successFn, errorFn)
    }

    loadZipFile = (record) => {
        let that = this;
        that.setState({loading: true})
        let successFn = function (result) {
            console.log(result)
            window.open(IMAGE_BASE_URL + result.path)
            displayMessage(SUCCESS_MSG_TYPE, "Report downloaded Successfully!")
            that.setState({loading: false})
            that.loadReports();
        }
        let errorFn = function (error) {
            that.setState({loading: false})
        }
        let params = {
            report_id: record.id,
            action_taken: true
        }
        getAPI(REPORTS_ZIP, successFn, errorFn, {...params})
    }

    searchString = (value) => {
        this.setState(function (prevState) {
            return {searchString: value}
        }, function () {
            this.loadReports();
        })
    }

    render() {
        const {reportsData, loading} = this.state;
        const columns = [
            {
                title: "Report Name",
                key: "name",
                dataIndex: 'name',
                align: "center",
                render: (item, record) => record.name

            }, {
                title: "From",
                key: "from",
                dataIndex: 'from_date',
                align: "center",
                render: (item, record) => moment(record.from_date).format('DD-MM-YYYY')

            }, {
                title: "To",
                key: "to",
                dataIndex: 'to_date',
                align: "center",
                render: (item, record) => moment(record.to_date).format('DD-MM-YYYY')

            }, {
                title: "Report Frequency",
                key: "report_frequency",
                dataIndex: 'alarms',
                align: "center",
                render: (item, record) => record.frequency
            }, {
                title: "Bundling Status",
                key: "bundling_status",
                dataIndex: 'alarms',
                align: "center",
                render: (item, record) => {
                    if (record.status === "Error") {

                        return <center><Tag color="red" style={{
                            borderRadius: "20px",
                        }}>{record.status}</Tag></center>;
                    }
                    if (record.status === "Success") {
                        return <center><Tag color="green" style={{
                            borderRadius: "20px",
                        }}>{record.status}</Tag></center>;
                    }
                    if (record.status === "Generating") {
                        return <center><Tag color="orange" style={{
                            borderRadius: "20px",
                        }}>{record.status}</Tag></center>;
                    }
                    return <center><Tag color="orange" style={{
                        borderRadius: "20px",
                    }}>{record.status}</Tag></center>;
                },
            }, {
                title: "Actions",
                key: "export",
                dataIndex: 'export',
                align: "center",
                render: (item, record) => {
                    if (record.status === "Success") {
                        return <div align="right">
                            <span>
                                <span id="grid" onClick={() => this.loadZipFile(record)}>
                            <ExportOutlined/>
                            </span>
                                {/*<CSVLink data={data}></CSVLink>*/}
                                <Divider type="vertical"/>
                            <Popconfirm
                                title="Are you sure to delete this?"
                                onConfirm={() => this.deleteObject(record)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <a><DeleteOutlined/></a>
                            </Popconfirm>
                            </span>
                        </div>;
                    }
                    return <div align="right"><span>
                        <Divider type="vertical"/>
                        <Popconfirm
                            title="Are you sure to delete this?"
                            onConfirm={() => this.deleteObject(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <a><DeleteOutlined/></a>
                        </Popconfirm>
                    </span></div>
                }
            }
        ];
        const subColumns = [
            {
                title: "Site Name",
                key: "sitename",
                dataIndex: 'name',
                width: 100,
                responsive: ['md'],
                align: "center",
                render: (item, record) => record.name,
            }, {
                title: "Report Type",
                key: "report_type",
                dataIndex: 'report_type',
                align: "center",
                render: (item, record) => <span>Site Analysis</span>,
            }, {
                title: "Site Report Status",
                key: "site_report_status",
                dataIndex: 'site_report_status',
                align: "center",
                render: (item, record) => <center><Tag color="green" style={{
                    borderRadius: "20px",
                }}>success</Tag></center>
            }, {
                title: "Failure Error",
                key: "failure_error",
                dataIndex: 'failure_error',
                align: "center",
                render: (item, record) => <a>-</a>,
            }
        ];

        const data = [
            {
                key: 1,
                name: "cln bs gen",
                from: "27/05/2022 00:00:00",
                to: "27/05/2022 23:59:59",
                frequency: "daily"
            },
            {
                key: 2,
                name: "cleaning",
                from: "27/05/2022 00:00:00",
                to: "27/05/2022 23:59:59",
                frequency: "daily"
            }
        ];

        const expandedRow = row => {

            return <Table rowClassName={() => "rowClassName1"} columns={subColumns} dataSource={this.deviceData}
                          pagination={false}
                          style={{fontSize: 4}}/>;
        };

        return (<div style={{fontFamily: "Open Sans Reguler"}}>

                <div style={{fontWeight: 'bold', fontSize: 24}}>
                    <span>Reports</span>
                </div>
                <Row>
                    <Col span={18}>
                    </Col>
                    <Col span={5}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            style={{backgroundColor: "black", border: "none", borderRadius: "5px"}}>
                                <Menu.Item key={'/report-form'} icon={<DownloadOutlined/>}>
                                    <Link to={'/report-form'}>Generate Report</Link>
                                </Menu.Item>
                        </Menu>
                    </Col>
                </Row>
                <div style={{display: 'block'}}>
                    <br/>
                    <Search placeholder="Search report here" onChange={(e) => this.searchString(e.target.value)}/>
                    <br/>
                    <br/>
                    <Table columns={columns} loading={loading} dataSource={reportsData} pagination={false}
                           size='small' onChange={this.handleChange} scroll={{x: 1300}}/>
                    <InfiniteFeedLoaderButton
                        loaderFunction={() => this.loadReports(this.state.nextPage)}
                        hidden={!this.state.nextPage}
                    />
                </div>
            </div>
        );
    }
}

export default Reports;