from flask import Blueprint, request
import pytz
from datetime import datetime
from services.reviewService import postReview
from services.reviewService import getReviews,getReviewsAverage

reviews = Blueprint("reviews", __name__)


@reviews.route("/post", methods=["POST"])
def postReviewHandler():
    request_params = request.json
    print(request_params)
    data = {
        "locationId": request_params.get("id", 0),
        "cleanliness": request_params.get("ratings").get("cleanliness", 0),
        "location": request_params.get("ratings").get("location", 0),
        "check_in": request_params.get("ratings").get("check_in", 0),
        "value": request_params.get("ratings").get("value", 0),
        "accuracy": request_params.get("ratings").get("accuracy", 0),
        "review": request_params.get("message", ""),
        "posting_date": request_params.get("posting_date", datetime.now())
        # "posted_by":request_params.get("posted_by")
    }
    # print("----------")
    return postReview(data)


@reviews.route("/get/<int:propertyId>/", defaults={"cursor": None}, methods=["GET"])
@reviews.route("/get/<int:propertyId>/<string:cursor>", methods=["GET"])
def getReviewsHandler(propertyId, cursor):
    return getReviews(propertyId, cursor)

@reviews.route("/getReviewAverage/<int:locationId>",methods=["GET"])
def getReviewAverageHandler(locationId):
    return getReviewsAverage(locationId)