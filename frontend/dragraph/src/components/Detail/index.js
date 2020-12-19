import React, { Component } from 'react'
import { PageHeader, Input, Row, Col, Button, Checkbox, Form, Tooltip, Radio, Empty, InputNumber, Select } from "antd"
import Title from 'antd/lib/skeleton/Title'
import { v1 as uuid } from "uuid"
// import Form from 'antd/lib/form/Form'
import { QuestionOutlined } from "@ant-design/icons"

export default class Detail extends Component {

    constructor() {
        super()
        this.formRef = React.createRef();
        // this.form=form
        this.ok = false
    }

    // 渲染detail,输入的model是G6的模型数据
    makeDetails = (model) => {
        // console.log(data.change)
        // 建立一个keyData作为组件的可变数据
        if (!model.keyData) {
            model.keyData = {}
        }
        let keyData = model.keyData
        // this.props.data.params是工具栏数组中给每个组件的数据数组,这个应该是只读的
        if (this.props.data.params[model.data.name]) {
            // 遍历每个可变参数
            return this.props.data.params[model.data.name].map((e) => {
                let comp = "";
                let defaultVal = "";
                switch (e.type) {
                    case "text":
                        comp = <Input key={uuid()}></Input>
                        defaultVal = e.default || ""
                        break;
                    case "radio":
                        comp = <Radio.Group key={uuid()}>
                            {e.datas.map((oneRadio) => {
                                return <Radio value={oneRadio.val} key={uuid()}>
                                    {oneRadio.name}
                                </Radio>
                            })}
                        </Radio.Group>
                        defaultVal = e.default || ""
                        break;
                    case "number":
                        comp = <InputNumber key={uuid()} {...e.datas}></InputNumber>
                        defaultVal = e.default || e.datas.min
                        break;
                    case "select":
                        comp = <Select>
                            {e.datas.map((oneRadio) => {
                                return <Select.Option
                                    value={oneRadio.val}
                                    key={uuid()}
                                    
                                >
                                    {oneRadio.name}
                                </Select.Option>
                            })}
                        </Select>
                        defaultVal = e.default || ""
                        break;
                    default:
                        break;
                }

                // 将默认数据和模型已有数据同步
                console.log(keyData)
                if (keyData[e.name] !== undefined) {
                    defaultVal = keyData[e.name]
                } else {
                    keyData[e.name] = defaultVal
                }
                console.log(defaultVal)
                // if (e.tip) {
                //     comp = <Tooltip title={e.tip}>
                //         {comp}
                //     </Tooltip>
                // }
                return <Form.Item
                    label={e.name}
                    key={uuid()}
                    name={e.name}
                    initialValue={defaultVal}
                    help={e.tip}
                >
                    {comp}
                </Form.Item>
            })
        } else {
            return <Empty
                description={
                    <span>没有可调参数</span>
                }
            />
        }
    }

    componentDidMount = () => {
        console.log(123)
        if (this.formRef.current) {
            console.log(this.formRef.current)
            this.formRef.current.resetFields()
        }
    }

    componentDidUpdate = () => {
        if (this.formRef.current) {
            console.log(this.formRef.current)
            this.formRef.current.resetFields()
        }
    }

    render() {

        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };


        const onFinish = values => {
            console.log('Success:', values);
        };

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        // 防止没有graph
        if (!this.props.data.graph) {
            return <div></div>
        }
        console.log(this.props)
        let model = this.props.data.graph.findById(this.props.data.currentID)  // 这个元素的模型
        // 防止一开始id为空
        if (!model) {
            return <div></div>
        }
        let data = model._cfg.model  // 建立node时的传入参数
        console.log(data)
        this.ok = true
        return (
            <div>
                <PageHeader
                    className="组件详情"
                    title={data.data.name}
                // subTitle={this.props.data.currentID}
                />


                <Form
                    layout="vertical"
                    key={uuid()}
                    ref={this.formRef}
                    onFieldsChange={(field, allField) => {
                        console.log(field, allField)
                        field.map((e) => {
                            let key = e.name[0]
                            let val = e.value
                            data.keyData[key] = val
                            console.log(data)
                        })
                    }}
                >
                    {
                        this.makeDetails(data)
                    }

                </Form>
            </div>
        )
    }
}
