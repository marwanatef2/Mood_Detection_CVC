from flask import Flask, redirect, url_for, render_template, request, jsonify
from flask_login import login_required, logout_user, current_user
from models import db, login_manager, User, Notification, Challenge, Video
from oauth import blueprint

# from flask_dance.contrib.facebook import make_facebook_blueprint, facebook
from flask_dance.contrib.google import make_google_blueprint, google
import urllib.request
from operator import itemgetter
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from video_processing.smile import calc_video_score


app = Flask(__name__)
db.init_app(app)
login_manager.init_app(app)

app.config.from_object("config")

app.register_blueprint(blueprint, url_prefix="/login")


@app.route("/")
def home():
    if current_user.is_authenticated:
        # resp = google.get("/oauth2/v1/userinfo")
        # if resp.ok:
        #     return render_template("zeez.html", userinfo=resp.json())
        userinfo = {'name': current_user.name, 'email': current_user.email, 'image': current_user.image, 'exists': current_user.exists}
        return render_template("zeez.html", userinfo=userinfo)
    else:
        return "hello nobody"


@app.route("/login")
def login():
    # return redirect(url_for("facebook.login"))
    return redirect(url_for("google.login"))


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))


# @login_required
@app.route("/search", methods=["POST"])
def find_user():
    data = request.get_json()
    search_name = data["name"]
    search_format = "%{}%".format(search_name)
    found_users = User.query.filter(User.name.ilike(search_format)).all()
    if not found_users:
        return {"found": False}
    else:
        users = []
        for user in found_users:
            users.append(
                {
                    "key": user.id,
                    "name": user.name,
                    "email": user.email,
                    "image": user.image,
                }
            )
        sorted_users = sorted(users, key=itemgetter("name"))
        return {"found": True, "users": sorted_users}


# @login_required
@app.route("/follow", methods=["POST"])
def follow_user():
    data = request.get_json()
    myemail = data["myemail"]
    email = data["email"]
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
        return {"followed": True}
    return {"followed": False}


# @login_required
@app.route("/addfriend", methods=["POST"])
def add_friend():
    data = request.get_json()
    myemail = data["myemail"]
    email = data["email"]
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
        return {"added": True}
    return {"added": False}


# @login_required
@app.route("/unfollow", methods=["POST"])
def unfollow_user():
    data = request.get_json()
    myemail = data["myemail"]
    email = data["email"]
    me = User.query.filter_by(email=myemail).first()
    user = User.query.filter_by(email=email).first()
    # if user is not None and user != current_user:
    if user is not None and user != me:
        # current_user.unfollow(user)
        me.unfollow(user)
        db.session.commit()
        return {"unfollowed": True}
    return {"unfollowed": False}


# @login_required
@app.route("/remove", methods=["POST"])
def remove_friend():
    data = request.get_json()
    myemail = data["myemail"]
    email = data["email"]
    me = User.query.filter_by(email=myemail).first()
    user = User.query.filter_by(email=email).first()
    # if user is not None and user != current_user:
    if user is not None and user != me:
        # current_user.unfollow(user)
        me.unfollow(user)
        user.unfollow(me)
        db.session.commit()
        return {"unfollowed": True}
    return {"unfollowed": False}


# @login_required
@app.route("/friends", methods=["POST"])
@app.route("/following", methods=["POST"])
def followed_users():
    data = request.get_json()
    myemail = data["myemail"]
    me = User.query.filter_by(email=myemail).first()
    # following = current_user.following
    following = me.following
    users = []
    for followed in following:
        users.append(
            {"name": followed.name, "email": followed.email, "key": followed.id}
        )
    sorted_users = sorted(users, key=itemgetter("name"))
    return {"users": sorted_users}


# @login_required
@app.route("/followers", methods=["POST"])
def followers():
    data = request.get_json()
    myemail = data["myemail"]
    me = User.query.filter_by(email=myemail).first()
    # following = current_user.following
    followers = me.followers
    users = []
    for follower in followers:
        users.append(
            {"name": follower.name, "email": follower.email, "key": follower.id}
        )
    sorted_users = sorted(users, key=itemgetter("name"))
    return {"users": sorted_users}


@app.route("/notifications", methods=["POST"])
def notifications():
    data = request.get_json()
    myemail = data["myemail"]
    me = User.query.filter_by(email=myemail).first()
    my_notifications = me.notifications
    notifications = []
    for notification in my_notifications:
        notifications.append(
            {
                "body": notification.body,
                "datetime": notification.date_created.strftime("%d/%m %I:%M%p"),
                "new": notification.date_created > me.last_checked,
                "key": notification.id,
                "is_challenge": notification.type_challenge
            }
        )
    notifications.reverse()
    me.last_checked = datetime.now()
    db.session.commit()
    return {"notifications": notifications}


