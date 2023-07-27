import React, {Component} from 'react';
import {Card, Tabs} from 'antd'
import AddOrEditLocation from "./AddOrEditLocation";
import ViewLocation from "./ViewLocation";
import AppBase from "../AppBase";
import {Content} from "antd/es/layout/layout";

const {TabPane} = Tabs;

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'add-location',
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
                    overflow: 'auto',
                }}>
                <h2>My Locations</h2>
                <Card>
                    <Tabs onChange={this.onSelectTab} activeKey={this.state.selectedTab}>
                        <TabPane tab="Location" key="add-location">
                            {this.state.selectedTab === 'add-location' ?
                                <AddOrEditLocation key={'add'}
                                                   editData={this.state.editData}
                                                   onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                        <TabPane tab="View Locations" key="view-location">
                            {this.state.selectedTab === 'view-location' ?
                                <ViewLocation onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        );
    }
}

export default Location;
