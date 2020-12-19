//传感器监控节点的传感器系数运算，表格显示，曲线显示
var renderTabelAndGraph = () => {
    layui.use(['table', 'layer'], function() {
        var table = layui.table;
        var layer = layui.layer;
        var myChart = echarts.init(document.getElementById('data-graph'));

        var device_name = $('#data-table').attr('data-name');
        var identifier = $('#data-table').attr('data-identifier');
        var params_k = $('#params_k').val() || 1;
        var params_b = $('#params_b').val() || 0;
        var operation = params_k + '*x+' + params_b;   //operation定义为k*x+b
        var result_name = $('#result-name').val() || '属性值';

        //$.get  jquery.ajax用ajax,带着参数device_nme,identity,opreation，get请求，请求成功后，done,得到response,
        // const getData = () => {
        $.get('/data/', {   //data里什么都有包括id,create_time,value,x,data_reverse
            'device_name': device_name,
            'identifier': identifier,
            'operation': operation,
        }).done(function (response) {
            var data = response['data'];
            var message = response['message'];

            var _id = [];
            var create_time = [];
            var value = [];
            var x = [];
            var data_reverse = [];
            //逆着遍历，序号最大，最新的数据放在最前面
            for (let i = data.length - 1; i >= 0; i--) {
                let a_data = {};
                Object.assign(a_data, data[i]);
                data_reverse.push(a_data);
            }
            console.log(data_reverse);
            console.log(data);
            //将数据归类，之前的data是一个序号一个字典，现在将序号，时间分别放入一个列表中，便于前端渲染
            for (let i = 0; i < data.length; i++) {
                create_time[i] = data[i]['create_time'];
                value[i] = data[i]['value'];
                _id[i] = data[i]['id'];
                x[i] = data[i]['x'];
            }

            // 配置layui.table的渲染
            table.render({
                elem: '#data-table',
                data: data_reverse,
                ceilMinWidth: 100,
                cols: [[
                    {field: 'id', width: 150, title: '采样点', sort: true},
                    {field: 'create_time', title: '采集时刻'},
                    {field: 'x', title: '电压数据(V)', sort: true},
                    //{field: 'value', title: result_name, sort: true},
                    {field: 'value', title: '电场数据(kV/m)', sort: true},
                ]],
                height: 400,
                page: {
                    layout: ['prev', 'page', 'next', 'count', 'skip'],
                    first: false,
                    last: false,
                    limit: 50
                }
            });

            // 配置echart图的渲染
            myChart.setOption({
                title: {},
                xAxis: {
                    data: _id,
                    name: '采样点',
                    nameLocation: 'end'
                },
                yAxis: {},
                legend: {
                    data: ['电压数据V', '电场数据kV/m']
                },
                series: [
                    {
                        name: '电压数据V',
                        type: 'line',
                        smooth: true,
                        data: x
                    },
                    {
                        name: '电场数据kV/m',
                        type: 'line',
                        smooth: true,
                        data: value
                    }
                ]
            });

            // layer.msg(message);
        });
    });
};


// 初始化渲染
$(function () {
    const timerId = setInterval(() => {
        renderTabelAndGraph();
    }, 500);

    $('#execute-btn').click(function (event) {
        event.preventDefault();

        clearInterval(timerId);
        const timerId = setInterval(() => {
            renderTabelAndGraph();
        }, 500);
    });
});


// 执行运算按钮的点击渲染
$(function () {

});



