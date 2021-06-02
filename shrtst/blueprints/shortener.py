from flask import Blueprint, redirect, jsonify, request, render_template
from shrtst.db import db
from shrtst.models import LinkShortener
from datetime import datetime as dt

shortener = Blueprint('shortener', __name__)


@shortener.route('/')
def home():
    return render_template('index.html')


@shortener.route('/shorten', methods=['POST'])
def shorten_url():
    original_url = request.form['url']
    link = LinkShortener(url=original_url)
    db.session.add(link)
    db.session.commit()

    return jsonify(
        suffix=link.suffix,
        url=link.url
    )


@shortener.route('/<suffix>')
def redirect_to_url(suffix):
    link = LinkShortener.query.filter_by(suffix=suffix).first_or_404()
    link.visits += 1
    db.session.commit()

    return redirect(link.url)


@shortener.route('/analytics/<suffix>', methods=['POST'])
def link_analytics(suffix):
    link = LinkShortener.query.filter_by(suffix=suffix).first_or_404()
    delta = dt.now() - link.date_created
    print((delta.seconds / 3600) / 24)
    vd_ratio = link.visits / ((delta.seconds / 3600) / 24)
    return jsonify(
        suffix=link.suffix,
        created=link.date_created.strftime('%d-%m-%Y'),
        visits=link.visits,
        url=link.url,
        vd="{:.2f}".format(vd_ratio)
    )
