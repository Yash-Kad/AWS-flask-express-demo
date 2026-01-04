from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route("/people", methods=["GET"])
def get_people():
    with open("details.json", "r") as file:
        data = json.load(file)
    return jsonify(data)

if __name__ == "__main__":
    app.run(port=5000,host="0.0.0.0",debug=True)
