from flask import request, jsonify

from google.cloud import ndb
from google.cloud.ndb._datastore_query import Cursor
from models import User, Property, Bookings, Favourites, Reviews
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
def postReview(data):
    print("===========")
    print(data)
    with client.context():
        is_location_present = Property.get_by_id(data.get("locationId"))
        if is_location_present:
            has_user_booked_property = Bookings.query(
                Bookings.booker_id == get_jwt_identity(),
                Bookings.property_id == data.get("locationId"),
            ).fetch()
            if len(has_user_booked_property) > 0:
                has_reviewed_before = Reviews.query(
                    Reviews.posted_by == get_jwt_identity()
                ).fetch()
                if len(has_reviewed_before) == 0:
                    review = Reviews(
                        property_id=data.get("locationId"),
                        cleanliness=data.get("cleanliness"),
                        location=data.get("location"),
                        check_in=data.get("check_in"),
                        value=data.get("value"),
                        accuracy=data.get("accuracy"),
                        review=data.get("review"),
                        posted_by=get_jwt_identity(),
                        posting_date=data.get("posting_date"),
                    )
                    review.put()
                    return jsonify(
                        {"status": "success", "message": "Posted successfully"}
                    )
                else:
                    return jsonify({"status": "error", "message": "Already Posted"})
            else:
                return jsonify(
                    {
                        "status": "error",
                        "message": "Please book the place first to review",
                    }
                )
        else:
            return jsonify({"status": "error", "message": "No property present"})
    return jsonify({"status": "error", "message": "Datastore error"})


def getReviews(propertyId, cursor, limit=5):
    with client.context():
        cursor = Cursor(urlsafe=cursor)
        is_property_present = Property.get_by_id(propertyId)
        if is_property_present:
            reviews, next_cursor, more_items = (
                Reviews.query(Reviews.property_id == propertyId)
                .order(Reviews.posting_date)
                .fetch_page(limit, start_cursor=cursor)
            )
            reviews_previous, previous_cursor, more_item_previous = (
                Reviews.query(Reviews.property_id == propertyId)
                .order(-Reviews.posting_date)
                .fetch_page(limit, start_cursor=cursor)
            )
            next_cursor = None if not next_cursor else next_cursor.urlsafe()
            previous_cursor = None if not previous_cursor else previous_cursor.urlsafe()
            print(reviews)
            if len(reviews) > 0:
                send_data = []
                cleanliness = 0
                location = 0
                value = 0
                check_in = 0
                accuracy = 0
                for entity in reviews:
                    temp = {}
                    temp["review"] = entity.review
                    temp["posted_by"] = entity.posted_by
                    temp["posting_date"] = entity.posting_date
                    cleanliness += entity.cleanliness
                    location += entity.cleanliness
                    value += entity.value
                    accuracy += entity.accuracy
                    check_in += entity.check_in
                    send_data.append(temp)
                review_average_overall = (
                    cleanliness + location + value + accuracy + check_in
                ) / len(reviews)
                no_of_reviews = len(reviews)
                reviewAverage = {
                    "reviewAverage": review_average_overall,
                    "cleanliness": cleanliness / no_of_reviews,
                    "location": location / no_of_reviews,
                    "accuracy": accuracy / no_of_reviews,
                    "check_in": check_in / no_of_reviews,
                    "value": value / no_of_reviews,
                }
                return jsonify(
                    {
                        "status": "success",
                        "message": "Resource Found",
                        "data": send_data,
                        "reviewAverage": reviewAverage,
                        "next_cursor": ""
                        if not next_cursor
                        else next_cursor.decode("utf-8"),
                        "previous_cursor": ""
                        if not previous_cursor
                        else previous_cursor.decode("utf-8")
                        # "previous_cursor": previous_cursor,
                    }
                )
            else:
                return jsonify({"status": "error", "message": "No review present"})

def getReviewsAverage(propertyId):
    with client.context():
        is_property_present = Property.get_by_id(propertyId)
        if is_property_present:
            reviews=Reviews.query(Reviews.property_id==propertyId).fetch()
            if len(reviews)>0:
                cleanliness = 0
                location = 0
                value = 0
                check_in = 0
                accuracy = 0
                for entity in reviews:
                    cleanliness += entity.cleanliness
                    location += entity.cleanliness
                    value += entity.value
                    accuracy += entity.accuracy
                    check_in += entity.check_in
                review_average_overall = (
                    cleanliness + location + value + accuracy + check_in
                ) / len(reviews)
                no_of_reviews = len(reviews)
                reviewAverage = [
                    # {"reviewAverage": review_average_overall},
                    {"cleanliness": cleanliness / no_of_reviews},
                    {"location": location / no_of_reviews},
                    {"accuracy": accuracy / no_of_reviews},
                    {"check_in": check_in / no_of_reviews},
                    {"value": value / no_of_reviews},
                ]
                return jsonify(
                    {
                        "status": "success",
                        "message": "Resource Found",
                        "data": [reviewAverage,review_average_overall,no_of_reviews]
                        
                        # "previous_cursor": previous_cursor,
                    }
                )
            
            else:
                no_of_reviews=0
                reviewAverage = [
                    # {"reviewAverage": 0},
                    
                    {"cleanliness": 0},
                    {"location": 0},
                    {"accuracy": 0},
                    {"check_in": 0},
                    {"value": 0},
                ]
                return jsonfiy(
                    {"status":"error",
                    "message":"No review Present",
                    "data":[reviewAverage,review_average_overall,no_of_reviews]}
                )