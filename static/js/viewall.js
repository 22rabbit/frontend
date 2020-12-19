var renderTabelAndGraph = () => {
    // layui.use(['table', 'layer'], function() {
    //     var table = layui.table;
    //     var layer = layui.layer;
        var myChart1 = echarts.init(document.getElementById('graph1'));
        // var myChart2 = echarts.init(document.getElementById('data-graph2'));

        var params_k = $('#params_k').val() || 1;
        var params_b = $('#params_b').val() || 0;
        var operation = params_k + '*x+' + params_b;
        var result_name = $('#result-name').val() || '属性值';


        // const getData = () => {
        $.get('/alldata/', {
            'operation': operation,
        }).done(function (response) {
            // var all_data = response['data'];
            // var message = response['message'];
            //
            // var _id = all_data[0]['id'];
            // var names = [];
            // for(let i = 0; i < all_data.length; i++) {
            //     names.push(all_data[i]['nickname'])
            // }
            // console.log(all_data);
            // var volSeries = [];
            // for(let i = 0; i < all_data.length; i++) {
            //     volSeries.push({
            //         name: all_data[i]['nickname'],
            //         type: 'line',
            //         smooth: true,
            //         data: all_data[i].x
            //     })
            // }
            // console.log(volSeries);
            // var volSeries2 = [];
            // for(let i = 0; i < all_data.length; i++) {
            //     volSeries2.push({
            //         name: all_data[i]['nickname'],
            //         type: 'line',
            //         smooth: true,
            //         data: all_data[i].value
            //     })
            // }


            // 配置echart图的渲染
            myChart1.setOption({
                title: {},
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    // name: '采样点',
                    // nameLocation: 'end'
                },
                yAxis: {},
                // legend: {
                //     data: names
                // },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true
                }]
            });
            console.log("111")
            // myChart2.setOption({
            //     title: {},
            //     xAxis: {
            //         data: _id,
            //         name: '采样点',
            //         nameLocation: 'end'
            //     },
            //     yAxis: {},
            //     legend: {
            //         data: names
            //     },
            //     series: volSeries2
            // });

            // layer.msg(message);
        });

    // });
};


// 初始化渲染
$(function () {
    renderTabelAndGraph()
    // const timerId = setInterval(() => {
    //     renderTabelAndGraph();
    // }, 1000);
    //
    // $('#execute-btn').click(function (event) {
    //     event.preventDefault();
    //
    //     clearInterval(timerId);
    //     const timerId = setInterval(() => {
    //         renderTabelAndGraph();
    //     }, 1000);
    // });
});


// 执行运算按钮的点击渲染
$(function () {

});

