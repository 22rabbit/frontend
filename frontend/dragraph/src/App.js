import React, { Component, createRef } from 'react'
import ReactDOM from "react-dom"
// import { findNodeHandle, UIManager } from "react-native"

import { Framework, Maingraph } from "./components"
import G6 from '@antv/g6';
import { Button, Spin } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { v1 as uuid } from "uuid"
import hotkeys from 'hotkeys-js';

let addBoxClickCB = (data, graph) => {
    const model = {
        id: uuid(),
        label: data.name,
        size: data.size || 50,
        type: data.type || "circle",
        x: 200,
        y: 150,
        style: data.style,
        data: data
    };
    graph.addItem('node', model)
}

export default class App extends Component {
    constructor() {
        super()


        this.state = {
            beginLink: false,  // 是连线模式还是加点模式
            graph: "",
            currentID: "",
            beginLink: false,
            // params,记录每个图元的可变参数
            params: {
                "比例缩放": [
                    {
                        name: '比例系数',
                        type: 'number',  // 直接输入文字，用input框
                        default: 0.7,
                        datas:{
                            step:0.1,
                            min:0,
                            max:2
                        }
                    }
                ],
                'DHT11温湿度传感器': [
                    {
                        name: "数据类型",
                        type: "radio",
                        datas: [
                            {
                                name: "温度",
                                val: "tmp"
                            },
                            {
                                name: "湿度",
                                val: "humi"
                            }
                        ],
                        

                    },
                    {
                        name:"数据精度",
                        type:"select",
                        datas:[
                            {
                                name:"float",
                                val:"float"
                            },{
                                name:"double",
                                val:"double"
                            }
                        ],
                        props:{
                            placeholder:"选择数据精度"
                        }
                    }
                ],
                '自定义处理函数': [
                    {
                        name: "函数体",
                        type: "text",
                        tip: "输入以x为自变量的单值显式函数",
                        default: "x*2"
                    }
                ],
                '透传': [
                    {
                        name: "服务器IP",
                        type: "text",
                        default: "0.0.0.0"
                    }, {
                        name: "服务器端口",
                        type: "text"
                    }
                ],
                'NB-Iot': [
                    {
                        name: "ProductKey",
                        type: "text"
                    }, {
                        name: "ProductSecret",
                        type: "text"
                    },
                    
                ]

            },
            // 用来渲染工具栏的
            toolData: [
                {
                    name: '输入模块',
                    children: [
                        {
                            name: 'DHT11温湿度传感器',  // name将作为text进入data中,text作为小框显示内容,可被改变
                            onclick: addBoxClickCB,
                            type: "rect",
                            size: [120, 50],
                            style: {

                            }
                        }, {
                            name: '电压传感器',
                            onclick: addBoxClickCB,
                        }
                    ]
                },
                {
                    name: "数据处理",
                    children: [
                        {
                            name: "比例缩放",
                            onclick: addBoxClickCB,
                        },
                        {
                            name: "乘2",
                            onclick: addBoxClickCB,
                        }, {
                            name: "除二",
                            onclick: addBoxClickCB,
                        }, {
                            name: "自定义处理函数",
                            onclick: addBoxClickCB,
                        }
                    ]
                },
                {
                    name: '上传模块',
                    img: 'img/a.jpg',
                    children: [
                        {
                            name: '透传',
                            onclick: addBoxClickCB,

                        }, {
                            name: 'NB-Iot',
                            onclick: addBoxClickCB,
                        }
                    ]
                }
            ],
            loading: true
        }
        this.graphDOM = createRef()
        this.toolBarRef = createRef()
        this.graphConRef = createRef()
    }

    // 在连线模式和普通模式间互换
    changeMode = () => {
        this.setState({
            beginLink: !this.state.beginLink
        })
    }
    drawGraph = () => {
        const toolbar = new G6.ToolBar({
            container: this.toolBarRef.current,
        });
        this.toolbar = toolbar
        const minimap = new G6.Minimap()
        // 建立graph
        this.setState({
            graph: new G6.Graph({
                plugins: [toolbar],
                container: ReactDOM.findDOMNode(this.graphDOM.current),
                width: this.graphDOM.current.offsetWidth,
                height: this.graphDOM.current.offsetHeight,
                modes: {
                    default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
                },

                nodeStateStyles: {
                    click: {
                        fill: '#d3adf7',
                        // name 为 shape-name1 的子图形在该状态值下的样式
                        'node-label': {
                            fontSize: 15
                        },
                    },
                },
                enabledStack: true
            }),
            loading: false
        }, () => {
            // 点击点时
            this.state.graph.on('node:click', (e) => {
                this.lastid = this.state.currentID
                console.log(this.lastid)
                let graph = this.state.graph
                // 先将所有当前是 click 状态的节点置为非 click 状态
                const clickNodes = graph.findAllByState('node', 'click');
                clickNodes.forEach((cn) => {
                    graph.setItemState(cn, 'click', false);
                });
                const nodeItem = e.item; // 获取被点击的节点元素对象
                graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
                console.log(nodeItem)
                // 更改当前选中的id
                this.setState({
                    currentID: nodeItem._cfg.id
                }, () => {
                    // 更改好后连线
                    console.log(this.lastid, this.state.currentID)
                    if (this.lastid && this.state.currentID && this.state.beginLink) {
                        graph.addItem("edge", {
                            id: uuid(),
                            source: this.lastid,
                            target: this.state.currentID,
                            style: {
                                endArrow: true
                            }
                        })
                        this.lastid = ""
                        graph.setItemState(nodeItem, 'click', false)
                        this.setState({ currentID: "" })
                    }
                })

            });
        })
    }
    componentDidMount() {


        // console.log(toolbar)
        console.log(this.graphDOM.current.offsetWidth, this.graphDOM.current.offsetHeight)
        setTimeout(() => {
            console.log(this.graphDOM.current.offsetWidth, this.graphDOM.current.offsetHeight)
            this.drawGraph()
        }, 2000)




        hotkeys("Delete,Backspace", (e, handler) => {
            console.log(handler)
            if (this.state.graph && this.state.currentID) {
                this.state.graph.removeItem(this.state.currentID)
                this.setState({
                    currentID: ""
                })
            }
        })
        hotkeys("ctrl+z", () => {
            console.log(this.state.graph)
            console.log(this.state.graph.undoStack.linkedList.compare.compare)
            // console.log(toolbar)
            this.toolbar.undo()
        })

    }

    // handleKeyPress=(e)=>{
    // console.log(e)
    // }

    render() {
        return (
            <>
                <Framework graph={this.state.graph} data={this.state} changeMode={this.changeMode} graphConRef={this.graphConRef}>
                    <div ref={this.toolBarRef} style={{ position: "relative", display: "flex" }}></div>
                    {
                        this.state.loading ?
                            <Spin></Spin> :
                            <></>
                    }
                    <Maingraph data={{ nodes: this.state.nodes, edges: this.state.edges }} dom={this.graphDOM} ></Maingraph>
                </Framework>
            </>
        )
    }
}
