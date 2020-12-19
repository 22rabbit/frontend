import React from "react"
import {render} from "react-dom"

import App from "./App"
import "antd/dist/antd.less"
import "./index.less"

render(
    <App></App>,
    document.querySelector("#root")
)