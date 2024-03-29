from calendar import c
from flask import request, jsonify
from models import Bookings, Property
from google.cloud.ndb._datastore_query import Cursor

# from google.cloud.ndb
from app import client
from app import jwt
from flask_jwt_extended import (
    create_access_token,
    unset_jwt_cookies,
    get_jwt_identity,
    jwt_required,
)


@jwt_required()
def getBookings(cursor, limit=5):
    # try:
    with client.context():
        # previous_cursor
        cursor = Cursor(urlsafe=cursor)
        items, next_cursor, more_items = (
            Bookings.query(Bookings.booker_id == get_jwt_identity())
            .order(Bookings.check_in)
            .fetch_page(limit, start_cursor=cursor)
        )
        # print(next_cursor.urlsafe())
        items1, next_cursor1, more_items1 = (
            Bookings.query(Bookings.booker_id == get_jwt_identity())
            .order(-Bookings.check_in)
            .fetch_page(limit, start_cursor=cursor)
        )

        next_cursor = None if not next_cursor else next_cursor.urlsafe()
        next_cursor1 = None if not next_cursor1 else next_cursor1.urlsafe()

        if len(items) > 0:
            send_data = []
            send_data2 = []
            for entity in items:
                # print(entity.key.id)
                property_details=   Property.get_by_id(entity.property_id)
                if property_details:
                    temp = {}
                    temp["date"] = entity.booking_date
                    temp["booking_id"] = entity.key.id()
                    temp["property_name"] = property_details.name
                    temp["property_location"]= property_details.location
                    temp["property_id"]= entity.property_id
                    temp["check_in"] = entity.check_in
                    temp["check_out"] = entity.check_out
                    temp["price"] = entity.total_paid
                    # temp["status"]=[Date Passed]
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
            print(next_cursor)
            print(next_cursor1)
            return jsonify({"status": "error",
            "next_cursor": "",
            "previous_cursor": ""
                    if not next_cursor1
                    else next_cursor1.decode("utf-8")
            ,"message": "No bookings for this user"})
    # except:
    #     return jsonify({"status": "error", "message": "Error with datastore client"})
