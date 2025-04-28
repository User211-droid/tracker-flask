from flask import Flask, request, send_file, render_template
import datetime
import os
from user_agents import parse

app = Flask(__name__)

@app.route('/error')
def error_page():
    return render_template('error.html')

@app.route('/collect')
def collect():
    ip = request.remote_addr
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = dict(request.args)
    logline = f"{ts} | IP: {ip} | DATA: {data}\n"
    with open("advanced_logs.txt", "a") as f:
        f.write(logline)
    return send_file('transparent.gif', mimetype='image/gif')

@app.route('/')
def home():
    return "Tracker is live."

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 8080)))
