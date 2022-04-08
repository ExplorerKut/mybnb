from flask import Blueprint, request
from services.bookings import getBookings

bookings = Blueprint("bookings", __name__)


@bookings.route("/", defaults={"cursor": None}, methods=["GET"])
@bookings.route("/<string:cursor>", methods=["GET"])
def getBookingsHandler(cursor):
    return getBookings(cursor)
