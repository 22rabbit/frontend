import React, { Component, createRef } from 'react'
import ReactDOM from "react-dom"
// import G6 from '@antv/g6';

export default class Maingraph extends Component {
    constructor() {
        super()
        // this.ref = createRef()
        this.state = {}

    }
    // componentDidMount() {
    //     console.log(this.ref.current)
    //     const graph = new G6.Graph({
    //         container: ReactDOM.findDOMNode(this.ref.current), // 指定图画布的容器 id，与第 9 行的容器对应
    //         // 画布宽高
    //         width: 800,
    //         height: 500,
    //     });
    //     // 读取数据
    //     graph.data(this.props.data);
    //     // 渲染图
    //     graph.render();


    // }
    render() {
        return (
            // <G6.Graph></G6.Graph>
            <div ref={this.props.dom} style={{width:"100%",height:"100%"}}></div>
        )
    }
}
