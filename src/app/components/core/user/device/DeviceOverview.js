import React from 'react';
import {Card, Col, DatePicker, Divider, Popconfirm, Row, Space, Spin, Table, Tag} from "antd";
import {getAPI, postAPI} from "../../../../utils/apiRequest";
import {DE_GRAPH_DATA, OAP_GRAPH_DATA, LOCATION_DEVICE} from "../../../../constants/api";
import moment from "moment";
import ApexCharts from 'apexcharts';

const {RangePicker} = DatePicker;

class DeviceOverview extends React.Component {
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
        this.loadDEGraphData();
        this.loadOAPGraphData();
        this.setState({
            deviceName: this.props.match.params.deviceName
        })
    }

    loadDEGraphData(page = 1) {
        let that = this;
        let from_date = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') :
            moment().format('YYYY-MM-DD')
        let to_date = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') :
            moment().format('YYYY-MM-DD')
        this.setState({
            loading: true
        });
        let reqData = {
            device: that.props.match.params.deviceId
        }
        let successFn = function (data) {

            let options = {
                series: [{
                    name: 'E-Today(kw)',
                    data: data.y_axis
                }],
                chart: {
                    type: 'area',
                    stacked: false,
                    height: 350,
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    },
                    toolbar: {
                        autoSelected: 'zoom'
                    }
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 0,
                },
                title: {
                    text: 'Daily Energy vs Time',
                    align: 'left'
                },
                noData: {
                    text: "No data found on the selected range [" + from_date + " to " + to_date + "]",
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '14px',
                        fontFamily: undefined
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 90, 100]
                    },
                },
                yaxis: {
                    title: {
                        text: 'Daily Energy (kw)'
                    },
                },
                xaxis: {
                    title: {
                        text: 'Time'
                    },
                    labels: {
                        datetimeUTC: false,
                        format: 'dd/MMM H:mm',
                    },
                    type: 'datetime',
                    categories: data.x_axis
                },
                tooltip: {
                    shared: true,
                    x: {
                        show: true,
                        format: 'dd/MMM/yyyy H:mm',
                        formatter: undefined,
                    }
                }
            };

            let chart = new ApexCharts(document.querySelector("#daily-energy"), options);
            chart.render();

            that.setState({
                loading: false,
            })

        }
        let errorFn = function () {
            that.setState({
                loading: false
            });
        }
        let params = {
            ...page,
            device: that.props.match.params.deviceId,
            from_date: this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD'),
            to_date: this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD'),
            action_taken: true,
        }
        console.log(params)
        getAPI(DE_GRAPH_DATA, successFn, errorFn, params)
    }

    loadOAPGraphData(page = 1) {
        let that = this;
        let from_date = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') :
            moment().format('YYYY-MM-DD')
        let to_date = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') :
            moment().format('YYYY-MM-DD')
        this.setState({
            loading: true
        });
        let reqData = {
            device: that.props.match.params.deviceId
        }
        let successFn = function (data) {

            let options = {
                series: [{
                    name: 'OAP(kw)',
                    data: data.y_axis
                }],
                chart: {
                    type: 'area',
                    stacked: false,
                    height: 350,
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    },
                    toolbar: {
                        autoSelected: 'zoom'
                    }
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 0,
                },
                title: {
                    text: 'OAP vs Time',
                    align: 'left'
                },
                noData: {
                    text: "No data found on the selected range [" + from_date + " to " + to_date + "]",
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '14px',
                        fontFamily: undefined
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 90, 100]
                    },
                },
                yaxis: {
                    title: {
                        text: 'o/p Active Power(kw)'
                    },
                },
                xaxis: {
                    title: {
                        text: 'Time'
                    },
                    labels: {
                        datetimeUTC: false,
                        format: 'dd/MMM H:mm',
                    },
                    type: 'datetime',
                    categories: data.x_axis
                },
                tooltip: {
                    shared: true,
                    x: {
                        show: true,
                        format: 'dd/MMM/yyyy H:mm',
                        formatter: undefined,
                    }
                }
            };

            let chart = new ApexCharts(document.querySelector("#oap"), options);
            chart.render();

            that.setState({
                loading: false,
            })

        }
        let errorFn = function () {
            that.setState({
                loading: false
            });
        }
        let params = {
            ...page,
            device: that.props.match.params.deviceId,
            from_date: this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD'),
            to_date: this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD'),
            action_taken: true,
        }
        console.log(params)
        getAPI(OAP_GRAPH_DATA, successFn, errorFn, params)
    }

    onChangeDateRange = (dates, dateStrings) => {
        let that = this
        that.setState({
            startDate: dates && dates[0],
            endDate: dates && dates[1]
        }, function () {
            that.loadDEGraphData()
            that.loadOAPGraphData()
        })
    }

    render() {
        const {loading, deviceData, deviceName} = this.state;
        const dateFormat = 'YYYY/MM/DD';
        return (<div style={{minHeight: 100}}>
            <div><br/></div>
            <div style={{fontWeight: 'bold', fontSize: 24}}>
                <span>{deviceName}</span>
            </div>
            <br/>
            <Row>
                <Col span={22}>
                    <RangePicker
                        allowClear={true}
                        format={dateFormat}
                        onChange={this.onChangeDateRange}
                    />
                </Col>
                <Col span={2}>
                </Col>
            </Row>
            <br/>
            <Spin spinning={loading}>
                <div id="daily-energy">

                </div>
            </Spin>
            <Spin spinning={loading}>
                <div id="oap">

                </div>
            </Spin>
        </div>);
    }
}

export default DeviceOverview;