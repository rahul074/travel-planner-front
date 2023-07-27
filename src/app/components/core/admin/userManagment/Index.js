import React, {Component} from 'react';
import {Card, Tabs} from 'antd'
import FormUser from "./FormUser";
import ViewUsers from "./ViewUsers";
import {Content} from "antd/es/layout/layout";

const {TabPane} = Tabs;

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'add-user',
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
                <h2>Users</h2>
                <Card>
                    <Tabs onChange={this.onSelectTab} activeKey={this.state.selectedTab}>
                        <TabPane tab="Add user" key="add-user">
                            {this.state.selectedTab === 'add-user' ?
                                <FormUser key={'add-user'}
                                          editData={this.state.editData}
                                          onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                        <TabPane tab="View Users" key="view-users">
                            {this.state.selectedTab === 'view-users' ?
                                <ViewUsers onSelectTab={this.onSelectTab} {...this.props}/>
                                : null}
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        );
    }
}

export default Users;
