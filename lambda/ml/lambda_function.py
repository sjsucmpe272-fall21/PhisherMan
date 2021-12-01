import json
import requests

print('Loading function')

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': str(err) if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    }

def detect(url):
    res = requests.post(
        'http://52.25.220.51/predict',
        data=json.dumps({
            'url': url,
        })
    )
    print(res.text)
    if res.status_code==200:
        ret = res.json()
        return ret['predictions'][0]['malicious percentage']>50.0
    return False

# ML model: 52.25.220.51

def lambda_handler(event, context):
    try:
        if 'httpMethod' in event:
            if event['httpMethod'] == 'GET':
                base64url = event['pathParameters']['base64url']
                return respond(None, {
                    'malicious': detect(base64url),
                })
            else:
                return respond(ValueError('Unsupported method "{}"'.format(event['httpMethod'])))
        else:
            return respond(ValueError('Invoked with non-HTTP request'))
    except Exception as e:
        print(e)
        return respond(Exception("Error"))
