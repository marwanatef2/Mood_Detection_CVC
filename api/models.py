from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
from datetime import datetime


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
    score = db.Column(db.Integer)
    following = db.relationship('User', secondary=followers,
                                primaryjoin=(followers.c.follower_id == id),
                                secondaryjoin=(followers.c.followed_id == id),
                                backref=db.backref('followers', lazy='dynamic'), lazy='dynamic')
    notifications = db.relationship('Notification', backref='user', lazy=True)
    last_checked = db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __repr__(self):
        return '<User {}>'.format(self.email)

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


# setup login manager
login_manager = LoginManager()
# login_manager.login_view = "facebook.login"
login_manager.login_view = "google.login"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
