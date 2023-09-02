import React, {Component} from 'react';
import {Card, Tabs} from 'antd'
import ViewSearches from "./ViewSearches";
import {Content} from "antd/es/layout/layout";
import AddOrEditDevice from "./AddOrEditSearches";

const {TabPane} = Tabs;

class Searches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'view-searches',
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
                <h3>User Searches</h3>
                <Card>
                    <Tabs onChange={this.onSelectTab} activeKey={this.state.selectedTab}>
                        {/*<TabPane tab="Add Searches" key="add-searches">*/}
                        {/*    {this.state.selectedTab === 'add-searches' ?*/}
                        {/*        <AddOrEditDevice key={'add-searches'}*/}
                        {/*                    editData={this.state.editData}*/}
                        {/*                    onSelectTab={this.onSelectTab} {...this.props}/>*/}
                        {/*        : null}*/}
                        {/*</TabPane>*/}
                        <TabPane tab="View Searches" key="view-searches">
                            {this.state.selectedTab === 'view-searches' ?
                                <ViewSearches onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        );
    }
}

export default Searches;
