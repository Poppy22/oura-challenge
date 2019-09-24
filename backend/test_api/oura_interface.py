import os
import requests

ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')
REFRESH_TOKEN = os.getenv('REFRESH_TOKEN')
BASE_URL = "https://api.ouraring.com/"
TYPE_SLEEP = "v1/sleep"
TYPE_ACTIVITY = "v1/activity"
TYPE_READINESS = "v1/readiness"


def get_new_refresh_token(refresh_token, client_id, client_secret):
    url = BASE_URL + "oauth/token?grant_type=refresh_token&refresh_token="
    url += refresh_token
    url += "&client_id=" + client_id + "&client_secret=" + client_secret
    return requests.post(url)


def get_user_info():
    return requests.get(BASE_URL + "userinfo",
                        headers={'Authorization': "Bearer " + ACCESS_TOKEN}).json()


def build_url(url_type, start_date, end_date=None):
    # end date can be ommitted
    url = BASE_URL + url_type + "?start=" + start_date
    if end_date:
        url += '&end=' + end_date
    return url


def get_sleep_data(start_date, end_date=None):
    url = build_url(TYPE_SLEEP, start_date, end_date)
    return requests.get(url, headers={'Authorization': "Bearer " + ACCESS_TOKEN}).json()


def get_activity_data(start_date, end_date=None):
    url = build_url(TYPE_ACTIVITY, start_date, end_date)
    return requests.get(url, headers={'Authorization': "Bearer " + ACCESS_TOKEN}).json()


def get_readiness_data(start_date, end_date=None):
    url = build_url(TYPE_READINESS, start_date, end_date)
    return requests.get(url, headers={'Authorization': "Bearer " + ACCESS_TOKEN}).json()
