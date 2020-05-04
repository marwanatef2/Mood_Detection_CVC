from flask import Flask, redirect, url_for, render_template, request, jsonify
from flask_login import login_required, logout_user, current_user
from models import db, login_manager, User, Notification
from oauth import blueprint
# from flask_dance.contrib.facebook import make_facebook_blueprint, facebook
from flask_dance.contrib.google import make_google_blueprint, google
import urllib.request
from operator import itemgetter
from datetime import datetime

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
@app.route('/follow', methods=['POST'])
def follow_user():
    data = request.get_json()
    myemail = data['myemail']
    email = data['email']
    me = User.query.filter_by(email=myemail).first()
    user = User.query.filter_by(email=email).first()
    body = "{} started following you".format(me.name)
    notification = Notification(body=body, user=user, date_created=datetime.now())
    # if user is not None and user != current_user:
    if user is not None and user != me:
        # current_user.follow(user)
        me.follow(user)
        db.session.add(notification)
        db.session.commit()
        return {'followed': True}
    return {'followed': False}


# @login_required
@app.route('/addfriend', methods=['POST'])
def add_friend():
    data = request.get_json()
    myemail = data['myemail']
    email = data['email']
    me = User.query.filter_by(email=myemail).first()
    user = User.query.filter_by(email=email).first()
    body = "You are now a friend of {}".format(me.name)
    notification = Notification(body=body, user=user, date_created=datetime.now())
    # if user is not None and user != current_user:
    if user is not None and user != me:
        # current_user.follow(user)
        me.follow(user)
        user.follow(me)
        db.session.add(notification)
        db.session.commit()
        return {'added': True}
    return {'added': False}


# @login_required
@app.route('/unfollow', methods=['POST'])
def unfollow_user():
    data = request.get_json()
    myemail = data['myemail']
    email = data['email']
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
@app.route('/remove', methods=['POST'])
def remove_friend():
    data = request.get_json()
    myemail = data['myemail']
    email = data['email']
    me = User.query.filter_by(email=myemail).first()
    user = User.query.filter_by(email=email).first()
    # if user is not None and user != current_user:
    if user is not None and user != me:
        # current_user.unfollow(user)
        me.unfollow(user)
        user.unfollow(me)
        db.session.commit()
        return {'unfollowed': True}
    return {'unfollowed': False}


# @login_required
@app.route('/friends', methods=['POST'])
@app.route('/following', methods=['POST'])
def followed_users():
    data = request.get_json()
    myemail = data['myemail']
    me = User.query.filter_by(email=myemail).first()
    # following = current_user.following
    following = me.following
    users = []
    for followed in following:
        users.append({'name': followed.name, 'email': followed.email})
    sorted_users = sorted(users, key=itemgetter('name'))
    return {'users': sorted_users}


# @login_required
@app.route('/followers', methods=['POST'])
def followers():
    data = request.get_json()
    myemail = data['myemail']
    me = User.query.filter_by(email=myemail).first()
    # following = current_user.following
    followers = me.followers
    users = []
    for follower in followers:
        users.append({'name': follower.name, 'email': follower.email})
    sorted_users = sorted(users, key=itemgetter('name'))
    return {'users': sorted_users}


@app.route('/notifications', methods=['POST'])
def notifications():
    data = request.get_json()
    myemail = data['myemail']
    me = User.query.filter_by(email=myemail).first()
    my_notifications = me.notifications
    notifications = []
    for notification in my_notifications:
        notifications.append(
            {'body': notification.body, 'datetime': notification.date_created.strftime('%d/%m %I:%M%p'), 'new': notification.date_created > me.last_checked})
    notifications.reverse()
    me.last_checked = datetime.now()
    db.session.commit()
    return {'notifications': notifications}


# @login_required
@app.route('/leaderboard', methods=['POST'])
def leaderboard():
    data = request.get_json()
    myemail = data['myemail']
    me = User.query.filter_by(email=myemail).first()
    # following = current_user.following
    following = me.following
    users = []
    for followed in following:
        users.append({'name': followed.name, 'email': followed.email,
                      'image': followed.image, 'score': followed.score})
    users.append({'name': me.name, 'email': me.email,
                  'image': me.image, 'score': me.score})
    sorted_users = sorted(users, key=itemgetter('score'), reverse=True)
    return {'users': sorted_users}


# @login_required
@app.route('/scoreboard', methods=['GET'])
def global_scoreboard():
    db_users = User.query.all()
    users = []
    for user in db_users:
        users.append({'name': user.name, 'email': user.email,
                      'image': user.image, 'score': user.score})
    sorted_users = sorted(users, key=itemgetter('score'), reverse=True)
    return {'users': sorted_users}


@app.route('/db')
def database():
    db.drop_all()
    db.create_all()
    # marwan = User.query.get(1)
    # body = 'khara test notification'
    # notification = Notification(body=body, user=marwan)
    mido = User(name='mido', email='mido@rdq.com', score=5)
    zeez = User(name='zeez', email='zeez@rdq.com', score=100)
    samir = User(name='samir', email='samir@rdq.com', score=5)
    ziad = User(name='ziad', email='ziad@rdq.com', score=4)
    marwan = User(name='marwan', email='marwan@rdq.com', score=10)
    db.session.add_all([marwan, ziad, mido, zeez, samir])
    db.session.commit()

    return "successful"


@app.route('/video', methods=['POST'])
def video():
    # from video_processing.smile import calc_video_score
    from werkzeug.utils import secure_filename
    import os
    # video = request.files['videoFile']
    if 'video' not in request.files:
        return {'zeez': 'not found'}

    video = request.files['video']

    video_name = secure_filename(video.filename)
    video.save(os.path.join(app.config['UPLOAD_FOLDER'], video_name))
    return "successful"
    # score = calc_video_score(uri)
    # return {'score': score}


# @app.route('/uri', methods=['GET'])
# def uri():
#     data = request.get_json()
#     return render_template('video.html', data=data['uri'])
