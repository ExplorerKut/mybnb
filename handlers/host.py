from flask import Blueprint, request
from datetime import datetime
from services.hostService import addProperty, registeredProperty,deleteProperty

host = Blueprint("host", __name__)


@host.route("/addProperty", methods=["POST"])
def addPropertyHandler():
    request_params = request.json
    data = {
        "property_name": request_params.get("property_name").lower(),
        "property_type": request_params.get("property_type").lower(),
        "property_description": request_params.get("property_description").lower(),
        "property_location": request_params.get("property_location").lower(),
        "property_address": request_params.get("property_address").lower(),
        "property_price": int(request_params.get("property_price")),
        "property_addDate": datetime.now(),
    }
    return addProperty(data)

@host.route("/getProperty/",defaults={"cursor":None},methods=["GET"])
@host.route("/getProperty/<string:cursor>",methods=["GET"])
def getPropertyHandler(cursor):
    return registeredProperty(cursor)

@host.route("/delete/<int:locationId>",methods=["DELETE"])
def deletePropertyHandler(locationId):
    return deleteProperty(locationId)