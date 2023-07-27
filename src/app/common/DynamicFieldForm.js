import React from "react";
import {Button, Checkbox, DatePicker, Form, Upload, Input, InputNumber, Radio, Select, Tag, message} from "antd";
import moment from "moment";
import {REQUIRED_FIELD_MESSAGE} from "../../constants/message";
import {
    CHECKBOX_FIELD,
    CITY_FIELD,
    COLOR_PICKER,
    COUNTRY_FIELD,
    DATE_PICKER,
    DATE_TIME_PICKER,
    DIVIDER_FIELD,
    EMAIL_FIELD, ERROR_MSG_TYPE,
    INPUT_FIELD, LABEL_FIELD,
    MAIL_TEMPLATE_FIELD,
    MULTI_IMAGE_UPLOAD_FIELD,
    MULTI_SELECT_FIELD,
    NUMBER_FIELD,
    PASSWORD_FIELD,
    QUILL_TEXT_FIELD,
    RADIO_FIELD, RATE_FIELD, SEARCH_FIELD,
    SELECT_FIELD,
    SINGLE_CHECKBOX_FIELD,
    SINGLE_IMAGE_UPLOAD_FIELD,
    SMS_FIELD,
    STATE_FIELD,
    SUCCESS_MSG_TYPE,
    TEXT_FIELD,
    TIME_PICKER, FRAME_VIEW, FORM_POST_ACTION, FORM_PUT_ACTION
} from "../../constants/dataKeys";
import {displayMessage, makeURL} from "../../utils/common";
import {getAuthToken, postAPI, putAPI} from "../../utils/apiRequest";
import RouteContext from "../../RouteContext";
import {UploadOutlined} from "@ant-design/icons";
import {FILE_UPLOAD} from "../../constants/api";
import {Editor} from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DynamicSettingsDrawerForm from "../modules/hr/settings/dynamic/DynamicSettingsDrawerForm";
import {_get} from "../../utils/lodashUtils";
import {globalDynamicSettingsDrawerVisible} from "../../redux/actions/globalReducActions";
import {connect} from "react-redux";

