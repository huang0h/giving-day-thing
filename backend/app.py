from flask import Flask, request

app = Flask(__name__)

@app.post("/")
def get_response():
  body = request.get_json()
  
  match body['prompt']:
    case "test":
      return {"some": "data"}
    case _:
      return {"fallback": "fallback"}