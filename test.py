from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
import time
import datetime
import json


accessKeyId = 'LTAI4GAhaCeHUhgYni41W6o3'
accessSecret = 'MfYU5oT9rdVZptcdqSnZ4DZJsJloYI'

client = AcsClient(accessKeyId, accessSecret, 'cn-hangzhou')

request = CommonRequest()
request.set_accept_format('json')
request.set_domain('iot.cn-shanghai.aliyuncs.com')
request.set_method('POST')
request.set_protocol_type('https') # https | http
request.set_version('2018-01-20')
request.set_action_name('QueryDevicePropertyData')


start_date = '2020-08-09 12:00:00'
# end_date = '2020-09-05 12:00:00'
end_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
start_time = int(round(time.mktime(time.strptime(start_date, "%Y-%m-%d %H:%M:%S"))) * 1000)
end_time = int(round(time.mktime(time.strptime(end_date, "%Y-%m-%d %H:%M:%S"))) * 1000)
# start_time = int(round(time.time() * 1000))
# end_time = int(round(time.time() * 1000))
# print(start_time)
# print(end_time)

request.add_query_param('RegionId', "cn-hangzhou")
request.add_query_param('StartTime', start_time)
request.add_query_param('Identifier', 'Voltage')
request.add_query_param('Asc', 1)
request.add_query_param('EndTime', end_time)
request.add_query_param('PageSize', 50)
# request.add_query_param('ProductKey', 'a1MYO7hUU0c')
# request.add_query_param('DeviceName', 'WDBC28')
request.add_query_param('ProductKey', 'a1hhc8u1lHd')
request.add_query_param('DeviceName', 'Voltage')

# response = client.do_action(request)
response = client.do_action_with_exception(request)
# python2:  print(response)
print(str(response, encoding='utf-8'))
response_data = json.loads(str(response, encoding='utf-8'))
data = response_data["Data"]["List"]["PropertyInfo"]
print(len(data))
print(data)