from flask import Flask

app = Flask(__name__)

@app.route('/api')
def get_team_name():
    return {'name': "Tito"}
