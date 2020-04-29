from flask import Flask, redirect, url_for, render_template
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


@app.route('/')
def home():
    if current_user.is_authenticated:
        return "hello " + current_user.email
    else:
        return "hello nobody"


@app.route('/about')
@login_required
def about():
    # resp = facebook.get('/me')
    resp = google.get('/oauth2/v1/userinfo')
    return resp.json() if resp.ok else False


@app.route('/login')
def login():
    # return redirect(url_for("facebook.login"))
    return redirect(url_for("google.login"))

@app.route('/login/google/authorized')
def logged_in():
    resp = google.get('/oauth2/v1/userinfo')
    return resp.json() if resp.ok else False

@app.route('/zeez')
def zeez():
    return render_template('zeez.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    # return "logged out"
    return redirect(url_for('home'))
