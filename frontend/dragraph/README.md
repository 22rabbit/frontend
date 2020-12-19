# 拖拽式图构建工具

## 工具栏文档

### 对象`tooldata`

#### 工具栏元素对象
用来渲染工具栏
```json5
{
    "name":"<string>这个按钮的标题，如果是用来生成模块的按钮，这个name也会被作为模块的name",
    "children":["<JSON>其他的工具栏元素对象，作为这个父菜单的子菜单",...],
    // 以下几项为不包含child时的选项
    "type":"<string>这个按钮的形状，如果为可以填rect或circle，默认circle",
    "size":"生成的模块尺寸，如type为rect，这里是一个数组[长，宽]
            如果type为circle,这里为一个数表示直径",
    "style":"元素的附加style，详见G6文档",
    "onclick":"<如果是自定义函数，就填函数字符串，如果是默认的在图中加点，请填写addBoxClickCB>",
}
```

#### 可变参数对象
设定每种对象具有的可变参数
```json5
{
    "<string>有可变参数的元素的name":"<数组，数组每一位表示一种可变参数,是一个json，详见下表>",
    ...
}
```

下表：
|键    |必须|默认值|描述|
|----|----|----|-----|
|name|是|无|这个可变参数的名字，也会被作为它的键|
|type|是|无|可变参数的种类，可以是number、select、test、radio|
|default|否|空字符串或0|
|datas|对于text不需要，其他类型必须|略|详见相应type的datas表|

##### type：number
datas为json
```json5
{
    "step":"<number>数据精度",
    "min":"<number>最小值",
    "max":"<number>最大值"
}

##### type:select或radio

datas为数组
```json5
[
    {
        "name":"这个选项的标题",
        "val":"这个选项的值"
    }
]
```



##  接口文档
### 上传图数据
### url:"/edit"
### 方式：POST
### 请求体
```json5
{
    "uuid":"<string>这个应用的id",
    "data":{   // 图的数据
        "nodes":["一个节点json,通过obj.data.name获得节点名，通过obj.keyData获取节点可变参数"],// 所有的节点
        "edges": [], // 所有的边
        "combos": [],  // 没用
        "groups": [],  // 没用
    }
}
```

