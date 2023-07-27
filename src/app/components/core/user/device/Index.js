import React, {Component} from 'react';
import {Card, Tabs} from 'antd'
import {Content} from "antd/es/layout/layout";
import DeviceOverview from "./DeviceOverview";
import DeviceDetails from "./DeviceDetails";

const {TabPane} = Tabs;

class DeviceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'device-overview',
            editData: null,
            deviceName:null
        }
    }

    onSelectTab = (option, extra = null) => {
        this.setState({
            selectedTab: option,
            editData: extra,
            deviceName: this.props.match.params.deviceName
        })
    }

    render() {
        const {noPadding, deviceName} = this.props;
        return (
            <Content
                style={{
                    padding: noPadding ? 0 : 10,
                    height: `calc(100vh - 65px)`,
                    overflow:'auto'
                }}>
                {/*<h3>{{deviceName}}</h3>*/}
                <Card>
                    <Tabs onChange={this.onSelectTab} activeKey={this.state.selectedTab}>
                        <TabPane tab="Device Overview" key="device-overview">
                            {this.state.selectedTab === 'device-overview' ?
                                <DeviceOverview key={'device-overview'}
                                            editData={this.state.editData}
                                            onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                        <TabPane tab="Device Details" key="device-details">
                            {this.state.selectedTab === 'device-details' ?
                                <DeviceDetails onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        );
    }
}

export default DeviceTab;
