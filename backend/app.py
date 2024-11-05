from flask import Flask, request, render_template, session, jsonify, Response
from flask_session import Session
import re
from models import *
from flask_paginate import Pagination, get_page_args
from datetime import datetime, timedelta
import mysql.connector
import os
import folium
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)