import datetime
from flask import Blueprint, Response
from flask import redirect
from flask import request
from flask import session
from flask import send_file
from flask import jsonify
from flask import url_for, abort, render_template, flash
from functools import wraps
from hashlib import md5
from database import *
from playhouse.shortcuts import model_to_dict
import os
import content_storage as storage

SIPHASH_KEY = b'0123456789ABCDEF'

dir_path = os.path.dirname(__file__)

api = Blueprint('api', __name__)


class BadFormatException(Exception):
    pass


def login_required(f):
    @wraps(f)
    def inner(*args, **kwargs):
        print(str(session.get('logged_in')) + ' ' + str(session.get('username')))
        if not session.get('logged_in'):
            return Response(status=403)
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
        return User.get(User.username == session['username'])


def get_object_or_404(model, *expressions):
    try:
        return model.get(*expressions)
    except model.DoesNotExist:
        abort(404)


@api.before_request
def before_request():
    db.connect()


@api.after_request
def after_request(response):
    db.close()
    return response


@api.route('/register/', methods=['POST'])
def register():
    data = request.get_json()
    if request.method == 'POST' and data['username']:
        pw_hash = md5(data['password'].encode('utf-8')).hexdigest()
        try:
            with db.atomic():
                user = User.create(
                    username=data['username'],
                    password=pw_hash)
        except IntegrityError:
            # Возвращается, если аккаунт уже создан (мб поменять код ошибки)
            return Response(status=200)
        else:
            auth_user(user)
            return Response(status=201)


@api.route('/login/', methods=['POST'])
def login():
    data = request.get_json()
    if data['username']:
        try:
            pw_hash = md5(data['password'].encode('utf-8')).hexdigest()
            user = User.get(
                (User.username == data['username']) &
                (User.password == pw_hash))
        except User.DoesNotExist:
            flash('The password entered is incorrect')
            return Response(status=401)
        else:
            auth_user(user)
            # Пользователь залогинился
            return Response(status=200)


@api.route('/logout/')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return Response(status=200)


# TODO
@api.route('/<username>/')
def user_page(username):
    user = get_object_or_404(User, User.username == username)
    return jsonify({'username': user.username, 'postIds': [post.post_key for post in user.get_posts()]})


@api.route('/post/<post_key>/')
def get_post(post_key):
    post = Post.get(Post.post_key == post_key)
    post_dict = model_to_dict(post)
    try:
        file_data = storage.get_post_file(post)
    except:
        post_dict['fileData'] = 'empty'
    else:
        post_dict['fileData'] = file_data
    return jsonify(post_dict)


@api.route('/delete/<post_key>/', methods=['DELETE'])
def delete_post(post_key):
    try:
        post = Post.get(Post.post_key == post_key)
    except:
        return Response(status=404)

    if User.get_by_id(post.user_id).username == session.get('username'):
        storage.delete_image_from_storage(post)
        post.delete_instance()
        return Response(status=200)
    else:
        return Response(status=403)


@api.route('/create/', methods=['POST'])
@login_required
def create():
    data = request.get_json()
    user = get_current_user()
    if data['imageData']:
        description = ''
        if data['text']:
            description = data['text']
        try:
            post_key, extension = storage.store_image_data(data['imageData'])
        except BadFormatException:
            return Response(status=422)
        try:
            post = Post.create(
                user=user,
                post_key=post_key,
                file_extension=extension,
                text=description,
                datetime=datetime.datetime.now())
            flash('Your message has been created')
        except IntegrityError():
            flash('Cannot post due to words limit or picture size')
            return Response(status=400)
        return Response(status=201)
    return Response(status=400)


@api.context_processor
def _inject_user():
    return {'current_user': get_current_user()}
