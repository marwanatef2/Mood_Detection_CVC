from flask_login import current_user, login_user
from flask_dance.contrib.facebook import make_facebook_blueprint
from flask_dance.consumer import oauth_authorized, oauth_error
from flask_dance.consumer.storage.sqla import SQLAlchemyStorage
from sqlalchemy.orm.exc import NoResultFound
from models import db, User, OAuth


blueprint = make_facebook_blueprint(
    storage=SQLAlchemyStorage(OAuth, db.session, user=current_user)
)


# create/login local user on successful OAuth login
@oauth_authorized.connect_via(blueprint)
def facebook_logged_in(blueprint, token):
    if not token:
        return False

    profile = blueprint.session.get("/me")
    if not profile.ok:
        return False

    user_info = profile.json()
    user_id = user_info["id"]

    # Find this OAuth token in the database, or create it
    query = OAuth.query.filter_by(user_id=user_id)
    try:
        oauth = query.one()
    except NoResultFound:
        oauth = OAuth(token=token)

    if oauth.user:
        login_user(oauth.user)

    else:
        # Create a new local user account for this user
        user = User(id=user_id, name=user_info["name"], email=user_info["email"])
        # Associate the new local user account with the OAuth token
        oauth.user = user
        # Save and commit our database models
        db.session.add_all([user, oauth])
        db.session.commit()
        # Log in the new local user account
        login_user(user)

    # Disable Flask-Dance's default behavior for saving the OAuth token
    return False
