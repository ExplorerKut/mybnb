from email.policy import default
from flask import Blueprint, request
import pytz
from datetime import datetime
from services.locationService import (
    getPlaces,
    getDescription,
    getPlaceAvailability,
    bookPlace,
)

places = Blueprint("places", __name__)


def timeConverter(timezone, current_time):
    format = "%Y-%m-%dT%H:%M:%S.%f%z"
    current_time = current_time.replace(tzinfo=pytz.UTC)
    current_time = current_time.astimezone(timezone).replace(tzinfo=None)
    return current_time




@places.route("/",defaults={"locationName": ""},methods=["GET"])
@places.route("/<string:locationName>", methods=["GET"])
def getPlacesHandler(locationName):

    return getPlaces(locationName.lower())


@places.route("/<string:locationName>/<int:locationId>", methods=["GET"])
def getDescriptionHandler(locationName, locationId):
    # print("fuck it")
    return getDescription(locationName, locationId)


@places.route("/<string:locationName>/<int:locationId>/check", methods=["GET"])
def getLocationAvailabilityHandler(locationName, locationId):
    return getPlaceAvailability(locationName.lower(), locationId)


@places.route("/<string:locationName>/<int:locationId>/book", methods=["POST"])
def bookPlaceHandler(locationName, locationId):
    request_params = request.json
    # print(request_params)
    format = "%Y-%m-%dT%H:%M:%S.%fZ"
    format1 = "%Y-%m-%dT%H:%M:%S.%f%z"
    tz = pytz.timezone(request_params.get("timezone"))
    # booker_id = request_params.get("host_id")
    property_id = request_params.get("id")
    booking_date = datetime.strptime(
        request_params.get("booking_date"), format
    )  # .astimezone(tz)
    booking_date = timeConverter(tz, booking_date)
    # print(booking_date)
    check_in = datetime.strptime(request_params.get("check_in"), format)
    check_in = timeConverter(tz, check_in).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    check_out = datetime.strptime(
        request_params.get("check_out"), "%Y-%m-%dT%H:%M:%S.%fZ"
    )
    check_out = timeConverter(tz, check_out).replace(
        hour=23, minute=59, second=59, microsecond=0
    )

    total_paid = request_params.get("price")
    data = {
        # "booker_id": booker_id,
        "property_id": property_id,
        "booking_date": booking_date,
        "check_in": check_in,
        "check_out": check_out,
        "total_paid": total_paid,
    }
    return bookPlace(data)
