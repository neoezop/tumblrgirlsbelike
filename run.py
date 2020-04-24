import db_server

from flask import Flask

app = Flask(__name__)

if __name__ == '__main__':
    db_server.create_tables()
    app.run()