const {TextArea} = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class DynamicFieldForm extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            fields: this.props.fields,
            formErrors: {},
            editorState: {},
            fileList: [],
            addNewDynamicSettingFormField: {}
        }
    }

    onReset = () => {
        this.formRef.current.resetFields();
    }

    onFinishMethod = values => {
        let that = this;
        let reqData = {...values};
        if (this.props.onFinish) {
            this.props.onFinish(values, that.formRef);
            return true;
        }
        if (this.props.onFinishProps) {
            if (this.props.onFinishProps.defaultValues) {
                this.props.onFinishProps.defaultValues.forEach(function (field) {
                    reqData[field.name] = field.value
                });
            }
            if (that.props.onFinishProps.beforeSend) {
                reqData = that.props.onFinishProps.beforeSend(reqData, values);
            }
            that.state.fields.forEach(function (formFields) {
                if (formFields.type == TIME_PICKER || formFields.type == DATE_PICKER || formFields.type == DATE_TIME_PICKER) {
                    const {name} = formFields;
                    if (formFields.format) {
                        reqData[name] = moment(values[name], formFields.format).isValid() ? moment(values[name]).format(formFields.format) : null;
                    }
                } else if (formFields.type == SINGLE_IMAGE_UPLOAD_FIELD) {
                    const {name} = formFields;
                    if (values[name] && values[name].file && values[name].file.response)
                        reqData[name] = values[name].file.response.image_path;
                    else
                        reqData[name] = formFields.initialValue;

                } else if (formFields.type == QUILL_TEXT_FIELD) {
                    const {name} = formFields;
                    reqData[name] = that.state.editorState[name] ? draftToHtml(convertToRaw(that.state.editorState[name].getCurrentContent())) : formFields.initialValue;
                }

            })
            let successFn = function (data) {
                that.formRef.current.resetFields();
                if (that.props.onFinishProps.successFn)
                    that.props.onFinishProps.successFn(data);
            }
            let errorFn = function (error) {
                that.handleBackendErrors(error);
                if (that.props.onFinishProps.errorFn)
                    that.props.onFinishProps.errorFn(error);
            }
            if (this.props.onFinishProps.type == FORM_POST_ACTION) {
                postAPI(this.props.onFinishProps.action, reqData, successFn, errorFn)
            } else if (this.props.onFinishProps.type == FORM_PUT_ACTION) {
                putAPI(this.props.onFinishProps.action, reqData, successFn, errorFn)
            }
        } else {
            displayMessage(ERROR_MSG_TYPE, "Submit Methods are not available!");
        }
    };
    handleBackendErrors = (errors) => {
        if (this.state.fields) {
            let errorsMessages = {};
            this.state.fields.forEach(function (field) {
                if (errors[field.name] && errors[field.name].length) {
                    errorsMessages[field.name] = errors[field.name][0];
                }
            });
            this.setState({
                formErrors: errorsMessages
            })
        }
    }

    addSMSTag = (name, value) => {
        const that = this;
        const {setFieldsValue, getFieldValue} = that.formRef.current;
        const prevValue = getFieldValue(name) || '';
        setFieldsValue({
            [name]: prevValue + value
        });
    }

    onEditorStateChange = (name, editorState) => {
        this.setState(function (prevState) {
            return {
                editorState: {...prevState.editorState, [name]: editorState}

            }
        });
    };
    handleSingleFileUpload = (info) => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        if (info.file.status !== "uploading") {
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
        fileList = fileList.map(file => {
            if (file.response) {
                file.url = file.response.url;
                file.name = file.name.slice(0, 22) + (file.name.length > 22 ? "..." : "");
            }
            return file;
        });

        this.setState({fileList});

    }
    handleSelectAll = (field) => {
        let that = this
        const {setFieldsValue} = that.formRef.current;
        setFieldsValue({
            [field.name]: [...field.options.map((item) => item.value)]
        });
    }
    onClearMultipleSelect = (field) => {
        let that = this
        const {setFieldsValue, getFieldValue} = that.formRef.current;
        setFieldsValue({
            [field.name]: []
        });
    }
    handleAddNew = (addNewDynamicSettingFormField) => {
        this.props.globalDynamicSettingsDrawerVisible(addNewDynamicSettingFormField.dynamicFormAddNewTypeKey);
        this.setState({
            addNewDynamicSettingFormField
        })
    }

    render() {
        const that = this;
        const formItemLayout = (this.props.formLayout ? this.props.formLayout : {
            labelCol: {span: 8},
            wrapperCol: {span: 14},
        });
        const {formErrors, addNewDynamicSettingFormField} = this.state;
        const {dynamicSettingsFormDrawerVisible} = this.props;
        return <>
            <Form {...formItemLayout}
                  ref={this.formRef}
                  onFinish={this.props.onFinish ? this.props.onFinish : this.onFinishMethod}
                  validateMessages={validateMessages}
                  scrollToFirstError={true}
                  initialValues={{..._get(this.props, 'initialValues', {})}}
            >
                {this.props.title ? <h2>{this.props.title}</h2> : null}
                {this.state.fields ? this.state.fields.map(function (field) {
                    switch (field.type) {
                        case LABEL_FIELD:
                            return <Form.Item {...field} rules={[{required: field.required}]} key={field.name}
                                              help={formErrors[field.name]}
                                              {...(formErrors[field.name] ? {validateStatus: "error"} : null)}>
                                {field.follow}
                                <span className="ant-form-text">{field.value}</span>
                            </Form.Item>
                        case INPUT_FIELD:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}
                                             help={formErrors[field.name]}
                                             {...(formErrors[field.name] ? {validateStatus: "error"} : null)}>
                                <Input disabled={field.disabled} placeholder={field.placeholder}
                                       showCount={field.showCount}
                                       max={field.maxLength}/>
                            </FormItem>
                        case PASSWORD_FIELD:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}>
                                <Input.Password disabled={field.disabled} placeholder={field.placeholder}/>
                            </FormItem>
                        case EMAIL_FIELD:
                            return <FormItem {...field} rules={[{type: 'email', required: field.required}]}
                                             key={field.name}>
                                <Input disabled={field.disabled} placeholder={field.placeholder}/>
                            </FormItem>
                        case SELECT_FIELD:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}
                                             extra={field.dynamicFormAddNewTypeKey ? <span>
                                                 <Button type={'link'} size={'small'}
                                                         onClick={() => that.handleAddNew(field)}>Add
                                                     New</Button> </span> : null}>
                                <Select
                                    placeholder={field.placeholder}
                                    disabled={field.disabled ? field.disabled : that.state.disabled}
                                    mode={field.mode ? field.mode : "default"}
                                    optionFilterProp="children"
                                    showSearch>
                                    {field.options.map((option) => (
                                        <Select.Option
                                            label={option.label}
                                            value={option.value}
                                        >{option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </FormItem>
                        case MULTI_SELECT_FIELD:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}
                                             extra={<span>
                                                        {field.allowAdd ? <Button type={'link'} size={'small'}
                                                                                  onClick={() => that.handleAddNew(field)}>Add
                                                            New</Button> : null}
                                                 <Button type={'link'} size={'small'}
                                                         onClick={() => that.handleSelectAll(field)}>Select All</Button>
                                                            <Button type={'link'} size={'small'}
                                                                    onClick={() => that.onClearMultipleSelect(field)}>Clear All</Button>
                                                            </span>}
                            >
                                <Select
                                    allowClear
                                    mode="multiple"
                                    placeholder={field.placeholder}
                                    showSearch={field.showSearch ? field.showSearch : null}
                                    disabled={field.disabled ? field.disabled : that.state.disabled}
                                    optionFilterProp="label"
                                    // onChange={(value) => that.handleSelectAll(value, field)}
                                    // onClear={() => that.onClearMultipleSelect(field)}
                                >
                                    {/*<Select.Option key="ALL" value="ALL">ALL</Select.Option>*/}

                                    {field.options.map((option) => (
                                        <Select.Option
                                            label={option.label}
                                            value={option.value}
                                        >{option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </FormItem>
                        case RADIO_FIELD:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}>
                                <RadioGroup
                                    disabled={field.disabled ? field.disabled : that.state.disabled}
                                >
                                    {field.options.map((option) => (
                                        <Radio
                                            value={option.value}
                                        >{option.label}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            </FormItem>
                        case CHECKBOX_FIELD:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}>
                                <CheckboxGroup
                                    options={field.options}
                                    disabled={field.disabled ? field.disabled : that.state.disabled}
                                />
                            </FormItem>
                        case SINGLE_CHECKBOX_FIELD:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}>
                                <Checkbox
                                    disabled={field.disabled ? field.disabled : that.state.disabled}
                                >{field.follow}
                                </Checkbox>
                            </FormItem>
                        case NUMBER_FIELD:
                            return <FormItem {...field} key={field.name}>
                                <FormItem {...field} rules={[{required: field.required}]} noStyle>
                                    <InputNumber
                                        style={{width: field.width}}
                                        min={field.min}
                                        max={field.max}
                                        disabled={field.disabled ? field.disabled : that.state.disabled}
                                    />
                                </FormItem>
                                {field.follow ? <span className="ant-form-text">{field.follow}</span> : null}
                            </FormItem>
                        case DATE_PICKER:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}>
                                <DatePicker format={field.format} allowClear={false} picker={field.picker}/>
                            </FormItem>
                        case DATE_TIME_PICKER:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}>
                                <DatePicker format={field.format} allowClear={false} showTime/>
                            </FormItem>
                        case TEXT_FIELD:
                            return <FormItem {...field} rules={[{required: field.required}]} key={field.name}>
                                <TextArea
                                    autosize={{minRows: field.minRows, maxRows: field.maxRows}}
                                    showCount={field.showCount}
                                    maxLength={field.maxLength}
                                    placeholder={field.placeholder}
                                    disabled={field.disabled ? field.disabled : that.state.disabled}
                                />
                            </FormItem>
                        case SMS_FIELD:
                            return <FormItem {...field} key={field.name}>
                                <FormItem {...field} rules={[{required: field.required}]} noStyle>
                                    <TextArea
                                        autosize={{minRows: field.minRows, maxRows: field.maxRows}}
                                        placeholder={field.placeholder}
                                        disabled={field.disabled ? field.disabled : that.state.disabled}
                                    />
                                </FormItem>
                                {field.options && field.options.map(item => (
                                    <Tag
                                        color="#108ee9"
                                        onClick={() => that.addSMSTag(field.name, item.value)}
                                    >{item.label}
                                    </Tag>
                                ))}
                            </FormItem>
                        case SINGLE_IMAGE_UPLOAD_FIELD:
                            const singleUploadprops = {
                                name: "image",
                                data: {
                                    name: "hello",
                                },
                                listType: "picture",
                                action: makeURL(FILE_UPLOAD),
                                headers: {
                                    Authorization: getAuthToken() ? `Token ${getAuthToken()}` : undefined,
                                },
                                onChange: that.handleSingleFileUpload,
                                // onChange(info) {
                                //     if (info.file.status !== "uploading") {
                                //     }
                                //     if (info.file.status === "done") {
                                //         message.success(`${info.file.name} file uploaded successfully`);
                                //     } else if (info.file.status === "error") {
                                //         message.error(`${info.file.name} file upload failed.`);
                                //     }
                                // },
                            };
                            return <Form.Item  {...field} rules={[{required: field.required}]} key={field.name}>
                                <Upload {...singleUploadprops} fileList={that.state.fileList} accept={field.accept}>
                                    <Button>
                                        <UploadOutlined/> Click to upload
                                    </Button>
                                </Upload>
                            </Form.Item>
                        case QUILL_TEXT_FIELD:
                            return <Form.Item {...field} key={field.name}>
                                <div style={{border: '1px solid #eee'}}>
                                    <Editor
                                        editorState={(that.state.editorState[field.name] ? that.state.editorState[field.name] : (field.initialValue ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(field.initialValue))) : EditorState.createEmpty()))}
                                        onEditorStateChange={(editorState) => that.onEditorStateChange(field.name, editorState)}
                                    />
                                </div>
                            </Form.Item>
                        default:
                            return null;
                    }
                }) : null}
                <FormItem {...{...formItemLayout, wrapperCol: {offset: 8, span: 16}}}>
                    <Button
                        loading={that.state.loading}
                        type="primary"
                        htmlType="submit"
                        style={{margin: 5}}>
                        Submit
                    </Button>
                    <RouteContext.Consumer>
                        {context => {
                            if (context === undefined) {
                                return null;
                            }
                            return <Button style={{margin: 5}} onClick={context.history.goBack}>
                                Cancel
                            </Button>
                        }}
                    </RouteContext.Consumer>
                    <Button htmlType="button" type="link" style={{margin: 5}} onClick={this.onReset}>
                        Reset
                    </Button>
                </FormItem>
            </Form>
            <DynamicSettingsDrawerForm key={_get(dynamicSettingsFormDrawerVisible, 'name')}
                                       onSuccess={addNewDynamicSettingFormField.onSuccessAdd}/>
        </>
    }
}

const validateMessages =
    {
        required: REQUIRED_FIELD_MESSAGE,
    }

const mapStateToProps = (state) => {
        return {
            dynamicSettingsFormDrawerVisible: _get(state, 'global.dynamicSettingsFormDrawerVisible'),
        };
    }
;
const mapDispatchToProps =
    {
        globalDynamicSettingsDrawerVisible,
    }
;
export default connect(mapStateToProps, mapDispatchToProps)(DynamicFieldForm);
