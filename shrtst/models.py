import string
from datetime import datetime
from random import choices

from .db import db


class LinkShortener(db.Model):
    __tablename__ = 'suffix_table'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(512))
    suffix = db.Column(db.String(4), unique=True)
    visits = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.suffix = self.generate_suffix()

    def generate_suffix(self):
        characters = string.digits + string.ascii_letters
        suffix = ''.join(choices(characters, k=4))

        link = self.query.filter_by(suffix=suffix).first()

        if link:
            return self.generate_suffix()

        return suffix
