from flask import Blueprint
from services.locationService import getAllLocations

location = Blueprint("location", __name__)


@location.route("/", methods=["GET"])
def getAllLocationsHandler():
    return getAllLocations()
