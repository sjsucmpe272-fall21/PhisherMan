### Docker

Pull the [repository](https://hub.docker.com/r/ramukm16/phisherman) using 

```sh
docker pull ramukm16/phisherman
```

Size of the image is 1.62GB

### To Run Flask API locally

Download the model from our [S3 bucket](https://phishermanml.s3.us-east-2.amazonaws.com/lstm_v12.h5) 

Then run the api with topdomains(for spellcheck) and D3 csv (for tokenizing) in the same folder

```sh
python3 flaskapi.py
```
