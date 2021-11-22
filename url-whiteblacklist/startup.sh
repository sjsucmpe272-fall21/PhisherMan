#!/bin/bash

service cron start;
python volume/phishtank_redis.py;
python volume/server.py;
