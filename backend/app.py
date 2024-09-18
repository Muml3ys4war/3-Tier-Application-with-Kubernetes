from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import os

app = Flask(__name__)

# Connection details for Mongo Database
m_host = os.environ.get('MONGO_DB_HOST', 'localhost')
m_port = os.environ.get('MONGO_DB_PORT', 27017)
m_user = os.environ.get('MONGO_DB_USER', '')
m_pass = os.environ.get('MONGO_DB_PASS', '')

if m_user and m_pass:
    uri = f'mongodb://{m_user}:{m_pass}@{m_host}:{m_port}/'
else:
    uri = f'mongodb://{m_host}:{m_port}/'

# connecting to local instance
client = MongoClient(uri)

# database name
db = client['chatApp']

# messages collection
mesg_collection = db['mesg']


@app.route('/send-message', methods=['POST'])
def send_mesg():
    data = request.json
    username = data.get('Username')
    mesg = data.get('message')

    if not username or not mesg:
        return jsonify({'err': 'Missing Parameters'}), 400

    new_msg = {
        'username': username,
        'message': mesg,
        'createdAt': datetime.utcnow().isoformat()
    }

    mesg_collection.insert_one(new_msg)
    return jsonify({'message': 'Message Sent'}), 201


@app.route('/messages', methods=['GET'])
def get_mesg():
    mesgs = list(mesg_collection.find().sort('createdAt', 1))

    for mesg in mesgs:
        mesg['_id'] = str(mesg['_id'])

    return jsonify(mesgs), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
