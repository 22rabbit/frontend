# 路由和视图的一一对应
import urllib

from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from utils import query_aliyun, pub_aliyun
from exts import mongo
from math import *

bp = Blueprint("front", __name__)


@bp.route('/index')
def index():
    devices = list(mongo.db.hardware.find({}).sort('device_name', 1))  # 传感器节点列表以传感器节点名称排序
    return render_template('index2.html', devices=devices)


@bp.route('/view/')
def view():
    args = request.args
    device_name = args.get('device_name')
    identifier = args.get('identifier')
    device = mongo.db.hardware.find_one(
        {'device_name': device_name, 'identifier': identifier})  # 通过device_name与identifier在mongoDB数据库唯一标识传感器节点
    device_nickname = device['device_nickname']  # 修改传感器节点为中文名称
    return render_template('view.html', device_name=device_name, device_nickname=device_nickname, identifier=identifier)


@bp.route('/viewall/')
def viewall():
    return render_template('viewall.html')


# 添加传感器节点
@bp.route('/addDevice/', methods=['POST'])
def add_device():
    form = request.form
    device_name = form.get('device_name')  # 通过三元组传感器节点名称，传感器节点密钥，标识符添加
    product_key = form.get('product_key')
    identifier = form.get('identifier')
    if device_name == '' or product_key == '' or identifier == '':
        message = '值不能为空，添加失败！'
        return jsonify({'code': 200, 'message': message, 'data': []})

    mongo.db.hardware.insert({'device_name': device_name, 'product_key': product_key, 'identifier': identifier})
    message = '添加成功！！！'
    return jsonify({'code': 200, 'message': message, 'data': []})


# 传感器节点监控
@bp.route('/data/')
def get_data():
    args = request.args
    device_name = args.get('device_name')
    identifier = args.get('identifier')
    operation = args.get('operation')

    device = list(
        mongo.db.hardware.find({'device_name': device_name, 'identifier': identifier}))  # 通过device_name和identity查找传感器节点
    # 如果没有查询到，返回查询失败
    if not device:
        message = '查询失败!!!'
        return jsonify({'code': 300, 'message': message, 'count': 0, 'data': []})

    product_key = device[0]['product_key']
    print(device[0])
    print(f'{device_name}即将执行 {operation} 操作...')

    # 后期应该通过device_name来获取get_data中的三个参数，然后获取数据，然后再对data数据执行operation操作
    data = query_aliyun.get_data(device_name, product_key, identifier)
    message = "运算成功!!!"
    try:
        for i, a_data in enumerate(data):
            a_data['x'] = a_data['value']  # 将云数据库中的电压值传给x
            data[i] = a_data
        for i, a_data in enumerate(data):
            x = a_data['value']
            if isinstance(x, str):  # x是否是字符串
                x = float(x)  # 将x转为浮点数
            data[i]['value'] = round(eval(operation), 3)  # 对value进行运算并四舍五入，保留三位小数

    except:
        message = "运算失败!!!"

    return jsonify({"code": 200, "message": message, "count": len(data), "data": data})


# 返回所有的传感器节点列表
@bp.route('/alldata/')
def get_alldata():
    args = request.args
    operation = args.get('operation')

    devices = list(mongo.db.hardware.find({}).sort('device_name', 1))
    # 如果没有查询到，返回查询失败
    if not devices:
        message = '查询失败!!!'
        return jsonify({'code': 300, 'message': message, 'data': []})

    all_data = []
    message = "运算成功!!!"
    for device in devices:
        device_name = device['device_name']
        product_key = device['product_key']
        identifier = device['identifier']
        device_nickname = device['device_nickname']

        # 后期应该通过device_name来获取get_data中的三个参数，然后获取数据，然后再对data数据执行operation操作
        data = query_aliyun.get_data(device_name, product_key, identifier)
        try:
            for i, a_data in enumerate(data):
                a_data['x'] = a_data['value']
                data[i] = a_data
            for i, a_data in enumerate(data):
                x = a_data['value']
                if isinstance(x, str):
                    x = float(x)
                data[i]['value'] = round(eval(operation), 3)

            _data = {'x': [], 'value': [], '_id': [], 'nickname': ''}
            for a_data in data:
                _data['x'].append(float(a_data['x']))
                _data['value'].append(float(a_data['value']))
                _data['_id'].append(a_data['id'])
            _data['nickname'] = device_nickname
            all_data.append(_data)
        except:
            message = "运算失败!!!"
            return jsonify({"code": 200, "message": message, "data": all_data})

    return jsonify({"code": 200, "message": message, "data": all_data})


