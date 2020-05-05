from flask_login import current_user, login_user
# from flask_dance.contrib.facebook import make_facebook_blueprint
from flask_dance.contrib.google import make_google_blueprint
from flask_dance.consumer import oauth_authorized, oauth_error
from flask_dance.consumer.storage.sqla import SQLAlchemyStorage
from sqlalchemy.orm.exc import NoResultFound
from models import db, User, OAuth


# blueprint = make_facebook_blueprint(
#     storage=SQLAlchemyStorage(OAuth, db.session, user=current_user)
# )
blueprint = make_google_blueprint(
    scope=['email', 'profile'],
    storage=SQLAlchemyStorage(OAuth, db.session, user=current_user)
)


# create/login local user on successful OAuth login
@oauth_authorized.connect_via(blueprint)
def google_logged_in(blueprint, token):
    if not token:
        return False

    # resp = blueprint.session.get("/me")
    resp = blueprint.session.get("/oauth2/v1/userinfo")
    if not resp.ok:
        return False

    user_info = resp.json()
    user_email = user_info["email"]
    user_name = user_info["name"]
    user_picture = user_info['picture']

    query = User.query.filter_by(email=user_email)
    try:
        user = query.one()
    except NoResultFound:
        user = User(email=user_email, name=user_name, image=user_picture)

    db.session.add(user)
    db.session.commit()

    login_user(user)
