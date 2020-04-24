from flask import Flask, redirect, url_for
from flask_login import login_required, logout_user
from models import db, login_manager
from oauth import blueprint
# from config import *

app = Flask(__name__)
db.init_app(app)
login_manager.init_app(app)

app.config.from_object('config')

app.register_blueprint(blueprint, url_prefix='/login')


@app.route('/')
def home():
    # db.create_all()
    return "home sweet home"


@app.route('/about')
@login_required
def about():
    return "HELLO"


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))
# @app.route('/api')
# def get_team_name():
#     return {'name': "Tito"}
