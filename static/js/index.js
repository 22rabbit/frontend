// 查看的页面跳转
$(function () {
    $('.view').click(function (event) {
        event.preventDefault();

        var sm_box = $(this).parent().parent();
        var device_name = sm_box.attr('data-name');
        var identifier = sm_box.attr('data-identifier');
        console.log(device_name);

        window.open('http://127.0.0.1:8887/view/?device_name='+ device_name + '&identifier='+ identifier)
    });
});

// 编辑的跳转
$(function () {
    $('.edit').click(function (event) {
        event.preventDefault();

        window.open('http://127.0.0.1:8887/test')
    });
});

// 处理的Modal弹窗
$(function () {
    $('.deal').click(function (event) {
        event.preventDefault();

        var edit_button = $(this);
        var sm_box = $(this).parent().parent();
        var device_status = edit_button.attr('data-status');
        var device_name = sm_box.attr('data-name');
        var identifier = sm_box.attr('data-identifier');
        console.log(device_name);

        layui.use(['form', 'layer'], function () {
            var form = layui.form;
            var layer = layui.layer;

            var status_msg = device_status === "1" ? '设备正在运行中...' : '设备已关闭!!!';
            layer.open({
                type: 0,
                title: '采集状态状态',
                content: status_msg,
                btn: ['开始采集', '停止采集'],
                yes: function(index, layero) {
                    // edit_button.attr('data-status', "1");
                    // 这里可以执行发送ajax，开启硬件设备
                    console.log("开始采集");
                    let command = "begin";
                    _ajax_.post({
                        'url': '/deal/',
                        'data': {
                            command: command,
                            device_name: device_name,
                            identifier: identifier
                        },
                        'success': function (response) {
                            console.log(response);
                            if(response.code === 200) {
                                edit_button.attr('data-status', "1");
                            }
                        }
                    });
                    layer.close(index);
                },
                btn2: function(index, layero) {
                    // edit_button.attr('data-status', "0");
                    // 这里可以执行发送ajax，关闭硬件设备
                    console.log("停止采集");
                    let command = "stop";
                    _ajax_.post({
                        'url': '/deal/',
                        'data': {
                            command: command,
                            device_name: device_name,
                            identifier: identifier
                        },
                        'success': function (response) {
                            if(response.code === 200) {
                                edit_button.attr('data-status', "0");
                            }
                        }
                    });
                    layer.close(index);
                },
                shadeClose: true
            })
        });
    });
});


// 添加设备的Modal窗口
function genAddModal() {
    layer.open({
        type: 1,
        title: '添加设备',
        content: '<div id="modal">\n' +
        '    <form action="" class="layui-form layui-form-pane">\n' +
        '        <div class="layui-form-item">\n' +
        '            <label class="layui-form-label">DeviceName</label>\n' +
        '            <div class="layui-input-block">\n' +
        '                <input type="text" name="device_name" placeholder="请输入设备的deviceName..." class="layui-input">\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="layui-form-item">\n' +
        '            <label class="layui-form-label">ProductKey</label>\n' +
        '            <div class="layui-input-block">\n' +
        '                <input type="text" name="product_key" placeholder="请输入设备的productKey..." class="layui-input">\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="layui-form-item">\n' +
        '            <label class="layui-form-label">Identifier</label>\n' +
        '            <div class="layui-input-block">\n' +
        '                <input type="text" name="identifier" class="layui-input" placeholder="请输入设备的Identifier">\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </form>\n' +
        '</div>',
        area: ['500px', '300px'],
        offset: '100px',
        btn: ['yes', 'no'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var deviceName = $("input[name='device_name']").val();
            var productKey = $("input[name='product_key']").val();
            var identifier = $("input[name='identifier']").val();

            console.log(deviceName, productKey, identifier);
            _ajax_.post({
                'url': '/addDevice/',
                'data': {
                    'device_name': deviceName,
                    'product_key': productKey,
                    'identifier': identifier
                },
                'success': function (response) {
                    var message = response['message'];
                    layer.msg(message);
                    window.location = '/'
                }
            });

            // 后续这里将数据插入数据库中，或者ajax传到服务器端进行保存

            layer.close(index);
        },
        no: function (index, layero) {
            layer.close(index);
        }
    })
}
$(function () {
    $('#add-device').click(function (event) {
        event.preventDefault();

        genAddModal();
    });
});
