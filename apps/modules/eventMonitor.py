import json
from bson import json_util
from flask import Blueprint, request
from werkzeug import Response

# from apps import mongo

mod_eventMonitor = Blueprint('eventMonitor', __name__)


@mod_eventMonitor.route('/api/eventMonitors/<id>', methods=['GET'])
def eventMonitor(id):
    result = mongo['EventMonitor']['EventMonitor'].find_one({"_id": id})
    return Response(json.dumps(result, default=json_util.default), mimetype='application/json')


@mod_eventMonitor.route('/api/eventMonitors', methods=['GET', 'POST'])
def eventMonitors():
    if request.method == 'POST':
        eventMonitor = request.json
        result = mongo['EventMonitor']['EventMonitor'].insert(eventMonitor)
        return Response(json.dumps(result, default=json_util.default), mimetype='application/json')

    if request.method == 'GET':
        eventMonitors = []
        cursor = mongo['EventMonitor']['EventMonitor'].find();
        for monitor in cursor:
            eventMonitors.append(monitor)

        return Response(json.dumps(eventMonitors, default=json_util.default), mimetype='application/json')


def getEventsCount(monitorId, monitoringStart, accountId):
    if monitorId == "m1":
        return 5
    if monitorId == "m2":
        return 20
    if monitorId == "m3":
        return 12
    if monitorId == "m4":
        return mongo['EventMonitor']['Device'].count({"accountId": accountId, "enrollDate": {"$gt": monitoringStart}})
