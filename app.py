from flask import Flask
from apps.front import bp as front_bp
import config
from exts import mongo    #flask框架启动
from flask_wtf import CSRFProtect


def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    app.register_blueprint(front_bp)

    mongo.init_app(app)

    # CSRFProtect(app)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
