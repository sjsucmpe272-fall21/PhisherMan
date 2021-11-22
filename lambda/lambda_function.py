import json
import requests

print('Loading function')

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': str(err) if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
        },
    }

def detect(url):
    res = requests.get(f'http://54.67.112.73:8080/check/{url}')
    if res.status_code==200:
        ret = res.json()
        return ret['malicious'] if 'malicious' in ret and not ret['error'] else False
    return False

def lambda_handler(event, context):

    try:
        if 'httpMethod' in event:
            if event['httpMethod'] == 'GET':
                base64url = event['pathParameters']['base64url']
                return respond(None, {
                    'malicious': detect(base64url),
                })
            else:
                return respond(ValueError('Unsupported method "{}"'.format(operation)))
        else:
            return respond(ValueError('Invoked with non-HTTP request'))
    except Exception as e:
        print(e)
        return respond(Exception("Error"))
