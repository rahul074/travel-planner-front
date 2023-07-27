import React from 'react'
import {Form, Input, Button, Layout} from "antd";
import {Link} from "react-router-dom";


class UserAuthForgot extends React.Component {
    render() {
        return (<Layout style={{backgroundColor:"white"}}>
            <Form
                name="basic"
                labelCol={{span: 6}}
                wrapperCol={{span: 17}}
                initialValues={{remember: true}}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Link to={'/'}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button></Link>
                </Form.Item>
            </Form>
            <Link to={'/auth/login'}>Go to login</Link>
        </Layout>);
    }
}

export default UserAuthForgot;