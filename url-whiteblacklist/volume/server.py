
import redis
from flask import Flask, jsonify
from base64 import b64decode

r = redis.Redis(
    host="cmpe272.smhiz2.0001.usw1.cache.amazonaws.com",
    port=6379,
    db=0,
)
app = Flask(__name__)


@app.route("/check/<base64url>", methods=["GET"])
def check(base64url):
    try:
        decoded_url = b64decode(base64url)
        return jsonify({
            "malicious": bool(r.get(decoded_url)),
            "error": None,
        })
    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
        })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
