from peewee import *
import datetime
from flask import Flask
from flask import g
from flask import redirect
from flask import request
from flask import session
from flask import url_for, abort, render_template, flash
from functools import wraps
from hashlib import md5
import os

SECRET_KEY = 'z\xf2\x05\xeeywJ\xdb\xfe\x8crM\x0b%F\xcb'

app = Flask(__name__)
app.config.from_object(__name__)

dir_path = os.path.dirname(__file__)
db = SqliteDatabase(dir_path + "data.db")


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
                .orderby(Post.datetime))


class Post(BaseModel):
    # TODO: image class for storing and uploading images
    image = CharField()
    text = CharField(140)
    datetime = DateTimeField()
    user = ForeignKeyField(User, backref='posts')


def create_tables():
    with db:
        db.create_tables([User, Post])


def login_required(f):
    @wraps(f)
    def inner(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)

    return inner


def object_list(template_name, qr, var_name='object_list', **kwargs):
    kwargs.update(
        page=int(request.args.get('page', 1)),
        pages=qr.count() / 20 + 1)
    kwargs[var_name] = qr.paginate(kwargs['page'])
    return render_template(template_name, **kwargs)


def auth_user(user):
    session['logged_in'] = True
    session['username'] = user.username
    flash('You are logged in as %s' % user.username)


def get_current_user():
    if session.get('logged_in'):
        return User.get(User.id == session['user_id'])


def get_object_or_404(model, *expressions):
    try:
        return model.get(*expressions)
    except model.DoesNotExist:
        abort(404)


@app.before_request
def before_request():
    db.connect()


@app.after_request
def after_request(response):
    db.close()
    return response


@app.route("/")
def homepage():
    return Flask.render_template("index.html")


@app.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST' and request.form['username']:
        pw_hash = md5(request.form['password'].encode('utf-8')).hexdigest()
        try:
            with db.atomic():
                user = User.create(
                    username=request.form['username'],
                    password=pw_hash)
        except IntegrityError:
            flash('Username is not unique!')
        else:
            auth_user(user)
            return redirect(url_for('homepage'))
    return render_template('register.html')


@app.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST' and request.form['username']:
        try:
            pw_hash = md5(request.form['password'].encode('utf-8')).hexdigest()
            user = User.get(
                (User.username == request.form['username']) &
                (User.password == pw_hash))
        except User.DoesNotExist:
            flash('The password entered is incorrect')
        else:
            auth_user(user)
            return redirect(url_for('homepage'))

    return render_template('login.html')


@app.route('/logout/')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('homepage'))


@app.route('/<username>')
def user_page(username):
    user = get_object_or_404(User, User.username == username)
    posts = user.get_posts()
    return object_list('user_page.html', posts, 'post_list', user=user)


@app.route('/create/', methods=['GET', 'POST'])
@login_required
def create():
    user = get_current_user()
    if request.method == 'POST' and request.form['content']:
        try:
            post = Post.create(
                user=user,
                image=request.form['image'],
                text=request.form['text'],
                datetime=datetime.datetime.now())
            flash('Your message has been created')
        except IntegrityError():
            flash('Cannot post due to words limit or picture size')
        return redirect(url_for('user_page', username=user.username))

    return render_template('create.html')


@app.context_processor
def _inject_user():
    return {'current_user': get_current_user()}
