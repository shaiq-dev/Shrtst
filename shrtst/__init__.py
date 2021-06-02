from flask import Flask, render_template
from .config import Config
from .db import db
from .blueprints.shortener import shortener


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    app.register_blueprint(shortener)

    return app
