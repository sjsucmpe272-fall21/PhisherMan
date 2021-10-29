#!/bin/bash

service cron start;
python volume/phishtank_redis.py;
sleep infinity; # Docker needs something to run in the background to keep the machine running
