# README

To run:
```
docker-compose up
```

- Runs Redis to use as our whitelist/blacklist filter
- Runs a cronjob everyday at 00:00 that fetches the Phishtank database (phishtank_redis.py) and updates Redis with the new data
    - Logs about the fetching are saved to `/var/log/phishtank_redis.log`