# @login_required
@app.route("/leaderboard", methods=["POST"])
def leaderboard():
    data = request.get_json()
    myemail = data["myemail"]
    me = User.query.filter_by(email=myemail).first()
    # following = current_user.following
    following = me.following
    users = []
    for followed in following:
        users.append(
            {
                "name": followed.name,
                "email": followed.email,
                "image": followed.image,
                "score": followed.score,
                "key": followed.id,
            }
        )
    users.append(
        {
            "name": me.name,
            "email": me.email,
            "image": me.image,
            "score": me.score,
            "key": len(following),
        }
    )
    sorted_users = sorted(users, key=itemgetter("score"), reverse=True)
    return {"users": sorted_users}


# @login_required
@app.route("/scoreboard", methods=["GET"])
def global_scoreboard():
    db_users = User.query.all()
    users = []
    for user in db_users:
        users.append(
            {
                "name": user.name,
                "email": user.email,
                "image": user.image,
                "score": user.score,
                "key": user.id,
            }
        )
    sorted_users = sorted(users, key=itemgetter("score"), reverse=True)
    return {"users": sorted_users}


# @login_required
@app.route("/challenge", methods=["POST"])
def challenge_user():
    data = request.get_json()
    myemail = data["myemail"]
    emails = data["emails"]
    video_id = int(data["video_id"])
    me = User.query.filter_by(email=myemail).first()
    mar = me.mouth_aspect_ratio
    video = Video.query.get(video_id)
    body = "{} has challenged you. Tap to accept!".format(me.name)
    ids = []
    for email in emails:
        user = User.query.filter_by(email=email).first()
        notification = Notification(body=body, user=user, date_created=datetime.now(), type_challenge=True)
        challenge = Challenge(
            creator=me, invited=user, video=video, date_created=datetime.now()
        )
        notification.challenge = challenge
        db.session.add(notification)
        db.session.commit()
        ids.append(str(challenge.id))
    ids = ",".join(ids)
    return {"challenges_ids": ids, 'mouth_aspect_ratio': mar}


@app.route("/acceptchallenge", methods=["POST"])
def accept_challenge():
    data = request.get_json()
    key = int(data["key"])
    notification = Notification.query.get(key)
    acceptor = notification.user
    challenge = notification.challenge
    video = challenge.video
    creator = challenge.creator
    # body = "{} has accepted your challenge.".format(acceptor.name)
    # send_notification = Notification(body=body, user=creator, date_created=datetime.now())
    # db.session.add(send_notification)
    # db.session.commit()
    return {
        "creator": creator.name,
        "video_uri": str(video.uri),
        "challenge_id": challenge.id,
        "mouth_aspect_ratio": acceptor.mouth_aspect_ratio
    }


@app.route("/submitchallenge/start", methods=["POST"])
def get_mouth_vertical_horizontal_distances():
    data = request.get_json()
    myemail = data["email"]
    me = User.query.filter_by(email=myemail).first()
    return {
        "mouth_aspect_ratio": me.mouth_aspect_ratio
    }


@app.route("/submitchallenge/sendvideo", methods=["POST"])
def submit_video():
    if "video" not in request.files:
        return {"video": "not found"}

    mar = request.form["mouth_aspect_ratio"] 
    video = request.files["video"] 
    video_name = secure_filename(video.filename)
    video.save(os.path.join(app.config["UPLOAD_FOLDER"], video_name))
    score = calc_video_score(video_name, float(mar))
    return {"score": score} #ba2olk 2l exists deh msh btb2a true msh btt8er 2slun 
    # la estana ht check leeh ok


@app.route("/submitchallenge/getscore", methods=["POST"])
def calculate_challenge_winner():
    data = request.get_json()
    myemail = data["email"]
    me = User.query.filter_by(email=myemail).first()
    score = data["score"]
    creator = data["creator"]

    if creator:
        ids = [int(id) for id in data["ids"].split(",")]
        for id in ids:
            challenge = Challenge.query.get(id)
            challenge.creator_score = score
        db.session.commit()
        return {"submitted": True}
    else:
        id = int(data["id"])
        challenge = Challenge.query.get(id)
        challenge.invited_score = score
        chalenge_creator = challenge.creator
        creator_state = "lost" if score > challenge.creator_score else "won"
        body = "You {} the challenge to {}".format(creator_state, me.name)
        send_notification = Notification(
            body=body, user=chalenge_creator, date_created=datetime.now()
        )
        if creator_state == "won":
            chalenge_creator.score += 50
        else:
            me.score += 50
        db.session.add(send_notification)
        db.session.commit()
        return {"state": "won" if score > challenge.creator_score else "lost"}


