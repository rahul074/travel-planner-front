import React from "react";
import {Button, Col, Result, Row} from "antd";
import {Link} from "react-router-dom";
import AppBase from "../../base/AppBase";

class Error404 extends React.Component {
    render() {
        return (
            <AppBase noBreadcrumb={true}>
                <Row style={{marginTop: '20px', textAlign: 'center'}} gutter={24}>
                    <Col span={24}>
                        <Result
                            status="404"
                            title={
                                <span>
                                    <h1><b>404</b></h1>
                                    <h2>Page Not Found</h2>
                            </span>
                            }
                            subTitle="The page you are looking for has been temporarily moved or did not exist."
                            extra={<Link to="/"><Button type="primary">Go to Home</Button></Link>}
                        />
                    </Col>
                </Row>
            </AppBase>
        )
    }
}

export default Error404;
