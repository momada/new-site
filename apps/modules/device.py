import json
from datetime import datetime
from bson import json_util
from flask import Blueprint, request
from werkzeug import Response
#from apps import mongo

mod_device = Blueprint('device', __name__)


@mod_device.route('/api/devices', methods=['POST'])
def devices():
    if request.method == 'POST':
        device = request.json
        device['enrollDate'] = datetime.now()

        mongo['EventMonitor']['Device'].insert(device)

        return Response(json.dumps({}, default=json_util.default), mimetype='application/json')
