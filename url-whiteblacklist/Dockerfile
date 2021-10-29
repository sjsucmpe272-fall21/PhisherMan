FROM python:3.10

WORKDIR /home

RUN python -m pip install --upgrade pip
RUN python -m pip install redis
RUN python -m pip install requests

RUN apt update -y && apt install cron vim -y

COPY daily_python_cronjob.txt .
RUN crontab daily_python_cronjob.txt && rm daily_python_cronjob.txt

COPY startup.sh .
CMD ["sh", "startup.sh"]
