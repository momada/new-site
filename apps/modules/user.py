import json
import re
import sys
from datetime import datetime
from bson import json_util
from flask import Blueprint, request
from werkzeug import Response
#from apps import mongo
from apps.modules.eventMonitor import getEventsCount

mod_user = Blueprint('user', __name__)

@mod_user.route('/api/user/authentication', methods=['POST'])
def authentication():
    user = request.json
    print >> sys.stderr, user['username']
    print >> sys.stderr, user['password']
#    db = mongo['news']
#    validUserCount = db['User'].find({"username": re.compile(user['username'], re.IGNORECASE),"password":user['password']}).count()
#    if validUserCount == 0:
#        return Response(
#            'Login failed', 401,
#            {'WWW-Authenticate': 'Basic realm="Login Required"'})

#    result = db['User'].find_one(
#        {"username": re.compile(user['username'], re.IGNORECASE), "password": user['password']})
    result=[]
    for m in result["monitors"]:
        eventmonitor = db['EventMonitor'].find_one({"_id": m["monitorId"]})
        m["name"] = eventmonitor["name"]
        m["icon"] = eventmonitor["icon"]
        m["icon-color"] = eventmonitor["icon-color"]
        m["count"] = getEventsCount(m["monitorId"], m["monitoringStarts"], result["accountId"])
    return Response(json.dumps(result, default=json_util.default), mimetype='application/json')


@mod_user.route('/api/user/resetMonitor', methods=['POST'])
def restMonitor():
    requestdata = request.json
    newMonitoringStarts = datetime.now()
    query = {"_id": requestdata["userId"], "monitors.monitorId": requestdata["monitorId"]}
    updateset = {"$set": {"monitors.$.monitoringStarts": newMonitoringStarts}}
    mongo['EventMonitor']['User'].update_one(query, updateset);

    return Response(json.dumps({"newMonitoringStarts": newMonitoringStarts}, default=json_util.default),
                    mimetype='application/json')


@mod_user.route('/api/user/refreshMonitor', methods=['POST'])
def refreshMonitor():
    requestdata = request.json
    newMonitoringStarts = datetime.now()
    query = {"_id": requestdata["userId"], "monitors.monitorId": requestdata["monitorId"]}
    newCount = 0
    foundUser = mongo['EventMonitor']['User'].find_one(query);
    for m in foundUser["monitors"]:
        if m["monitorId"] == requestdata["monitorId"]:
            newCount = getEventsCount(m["monitorId"], m["monitoringStarts"], foundUser["accountId"])

    return Response(
        json.dumps({"monitorId": requestdata["monitorId"], "newCount": newCount}, default=json_util.default),
        mimetype='application/json')

@mod_user.route('/api/user/monitors', methods=['POST'])
def updateMonitorSetting():

    requestdata = request.json
    #print (requestdata  , file=sys.stderr)
    userId = requestdata["userId"]
    selectedMoniterIds = requestdata["selectedIds"]

    newMonitoringStarts = datetime.now()
    query = {"_id": userId}

    foundUser = mongo['EventMonitor']['User'].find_one(query);

    newMonitorList = [];
    #print (selectedMoniterIds  , file=sys.stderr)
    for mId in selectedMoniterIds:
        oldM = getMonitorInListById(foundUser["monitors"],mId)
        if oldM==None:
            newMonitorList.append({"monitorId":mId,"monitoringStarts":datetime.now()})
        else:
            newMonitorList.append(oldM)

    foundUser["monitors"] = newMonitorList

    mongo['EventMonitor']['User'].save(foundUser);

    for m in foundUser["monitors"]:
        eventmonitor = mongo['EventMonitor']['EventMonitor'].find_one({"_id": m["monitorId"]})
        m["name"] = eventmonitor["name"]
        m["icon"] = eventmonitor["icon"]
        m["icon-color"] = eventmonitor["icon-color"]
        m["count"] = getEventsCount(m["monitorId"], m["monitoringStarts"], foundUser["accountId"])

    return Response(
        json.dumps(foundUser, default=json_util.default),
        mimetype='application/json')

def getMonitorInListById(monitorList,monitorId):
    for monitor in monitorList:
        if monitor['monitorId']==monitorId:
            return monitor
    return None
