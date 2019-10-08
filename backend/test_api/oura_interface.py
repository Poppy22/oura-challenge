import os
import requests
import json
from datetime import datetime

ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')
REFRESH_TOKEN = os.getenv('REFRESH_TOKEN')
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
BASE_URL = "https://api.ouraring.com/"
TYPE_SLEEP = "v1/sleep"
TYPE_ACTIVITY = "v1/activity"
TYPE_READINESS = "v1/readiness"
envrc = "../../.envrc"
ACCESS_TOKEN_KEY = "ACCESS_TOKEN"
REFRESH_TOKEN_KEY = "REFRESH_TOKEN"


def read_data():
    with open('input.json') as json_file:
        data = json.load(json_file)
        return data['sleep']


def refresh_access_token():
    url = BASE_URL + "oauth/token?grant_type=refresh_token&refresh_token="
    url += str(REFRESH_TOKEN)
    url += "&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET

    response = requests.post(url)
    if response.status_code != 200:
        return False  # it did not work

    response = response.content

    # write new access token and refresh token in envrc
    file_read = open(envrc, 'r')
    lines = file_read.readlines()
    file_read.close()
    file_write = open(envrc, 'w')

    file_write.writelines([item for item in lines[:-2]])
    file_write.writelines("export " + ACCESS_TOKEN_KEY + '=\"' + response[ACCESS_TOKEN_KEY.lower()] + "\"\n")
    file_write.writelines("export " + REFRESH_TOKEN_KEY + '=\"' + response[REFRESH_TOKEN_KEY.lower()] + "\"\n")
    file_write.close()

    return True


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


def get_sleep_data_mock(all_data, start_date, end_date=None):
    result = []
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    if end_date:
        end_date = datetime.strptime(end_date, "%Y-%m-%d")
    for d in all_data:
        if datetime.strptime(d['summary_date'], "%Y-%m-%d") >= start_date:
            if end_date:
                if datetime.strptime(d['summary_date'], "%Y-%m-%d") <= end_date:
                    result.append(d)
            else:
                result.append(d)
    return result


def get_piechart_data(last_data):
    return {'rem': last_data['rem'],
            'deep': last_data['deep'],
            'light': last_data['light'],
            'awake': last_data['awake']}


def compute_performance(all_data):
    return 0


def compute_best_day(all_data):
    return 0


def get_activity_data(start_date, end_date=None):
    url = build_url(TYPE_ACTIVITY, start_date, end_date)
    return requests.get(url, headers={'Authorization': "Bearer " + ACCESS_TOKEN}).json()


def get_readiness_data(start_date, end_date=None):
    url = build_url(TYPE_READINESS, start_date, end_date)
    return requests.get(url, headers={'Authorization': "Bearer " + ACCESS_TOKEN}).json()
