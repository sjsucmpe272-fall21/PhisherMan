import json
import requests
import base64

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
    print(f"Testing '{base64.b64decode(url).decode('utf-8')}'")
    res = requests.post(
        'http://52.25.220.51/predict',
        data=json.dumps({
            'url': base64.b64decode(url).decode('utf-8'),
        })
    )
    print(res.text)
    if res.status_code==200:
        ret = res.json()
        return {
            'malicious': ret['predictions'][0]['malicious percentage']>70.0,
            'confidence': ret['predictions'][0]['malicious percentage'],
            'spell_check': ret['predictions'][0]['spell_check'],
        }

    return {
        'malicious': False,
        'confidence': -1,
        'spell_check': None,
    }

def lambda_handler(event, context):
    try:
        if 'httpMethod' in event:
            if event['httpMethod'] == 'GET':
                base64url = event['pathParameters']['base64url']
                res = detect(base64url)
                return respond(None, {
                    'malicious': res['malicious'],
                    'confidence': res['confidence'],
                    'spell_check': res['spell_check'],
                })
            else:
                return respond(ValueError('Unsupported method "{}"'.format(event['httpMethod'])))
        else:
            return respond(ValueError('Invoked with non-HTTP request'))
    except Exception as e:
        print(e)
        return respond(Exception("Error"))
