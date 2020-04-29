import datetime
from flask import Blueprint, Response
from flask import redirect
from flask import request
from flask import session
from flask import url_for, abort, render_template, flash
from functools import wraps
from hashlib import md5
from database import *

api = Blueprint('api', __name__)


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


@api.route('/login/', methods=['GET', 'POST'])
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


@api.route('/logout/')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('homepage'))


@api.route('/<username>/')
def user_page(username):
    user = get_object_or_404(User, User.username == username)
    posts = user.get_posts()
    return object_list('user_page.html', posts, 'post_list', user=user)


@api.route('/create/', methods=['POST'])
@login_required
def create():
    is_logged = session['logged_in']
    data = request.get_json()
    user = get_current_user()
    if request.method == 'POST' and data['image'] and data['text']:
        try:
            post = Post.create(
                user=user,
                image=data['image'],
                text=data['text'],
                datetime=datetime.datetime.now())
            flash('Your message has been created')
        except IntegrityError():
            flash('Cannot post due to words limit or picture size')
            return Response(status=400)
        return Response(status=201)
        #return redirect(url_for('user_page', username=user.username))

    return Response(status=400)



@api.context_processor
def _inject_user():
    return {'current_user': get_current_user()}
