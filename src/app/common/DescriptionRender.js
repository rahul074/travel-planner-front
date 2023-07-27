import React, {Component} from 'react';
import {Typography, Popover, Button, Row, Col} from "antd";

const {Paragraph, Text} = Typography;

class DescriptionRender extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    TruncateString = (longString, size) => {
        if (longString && longString.length > size) {
            return (<Paragraph>
                {longString.substring(0, size)}
                <Popover content={<Paragraph>{longString}</Paragraph>
                } trigger={["click"]}>
                    <Button type={'link'} style={{padding: 0}}> ...more</Button>
                </Popover>
            </Paragraph>)
        }
        return (<Paragraph>
            {longString}
        </Paragraph>)
    }

    render() {
        let that = this;
        const {text} = that.props
        return (<div>
            {that.TruncateString(text, 100)}
        </div>);
    }
}

export default DescriptionRender;
