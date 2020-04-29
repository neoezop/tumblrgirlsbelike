import api
from flask import Flask

SECRET_KEY = 'z\xf2\x05\xeeywJ\xdb\xfe\x8crM\x0b%F\xcb'

app = Flask(__name__)
app.config.from_object(__name__)
app.register_blueprint(api.api)

if __name__ == '__main__':
    app.run()
