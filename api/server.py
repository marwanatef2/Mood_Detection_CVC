from flask import Flask, redirect, url_for, render_template, request, jsonify
from flask_login import login_required, logout_user, current_user
from models import db, login_manager, User
from oauth import blueprint
# from flask_dance.contrib.facebook import make_facebook_blueprint, facebook
from flask_dance.contrib.google import make_google_blueprint, google
import urllib.request

app = Flask(__name__)
db.init_app(app)
login_manager.init_app(app)

app.config.from_object('config')

app.register_blueprint(blueprint, url_prefix='/login')


@app.route('/')
def home():
    if current_user.is_authenticated:
        resp = google.get('/oauth2/v1/userinfo')
        if resp.ok:
            return render_template('zeez.html', userinfo=resp.json())
    else:
        return "hello nobody"


@app.route('/login')
def login():
    # return redirect(url_for("facebook.login"))
    return redirect(url_for("google.login"))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))


# @login_required
@app.route('/<myemail>/follow/<email>')
def follow_user(myemail, email):
    me = User.query.filter_by(email=myemail).first()
    user = User.query.filter_by(email=email).first()
    # if user is not None and user != current_user:
    if user is not None and user != me:
        # current_user.follow(user)
        me.follow(user)
        db.session.commit()
        return {'followed': True}
    return {'followed': False}


# @login_required
@app.route('/<myemail>/unfollow/<email>')
def unfollow_user(myemail, email):
    me = User.query.filter_by(email=myemail).first()
    user = User.query.filter_by(email=email).first()
    # if user is not None and user != current_user:
    if user is not None and user != me:
        # current_user.unfollow(user)
        me.unfollow(user)
        db.session.commit()
        return {'unfollowed': True}
    return {'unfollowed': False}


# @login_required
@app.route('/<myemail>/friends')
@app.route('/<myemail>/following')
def followed_users(myemail):
    me = User.query.filter_by(email=myemail).first()
    # following = current_user.following
    following = me.following
    users = []
    for followed in following:
        users.append({'name': followed.name, 'email': followed.email})
    return {'users': users}


@app.route('/<myemail>/followers')
def followers(myemail):
    me = User.query.filter_by(email=myemail).first()
    # following = current_user.following
    following = me.followers
    users = []
    for followed in following:
        users.append({'name': followed.name, 'email': followed.email})
    return {'users': users}


@app.route('/db')
def database():
    # db.drop_all()
    # db.create_all()
    marwan = User.query.filter_by(name='Marwan').first()
    # zeez = User.query.filter_by(name='Zeez').first()
    # samir = User.query.filter_by(name='Samir').first()
    salma = User.query.filter_by(name='Salma').first()
    salma.follow(marwan)
    db.session.commit()
    users = marwan.followers
    names = [user.name for user in users]
    return {'users': names}


@app.route('/video/<path>')
def video(path):
    from video_processing.smile import calc_video_score
    data = request.get_json()
    uri = data['uri']
    score = calc_video_score(uri)
    return {'score': score}


@app.route('/uri', methods=['GET'])
def uri():
    data = request.get_json()
    return render_template('video.html', data=data['uri'])
