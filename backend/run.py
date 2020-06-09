import api
from flask import Flask
from flask_cors import CORS

SECRET_KEY = 'z\xf2\x05\xeeywJ\xdb\xfe\x8crM\x0b%F\xcb'

app = Flask(__name__)
app.config.from_object(__name__)
app.register_blueprint(api.api)

CORS(app,  supports_credentials=True)

if __name__ == '__main__':
    app.run()
