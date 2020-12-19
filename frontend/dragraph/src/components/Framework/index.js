import React, { Component } from 'react'
import { Menu, Layout, Breadcrumb, Row } from "antd"
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { v1 as uuid } from "uuid"
import { Detail } from "../../components"
import logo from "../../favicon.ico"
import Axios from 'axios';
// console.log(logo)
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default class index extends Component {

    drawMenus = (toolData) => {
        let res = toolData.map((compData) => {
            // console.log(compData.children)
            // 一个组件
            if (compData.children === undefined) {
                // console.log("comp", compData)
                return <Menu.Item key={uuid()} onClick={() => {
                    if (typeof compData.onclick === "function") {
                        compData.onclick(compData, this.props.graph)
                    }
                }}>{compData.name}</Menu.Item>
            } else {  // 一个菜单
                // console.log("submenu", compData)
                return <SubMenu title={compData.name} key={uuid()}>
                    {
                        this.drawMenus(compData.children)
                    }
                </SubMenu>
            }
        })
        return res
    }

    handleSave = (e) => {
        let data = this.props.data.graph.save()
        console.log(data)
        Axios.post("/edit", {
            uuid:"产品id",
            data:data
        })
            .then((res) => {
                console.log(res)
            })
    }

    render() {
        console.log(this.props)
        return (
            <Layout style={{ height: "100%" }}>
                <Header className="header">
                    <Row>
                        <div className="logo" >
                            <img src={logo}>
                            </img>
                        </div>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} selectedKeys={[""]}>
                            <Menu.Item key="2" onClick={this.props.changeMode}>{
                                this.props.data.beginLink ?
                                    <div>加点模式</div> :
                                    <div>连线模式</div>
                            }</Menu.Item>
                            <Menu.Item key="save" onClick={this.handleSave}>保存模型</Menu.Item>
                            <Menu.Item >
                                <span data-command="undo"> 撤销</span>
                            </Menu.Item>
                        </Menu>
                    </Row>
                </Header>
                <Layout>
                    <Sider width={220} className="site-layout-background" theme="light" style={{ overflow: "hidden" }}>
                        <div style={{ overflow: "scroll", height: "102.5%", width: 240 }}>
                            <Menu
                                mode="inline"
                                selectable={false}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%', borderRight: 0 }}
                            >
                                <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                                    <Menu.Item key="1" onClick={() => {
                                        const model = {
                                            id: uuid(),
                                            label: 'node',
                                            address: 'cq',
                                            x: 200,
                                            y: 150,
                                            style: {
                                                fill: 'blue',
                                            },
                                        };
                                        this.props.graph.addItem('node', model)
                                    }}>option1</Menu.Item>
                                    <Menu.Item key="2" onClick={() => {
                                    }}>option2</Menu.Item>
                                    {/* key可以把数据传给下面 */}
                                    <Menu.Item key="3" data={"abc"} onClick={(a) => {
                                        console.log(a, a.key)
                                    }}>option3</Menu.Item>
                                    <Menu.Item key="4">option4</Menu.Item>
                                </SubMenu>


                                {this.drawMenus(this.props.data.toolData)}

                            </Menu>
                        </div>
                    </Sider>
                    <Layout>
                        {/* <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                            ref={this.props.graphConRef}
                        >
                            {this.props.children}
                        </Content>
                        <Sider width={200} className="site-layout-background" theme="light">
                            <Detail {...this.props}></Detail>
                        </Sider>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
