from flask import Blueprint, request
from services.locationService import getAllLocations, searchLocation

location = Blueprint("location", __name__)


def timeConverter(timezone, current_time):
    format = "%Y-%m-%dT%H:%M:%S.%f%z"
    current_time = current_time.replace(tzinfo=pytz.UTC)
    current_time = current_time.astimezone(timezone).replace(tzinfo=None)
    return current_time


@location.route("/", methods=["GET"])
def getAllLocationsHandler():
    return getAllLocations()


@location.route("/search", methods=["GET"])
def getSearchLocation():
    location = request.args.get("location")
    check_in = request.args.get("checkin")
    check_out = request.args.get("checkout")
    check_in = None if check_in == "" else float(check_in)
    check_out = None if check_out == "" else float(check_out)
    data = {"location": location, "check_in": check_in, "check_out": check_out}
    return searchLocation(data)

