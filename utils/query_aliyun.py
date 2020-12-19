#从云平台获取value time数据
from aliyunsdkcore.client import AcsClient   #发起调用，导入相关产品的SDK
from aliyunsdkcore.request import CommonRequest   #
import time
import datetime
import json
import numpy as np


def get_data(device_name, product_key, identifier):
    accessKeyId = 'LTAI4GAhaCeHUhgYni41W6o3'
    accessSecret = 'MfYU5oT9rdVZptcdqSnZ4DZJsJloYI'

    client = AcsClient(accessKeyId, accessSecret, 'cn-hangzhou')


    #创建Request对象（查询实例详情），并设置请求参数。
    request = CommonRequest()
    request.set_accept_format('json')   #接收json格式的数据
    request.set_domain('iot.cn-shanghai.aliyuncs.com')    #云数据库区域
    request.set_method('POST')    #请求方式为POST
    request.set_protocol_type('https')   # 协议为https或http
    request.set_version('2018-01-20')
    request.set_action_name('QueryDevicePropertyData')

    end_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    start_date = (datetime.datetime.now() - datetime.timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
    start_time = int(round(time.mktime(time.strptime(start_date, "%Y-%m-%d %H:%M:%S"))) * 1000)
    end_time = int(round(time.mktime(time.strptime(end_date, "%Y-%m-%d %H:%M:%S"))) * 1000)

    request.add_query_param('RegionId', "cn-hangzhou")
    request.add_query_param('StartTime', start_time)
    request.add_query_param('Identifier', identifier)
    request.add_query_param('Asc', 0)
    request.add_query_param('EndTime', end_time)
    request.add_query_param('PageSize', 50)
    request.add_query_param('ProductKey', product_key)
    request.add_query_param('DeviceName', device_name)

    response = client.do_action_with_exception(request)
    response_data = json.loads(str(response, encoding='utf-8'))    #编码方式为utf-8

    print(f'response_data:\n{response_data}')    #云平台传回的数据格式：{'RequestId': '1931B369-D4E6-4175-9492-3105EB774966', 'Data': {'NextValid': True, 'NextTime': 1606143558576, 'List': {'PropertyInfo': [{'Value': '1.491', 'Time': 1606143886551},

    data = response_data["Data"]["List"]["PropertyInfo"][::-1]     #表格中的记录倒序展示

    print(f'data:\n{data}')   #data的数据格式：[{'Value': '1.498', 'Time': 1606143558577},

    rtn_data = list()
    for i, a_data in enumerate(data):  #将列表组合成一个索引序列，同时列出数据和数据下标
        a_rtn_data = dict()    #创建空字典a_rtn_data
        a_rtn_data['id'] = i    #i赋给a_rtn_data列表里的id
        for key, value in a_data.items():    #返回字典的键值对
            if key == 'Value':    #
                a_rtn_data['value'] = value    #value赋给a_rtn_data中的value
            else:
                a_rtn_data['create_time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(value / 1000))     #格式化时间，赋给“create_time）time.strftime()函数接收以时间元组，并返回可读字符串表示的当地时间，格式由参数format决定
        rtn_data.append(a_rtn_data)

    return rtn_data


def str2sec(str_time):
    date_, time_ = str_time.split(' ')
    tmlist = list()
    tmlist.extend([int(d) for d in date_.split('-')])
    tmlist.extend([int(t) for t in time_.split(':')])
    tmlist.extend([0, 0, 0])
    tmtuple = tuple(tmlist)
    return time.mktime(tmtuple)

def pass_rate(device_name):
    data = get_data(device_name, 'a1hhc8u1lHd', 'Voltage')

    create_times = [d['create_time'] for d in data]
    print(create_times)

    delta_ts = list()
    secondk = str2sec(create_times[0])
    for i in range(1, len(create_times)):
        secondk_1 = str2sec(create_times[i])
        delta_t = secondk_1 - secondk
        delta_ts.append(delta_t)
        secondk = secondk_1

    print(delta_ts)

    mean_delta_t = np.mean(delta_ts)
    print(mean_delta_t)
    std_delta_t = np.std(delta_ts)
    print(std_delta_t)

    new_delta_ts = list()
    for delta_t in delta_ts:
        if delta_t - mean_delta_t <= 3 * std_delta_t:
            new_delta_ts.append(delta_t)
    update_mean_delta_t = np.mean(new_delta_ts)  # 设备的平均上传时间

    num_of_pass = 0
    for delta_t in delta_ts:
        if delta_t > update_mean_delta_t * 2:
            num_of_pass += 1
    result = num_of_pass / len(delta_ts)
    # print(result)

    return result


if __name__ == '__main__':
    data = get_data('Vcollect04', 'a1hhc8u1lHd', 'Voltage')
    print(data)
    for i, a_data in enumerate(data):
        a_data['x'] = a_data['value']
        data[i] = a_data

    print(data)

    result = pass_rate('Vcollect02')
    print(result)



