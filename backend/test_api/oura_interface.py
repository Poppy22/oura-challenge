import os
import requests

ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')
REFRESH_TOKEN = os.getenv('REFRESH_TOKEN')


def get_sleep_data():
    json = requests.get('https://api.ouraring.com/v1/sleep?start=2019-01-01&end=2019-09-19',
                        headers={
        'Authorization': ACCESS_TOKEN
    })
    print(json)
    return None

