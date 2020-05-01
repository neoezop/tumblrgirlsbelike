from peewee import *
from database import *
import os

dir_path = os.path.dirname(__file__)
db = SqliteDatabase(dir_path + "/data.db")


class BaseModel(Model):
    class Meta:
        database = db


class User(BaseModel):
    username = CharField(20, unique=True)
    password = CharField()

    def get_posts(self):
        return (Post
                .select()
                .where(Post.user == self)
                .order_by(Post.datetime))


class Post(BaseModel):
    # TODO: image class for storing and uploading images
    filename = CharField()
    text = CharField(140)
    datetime = DateTimeField()
    user = ForeignKeyField(User, backref='posts')


def create_tables():
    with db:
        db.create_tables([User, Post])


create_tables()
