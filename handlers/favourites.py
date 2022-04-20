from flask import Blueprint, request
import pytz
from datetime import datetime
from services.favouritesService import (
    setFavourites,
    removeFavourite,
    getFavourites
)

favourites = Blueprint("favourites", __name__)


@favourites.route("/setFavourite", methods=["POST"])
def setFavouriteHandler():
    data = request.json
    return setFavourites(data)

@favourites.route("/removeFavourite/<int:property_id>",methods=["DELETE"])
def removeFavourtieHandler(property_id):
    return removeFavourite(property_id)

# @favourites.route("/getFavourites/<string:cursor>",methods=["GET"])
@favourites.route("/getFavourites",methods=["GET"])
def getFavouritesHandler():
    return getFavourites()