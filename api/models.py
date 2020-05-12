from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
from datetime import datetime
from sqlalchemy.ext.associationproxy import association_proxy


db = SQLAlchemy()

followers = db.Table('followers',
                     db.Column('follower_id', db.Integer, db.ForeignKey(
                         'user.id'), primary_key=True),
                     db.Column('followed_id', db.Integer,
                               db.ForeignKey('user.id'), primary_key=True)
                     )


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image = db.Column(db.String(200), unique=True)
    score = db.Column(db.Integer, default=0)
    following = db.relationship('User', secondary=followers,
                                primaryjoin=(followers.c.follower_id == id),
                                secondaryjoin=(followers.c.followed_id == id),
                                backref=db.backref('followers', lazy='dynamic'),
                                lazy='dynamic')
    notifications = db.relationship('Notification', backref='user', lazy=True)
    last_checked = db.Column(db.DateTime, nullable=False, default=datetime.now())
    mouth_aspect_ratio = db.Column(db.Float, default=-1)
    exists = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<User {}>'.format(self.name)

    def is_following(self, user):
        return self.following.filter(
            followers.c.followed_id == user.id
        ).count() == 1

    def follow(self, user):
        if not self.is_following(user):
            self.following.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.following.remove(user)


class OAuth(OAuthConsumerMixin, db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    user = db.relationship(User)


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    body = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenge.id'), nullable=True)
    challenge = db.relationship('Challenge', lazy=True)
    type_challenge = db.Column(db.Boolean, default=False)


class Challenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    invited_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), nullable=False)
    video = db.relationship('Video', lazy=True)
    date_created = db.Column(db.DateTime, nullable=False)
    creator = db.relationship(User, primaryjoin=(
        creator_id == User.id), backref='challenges_created')
    invited = db.relationship(User, primaryjoin=(
        invited_id == User.id), backref='challenges_invited')
    creator_score = db.Column(db.Integer)
    invited_score = db.Column(db.Integer)

    def __repr__(self):
        return '<Challenge from {} to {}>'.format(self.creator, self.invited)


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uri = db.Column(db.String(80), nullable=False)
    name = db.Column(db.String(200), nullable=False, default="mod7ek khaleees mod7ek gidaaan")
    youtube_link = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return self.uri


# setup login manager
login_manager = LoginManager()
# login_manager.login_view = "facebook.login"
login_manager.login_view = "google.login"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