# @app.route('/submitchallenge', methods=['POST'])
# def submit_challenge():
#     myemail = request.form['email']
#     me = User.query.filter_by(email=myemail).first()
#     vert, hori = me.vertical_mouth_dist, me.horizontal_mouth_dist
#
#     if 'video' not in request.files:
#         return {'video': 'not found'}
#
#     try:
#         video = request.files['video']
#         video_name = secure_filename(video.filename)
#         video.save(os.path.join(app.config['UPLOAD_FOLDER'], video_name))
#         score = calc_video_score(video_name, vert, hori)
#
#         creator = request.form['creator']
#         if creator:
#             ids = [int(id) for id in request.form['ids'].split(',')]
#             for id in ids:
#                 challenge = Challenge.query.get(id)
#                 challenge.creator_score = score
#             db.session.commit()
#             return {'submitted': True}
#         else:
#             challenge = Challenge.query.get(id)
#             challenge.invited_score = score
#             chalenge_creator = challenge.creator
#             creator_state = 'lost' if score > challenge.creator_score else 'won'
#             body = "You {} the challenge to {}".format(creator_state, me.name)
#             send_notification = Notification(
#                 body=body, user=chalenge_creator, date_created=datetime.now())
#             if creator_state == 'won':
#                 chalenge_creator.score += 50
#             else:
#                 me.score += 50
#             db.session.add(send_notification)
#             db.session.commit()
#             return {'state': 'won' if score > challenge.creator_score else 'lost'}
#     except:
#         return {"submitted": False}


@app.route("/image/start", methods=["POST"])
def calc_mouth_vertical_horizontal_distances():
    if "image" not in request.files:
        return {"image": "not found"}

    image = request.files["image"]
    image_name = secure_filename(image.filename)
    image.save(os.path.join(app.config["UPLOAD_FOLDER"], image_name))
    mar = calc_video_score(image_name, video=False)
    os.remove(os.path.join(app.config["UPLOAD_FOLDER"], image_name))
    return {"mouth_aspect_ratio": mar}


@app.route("/image/end", methods=["POST"])
def set_mouth_vertical_horizontal_distances():
    data = request.get_json()
    myemail = data["email"]
    mar = data["mouth_aspect_ratio"]
    me = User.query.filter_by(email=myemail).first()
    me.mouth_aspect_ratio = float(mar)
    db.session.commit()
    return {"mar_set": True} 


# @app.route('/image', methods=['POST'])
# def get_horizontal_vertical_mouth_distances():
#     if 'image' not in request.files:
#         return {'image': 'not found'}
#
#     try:
#         image = request.files['image']
#         image_name = secure_filename(image.filename)
#         image.save(os.path.join(app.config['UPLOAD_FOLDER'], image_name))
#
#         myemail = request.form['email']
#         me = User.query.filter_by(email=myemail).first()
#         vert, hori = calc_video_score(image_name, video=False)
#         me.vertical_mouth_dist, me.horizontal_mouth_dist = vert, hori
#         db.session.commit()
#
#         os.remove(os.path.join(app.config['UPLOAD_FOLDER'], image_name))
#         return {'success': 'true'}
#     except:
#         return {'success': 'false'}


@app.route("/videos")
def get_all_videos():
    db_videos = Video.query.all()
    videos = []
    for video in db_videos:
        videos.append(
            {
                "key": video.id,
                "uri": video.uri,
                "name": video.name,
                "youtube_link": video.youtube_link,
            }
        )
    return {"videos": videos}


@app.route("/db")
def database():
    db.drop_all()
    db.create_all()
    # mido = User(name='mido', email='mido@rdq.com')
    # zeez = User(name='zeez', email='zeez@rdq.com')
    # samir = User(name='samir', email='samir@rdq.com')
    # marwan = User(name='marwan', email='marwan@rdq.com')
    # db.session.add_all([marwan, mido, zeez, samir])
    video1 = Video(
        uri="https://apec-eg.com/video/video1.mp4",
        youtube_link="https://www.youtube.com/watch?v=kh4y_AyX_1M",
    )
    video2 = Video(
        uri="https://apec-eg.com/video/video2.mp4",
        youtube_link="https://www.youtube.com/watch?v=p32OC97aNqc&t=53s",
    )
    db.session.add_all([video1, video2])
    db.session.commit()
    return "successful"


# @app.route('/uri', methods=['GET'])
# def uri():
#     data = request.get_json()
#     return render_template('video.html', data=data['uri'])
