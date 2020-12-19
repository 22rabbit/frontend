#从云平台获取采样频率，启停数据
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
import base64
import json


def pub_aliyun(command, device_name, product_key):
    accessKeyId = 'LTAI4GAhaCeHUhgYni41W6o3'    #云平台id
    accessSecret = 'MfYU5oT9rdVZptcdqSnZ4DZJsJloYI'    #云平台密钥
    client = AcsClient(accessKeyId, accessSecret, 'cn-shanghai')

    request = CommonRequest()
    request.set_accept_format('json')
    request.set_domain('iot.cn-shanghai.aliyuncs.com')
    request.set_method('POST')
    request.set_protocol_type('https')  # https | http
    request.set_version('2018-01-20')
    request.set_action_name('Pub')

    request.add_query_param('RegionId', "cn-shanghai")
    topic_full_name = f'/{product_key}/{device_name}/user/get'
    request.add_query_param('TopicFullName', topic_full_name)
    request.add_query_param('MessageContent', base64.b64encode(command.encode('utf-8')).decode('utf-8'))
    request.add_query_param('ProductKey', product_key)

    response = client.do_action_with_exception(request)
    data = json.loads(str(response, encoding='utf-8'))
    return data


if __name__ == '__main__':
    # command = "begin"
    # device_name = "Vcollect02"
    # product_key = "a1hhc8u1lHd"
    # pub_aliyun(command, device_name, product_key)
    data = pub_aliyun('0.5K', 'Vcollect02', 'a1hhc8u1lHd')
    # data = pub_aliyun("stop", 'Vcollect02', 'a1hhc8u1lHd')
    print(data)

