from os import environ
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI')
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True
SECRET_KEY = environ.get('SECRET_KEY')
UPLOAD_FOLDER = environ.get('UPLOAD_FOLDER')
# FACEBOOK_OAUTH_CLIENT_ID = environ.get('FACEBOOK_OAUTH_CLIENT_ID')
# FACEBOOK_OAUTH_CLIENT_SECRET = environ.get('FACEBOOK_OAUTH_CLIENT_SECRET')
# GITHUB_OAUTH_CLIENT_ID = environ.get('GITHUB_OAUTH_CLIENT_ID')
# GITHUB_OAUTH_CLIENT_SECRET = environ.get('GITHUB_OAUTH_CLIENT_SECRET')
GOOGLE_OAUTH_CLIENT_ID = environ.get('GOOGLE_OAUTH_CLIENT_ID')
GOOGLE_OAUTH_CLIENT_SECRET = environ.get('GOOGLE_OAUTH_CLIENT_SECRET')
