import React, {Component} from 'react';
import {Card, Tabs} from 'antd'
import ViewDevice from "./ViewDevice";
import {Content} from "antd/es/layout/layout";
import AddOrEditDevice from "./AddOrEditDevice";

const {TabPane} = Tabs;

class Device extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'add-device',
            editData: null
        }
    }

    onSelectTab = (option, extra = null) => {
        this.setState({
            selectedTab: option,
            editData: extra
        })
    }

    render() {
        const {noPadding} = this.props;
        return (
            <Content
                style={{
                    padding: noPadding ? 0 : 10,
                    height: `calc(100vh - 65px)`,
                    overflow:'auto'
                }}>
                <h3>My Devices</h3>
                <Card>
                    <Tabs onChange={this.onSelectTab} activeKey={this.state.selectedTab}>
                        <TabPane tab="Add Device" key="add-device">
                            {this.state.selectedTab === 'add-device' ?
                                <AddOrEditDevice key={'add-device'}
                                            editData={this.state.editData}
                                            onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                        <TabPane tab="View Devices" key="view-device">
                            {this.state.selectedTab === 'view-device' ?
                                <ViewDevice onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        );
    }
}

export default Device;