# 执行命令
@bp.route('/deal/', methods=['POST'])
def deal():
    form = request.form
    command = form.get('command')
    device_name = form.get('device_name')
    identifier = form.get('identifier')

    device = list(mongo.db.hardware.find({'device_name': device_name, 'identifier': identifier}))
    # 如果没有查询到，返回查询失败
    if not device:
        message = '状态修改失败!!!'
        return jsonify({'code': 404, 'message': message, 'data': []})

    product_key = device[0]['product_key']
    print(device[0])
    print(f'{device_name}即将执行 {command} 命令...')

    try:
        response = pub_aliyun.pub_aliyun(command, device_name, product_key)
        print(response)
        if response['Success']:
            return jsonify({'code': 200, 'message': '状态修改成功！！！', 'data': []})
        else:
            return jsonify({'code': 404, 'message': '状态修改失败！！！', 'data': []})
    except:
        return jsonify({'code': 404, 'message': '状态修改失败！！！', 'data': []})


# 设置采样频率
@bp.route('/changeFreq/', methods=['POST'])
def change_freq():
    form = request.form
    device_name = form.get('device_name')
    freq = form.get('freq')

    device = mongo.db.hardware.find_one({'device_name': device_name})
    if device:
        response = pub_aliyun.pub_aliyun(freq, device['device_name'], device['product_key'])
        if response['Success']:
            mongo.db.hardware.update_one({'device_name': device_name}, {'$set': {'frequency': freq}})
        else:
            return jsonify({'code': 200, 'message': '网络出错！', 'data': {}})

    return jsonify({'code': 200, 'message': '修改成功！', 'data': {}})


@bp.route('/edit', methods=['POST'])
def get_edit():
    # if request.method == 'GET':
    #     return render_template('edit.html')
    # else:
    print(request.get_data(as_text=True))
    # form = request.form
    # print(form)
    # operation = form.get('operation')
    # print(operation)

    # 存储到mongodb

    return jsonify({'code': 200, 'message': '保存成功!', 'data': ''})


client_id = '4224772885281630216'
client_secret = 'c06141ef-923c-4e71-9a48-8b8fb20de54f'


@bp.route('/')
def hello_world():
    oauth_url = 'https://signin.aliyun.com/oauth2/v1/auth'
    params = {
        'client_id': client_id,
        'redirect_uri': 'http://localhost:8887/callback',
        'response_type': 'code',
        'access_type': 'offline'
    }
    url = oauth_url + '?' + urllib.parse.urlencode(params)
    return redirect(url, 302)


@bp.route('/callback')
def oauth_callback():
    code = request.args.get('code')
    # access_token_url = 'https://oauth.aliyun.com/v1/token'
    #
    # payload = {
    #               'client_id': client_id,
    #               'client_secret': client_secret,
    #               'code': code,
    #               'redirect_uri': 'http://localhost:8887/callback',
    #               'grant_type': 'authorization_code',
    #
    #           },
    # headers = {
    #     'Content-Type': 'application/x-www-form-urlencoded'
    # }
    #
    # response = requests.post(access_token_url, json=payload, headers=headers)
    # print(response.content)

    return redirect(url_for('front.index'))


@bp.route('/test/', methods=['GET'])
def test():
    return render_template('edit.html')
