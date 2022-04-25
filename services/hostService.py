from flask import request, jsonify
import bcrypt
from models import User, Property
from app import client
from app import jwt
from google.cloud.ndb._datastore_query import Cursor
from flask_jwt_extended import (
    create_access_token,
    unset_jwt_cookies,
    get_jwt_identity,
    jwt_required,
)


@jwt_required()
def addProperty(data):
    host_id = get_jwt_identity()
    try:
        with client.context():
            property_already_registered = (
                True
                if len(
                    Property.query(
                        Property.address == data.get("property_address"),
                        Property.location == data.get("property_location"),
                    ).fetch()
                )
                > 0
                else False
            )
            if not property_already_registered:
                property_details = Property(
                    name=data.get("property_name"),
                    host_id=data.get("host_id"),
                    property_type=data.get("property_type"),
                    address=data.get("property_address"),
                    description=data.get("property_description"),
                    location=data.get("property_location"),
                    date_registered=data.get("property_addDate"),
                    price=data.get("property_price"),
                )
                property_details.put()
                return jsonify(
                    [
                        {
                            "status": "success",
                            "message": "Property Successfully registered",
                        }
                    ]
                )
            else:
                return jsonify(
                    [
                        {
                            "status": "error",
                            "message": "Property with the same address already registered",
                        }
                    ]
                )
    except:
        return jsonify(
            [{"status": "error", "message": "Could Not initiate datastore client"}]
        )


@jwt_required()
def registeredProperty(cursor, limit=5):
    host_id = get_jwt_identity()
    with client.context():
        # previous_cursor
        cursor = Cursor(urlsafe=cursor)
        # previous_cursor = cursor.urlsafe()
        items, next_cursor, more_items = (
            Property.query(Property.host_id == host_id)
            .order(Property.date_registered)
            .fetch_page(limit, start_cursor=cursor)
        )
        # print(next_cursor.urlsafe())
        items1, next_cursor1, more_items1 = (
            Property.query(Property.host_id == host_id)
            .order(-Property.date_registered)
            .fetch_page(limit, start_cursor=cursor)
        )
        # print(next_cursor1.urlsafe())

        # items.reverse()
        next_cursor = None if not next_cursor else next_cursor.urlsafe()
        next_cursor1 = None if not next_cursor1 else next_cursor1.urlsafe()
        # previous_cursor = None if not cursor else cursor.urlsafe()
        if len(items) > 0:
            send_data = []
            send_data2 = []
            for entity in items:
                # print(entity.key.id)
                temp = {}
                temp["date"] = entity.date_registered
                # temp["booking_id"] = entity.key.id()
                temp["property_name"] = entity.name
                temp["property_location"] = entity.location
                temp["property_id"] = entity.key.id()
                temp["property_type"] = entity.property_type
                # temp["check_in"] = entity.check_in
                # temp["check_out"] = entity.check_out
                temp["price"] = entity.price
                send_data.append(temp)

            # send_data = sorted(send_data, key=lambda entity: entity["check_in"])
            # print("-=======")
            # print(cursor)
            return jsonify(
                {
                    "status": "success",
                    "message": "Resource Found",
                    "data": send_data,
                    "next_cursor": ""
                    if not next_cursor
                    else next_cursor.decode("utf-8"),
                    "previous_cursor": ""
                    if not next_cursor1
                    else next_cursor1.decode("utf-8")
                    # "previous_cursor": previous_cursor,
                }
            )
        else:
            return jsonify({"status": "error", "message": "No Property for this user"})


@jwt_required()
def deleteProperty(locationId):
    with client.context():
        is_property_present = Property.get_by_id(locationId)
        if is_property_present:
            is_property_present.key.delete()
            return jsonify({"status": "success", "message": "deleted Successfully"})
        else:
            return jsonify(
                {"status": "error", "message": "error while deleting property"}
            )
