from flask import Flask, redirect, url_for
from flask_login import login_required, logout_user, current_user
from models import db, login_manager
from oauth import blueprint
# from flask_dance.contrib.facebook import make_facebook_blueprint, facebook
from flask_dance.contrib.google import make_google_blueprint, google

app = Flask(__name__)
db.init_app(app)
login_manager.init_app(app)

app.config.from_object('config')

app.register_blueprint(blueprint, url_prefix='/login')

# facebook_blueprint = make_facebook_blueprint()
# app.register_blueprint(facebook_blueprint, url_prefix='/login')


@app.route('/')
def home():
    return "hola"


@app.route('/about')
@login_required
def about():
    return "hello " + current_user.email


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))
