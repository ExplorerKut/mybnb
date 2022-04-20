from urllib import response
from flask import request, jsonify

# from regex import F
# from requests import get
import bcrypt
from google.cloud import ndb
from google.cloud.ndb._datastore_query import Cursor
from models import User, Property, Bookings, Favourites
from app import client
from app import jwt
from datetime import datetime
from flask_jwt_extended import (
    create_access_token,
    unset_jwt_cookies,
    get_jwt_identity,
    jwt_required,
)


@jwt_required()
def setFavourites(data):
    with client.context():
        user_present = User.query(User.email == get_jwt_identity()).fetch()
        if len(user_present) != 0:

            is_favourites_present = (
                Favourites.query(Favourites.user_id == get_jwt_identity())
                .filter(Favourites.property_id == data["property_id"])
                .fetch()
            )
            if len(is_favourites_present) == 0:
                # print("here2")
                # ancestor_key=ndb.Key("User")
                favourites = Favourites(
                    user_id=get_jwt_identity(), property_id=data["property_id"]
                )
                favourites.put()
                return jsonify(
                    [{"status": "success", "message": "Favourite set Successfully"}]
                )
            else:
                return jsonify(
                    [{"status": "error", "message": "Favourite already set"}]
                )
        else:
            return jsonify([{"status": "error", "message": "User not Present"}])


@jwt_required()
def removeFavourite(property_id):
    with client.context():
        is_user_present = User.query(User.email == get_jwt_identity()).fetch()
        if len(is_user_present) != 0:
            is_favourites_present = (
                Favourites.query(Favourites.user_id == get_jwt_identity())
                .filter(Favourites.property_id == property_id)
                .fetch()
            )
            # print(is_favourites_present)
            if len(is_favourites_present) != 0:
                is_favourites_present[0].key.delete()
                return jsonify([{"status": "success", "message": "Favourite removed"}])
            else:
                return jsonify(
                    [{"status": "error", "message": "Favourite not present"}]
                )
        else:
            return jsonify(
                [{"status": "error", "message": "Favourite removed already"}]
            )


@jwt_required()
def getFavourites():
    with client.context():
        is_favourites_present = Favourites.query(
            Favourites.user_id == get_jwt_identity()
        ).fetch()
        if len(is_favourites_present) != 0:
            favourites = [ndb.Key(Property,entity.property_id) for entity in is_favourites_present]
            # get_properties=Property.query().fetch()
            # for i in range(0, len(favourites)):
            #     favourites[i] = ndb.Key(Property, favourites[i])
            # cursor = Cursor(urlsafe=cursor)
            # items, next_cursor, more_items = Property.query(Property.key.IN(favourites)).fetch_page(
            #     limit, start_cursor=cursor
            # )
            # # print(next_cursor.urlsafe())

            # items1, next_cursor1, more_items1 = (
            #     Property.query(Property.key.IN(favourites))
            #     .order(-Property.price)
            #     .fetch_page(limit, start_cursor=cursor)
            # )
            # next_cursor = None if not next_cursor else next_cursor.urlsafe()
            # next_cursor1 = None if not next_cursor1 else next_cursor1.urlsafe()
            response_data = []
            print(favourites)
            items = Property.query(Property.key.IN(favourites))
            # print(check)
            for entity in items:
                # print(entity)
                temp = {}
                print(entity.key.id())
                if entity.key in favourites:
                    print(entity)
                    temp["address"] = entity.address
                    temp["date_registered"] = entity.date_registered
                    temp["description"] = entity.description
                    temp["host_id"] = entity.host_id
                    temp["name"] = entity.name
                    temp["property_type"] = entity.property_type
                    temp["location"] = entity.location
                    temp["price"] = entity.price
                    temp["id"] = entity.key.id()
                    temp["favourite"] = True
                    response_data.append(temp)
            return jsonify([
                {
                    "status": "success",
                    "message": "Resource Found",
                    "response": response_data,
                    # "next_cursor": ""
                    # if not next_cursor
                    # else next_cursor.decode("utf-8"),
                    # "previous_cursor": ""
                    # if not next_cursor1
                    # else next_cursor1.decode("utf-8")
                    # "previous_cursor": previous_cursor,
                
                }]
            )
        else:
            return jsonify([{"status": "error","message":"No Favourites Present"}])
