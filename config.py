#配置
import os


DEBUG = True


# SECRET_KEY = os.urandom(24)
SECRET_KEY = "flask-study"


''''这个是为MongoDB添加权限的版本'''
MONGO_HOST = 'localhost'
MONGO_PORT = '27017'
MONGO_DATABASE = 'frontend'
MONGO_URI = "mongodb://{0}:{1}/{2}".format(
    MONGO_HOST, MONGO_PORT, MONGO_DATABASE
)
