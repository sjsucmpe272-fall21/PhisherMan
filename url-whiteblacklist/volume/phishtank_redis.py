
import redis
import requests
import json
import logging
import sys
from time import time

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler("/var/log/phishtank_redis.log")
sh = logging.StreamHandler(sys.stdout)
fh.setFormatter(logging.Formatter('[%(asctime)s] %(levelname)s [%(filename)s.%(funcName)s:%(lineno)d] %(message)s', datefmt='%a, %d %b %Y %H:%M:%S'))
logger.addHandler(fh)
logger.addHandler(sh)

try:
    r = redis.Redis(
        host="cmpe272.smhiz2.0001.usw1.cache.amazonaws.com",
        port=6379,
        db=0,
    )

    # Download in chunks due to MemoryError with large files
    # https://stackoverflow.com/questions/16694907/download-large-file-in-python-with-requests
    phishtank_json_bytes = bytearray()
    logging.info("Fetching phishtank JSON...")
    with requests.get(
        "https://data.phishtank.com/data/online-valid.json",
        stream=True,
    ) as res:
        res.raise_for_status()
        with open(f"/home/volume/phishtank-{int(time())}.json", 'wb') as fp:
            for chunk in res.iter_content(chunk_size=8192):
                phishtank_json_bytes += chunk
                fp.write(chunk)

    logging.info("Updating Redis entries...")

    for entry in json.loads(phishtank_json_bytes):
        r.set(entry["url"], 1)
    # Add an example url
    r.set("https://evil.com/", 1)

except Exception as e:
    logging.exception(e)
