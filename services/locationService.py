from flask import request, jsonify
import bcrypt
from models import User, Property, Bookings
from app import client
from app import jwt
from datetime import datetime
from flask_jwt_extended import (
    create_access_token,
    unset_jwt_cookies,
    get_jwt_identity,
    jwt_required,
)


def getAllLocations():
    try:
        dict_locations = {}
        list_result = []
        with client.context():
            get_locations = Property.query()
            for entity in get_locations:
                dict_locations[entity.location.capitalize()] = (
                    dict_locations.get(entity.location.capitalize(), 0) + 1
                )
            for key, values in dict_locations.items():
                list_result.append([key, values])
            print(list_result)
            # print(dict_locations)
            return jsonify(
                [
                    {
                        "status": "success",
                        "message": "Get Successful",
                        "data": list_result
                        # "data": {get_locations},
                    }
                ]
            )

    except:
        
        return jsonify(
            [{"status": "error", "message": "Could Not initiate datastore client"}]
        )


def getPlaces(locationName):
    try:
        with client.context():
            property_details = Property.query(
                Property.location == locationName.lower()
            ).fetch()
            response_data = []

            if len(property_details) > 0:
                for entity in property_details:
                    temp = {}
                    temp["address"] = entity.address
                    temp["date_registered"] = entity.date_registered
                    temp["description"] = entity.description
                    temp["host_id"] = entity.host_id
                    temp["name"] = entity.name
                    temp["property_type"] = entity.property_type
                    temp["location"] = entity.location
                    temp["price"] = entity.price
                    temp["id"] = entity.key.id()
                    response_data.append(temp)
                return jsonify(
                    [
                        {
                            "status": "success",
                            "message": "Location returned",
                            "response": response_data,
                        }
                    ]
                )
            else:
                return jsonify(
                    [
                        {
                            "status": "fail",
                            "message": "Location Not Found",
                        }
                    ]
                )
    except:
        return jsonify(
            [{"status": "error", "message": "Could Not initiate datastore client"}]
        )


def getDescription(locationName, locationId):
    try:
        # print("here")
        with client.context():

            property_details = Property.get_by_id(locationId)

            # print(len(property_details))
            if (
                property_details is not None
                and property_details.location == locationName.lower()
            ):
                temp = {}
                temp["address"] = property_details.address
                temp["date_registered"] = property_details.date_registered
                temp["description"] = property_details.description
                temp["host_id"] = property_details.host_id
                temp["name"] = property_details.name
                temp["property_type"] = property_details.property_type
                temp["location"] = property_details.location
                temp["price"] = property_details.price
                temp["id"] = property_details.key.id()

                return jsonify(
                    [
                        {
                            "status": "success",
                            "message": "Location returned",
                            "response": temp,
                        }
                    ]
                )
            else:
                return jsonify(
                    [
                        {
                            "status": "fail",
                            "message": "Property Not Present on specified location",
                        }
                    ]
                )
    except:
        return jsonify(
            [
                {
                    "status": "error",
                    "message": "Error in datastore client",
                }
            ]
        )


def getPlaceAvailability(locationName, locationId):
    # print("here")
    try:
        property_id = locationId
        # print(locationId)
        current_date = datetime.now()
        with client.context():
            property_details = Property.get_by_id(locationId)
            if property_details is not None:
                booking_details = Bookings.query(
                    Bookings.property_id == property_id
                ).fetch()
                # print(booking_details)
                if len(booking_details) != 0:
                    time_availability = []
                    for entity in booking_details:
                        time_availability.append(
                            {"from": entity.check_in, "to": entity.check_out}
                        )
                    return jsonify(
                        {
                            "status": "sucess",
                            "message": "Available dates Successfully retrieved",
                            "Availability": time_availability,
                        }
                    )
                else:
                    return jsonify(
                        {
                            {
                                "status": "sucess",
                                "message": "Available dates Successfully retrieved",
                                "Availability": None,
                            }
                        }
                    )
            else:
                return jsonify(
                    {"status": "error", "message": "No resource available"}, 404
                )
    except:
        return jsonify(
            [
                {
                    "status": "error",
                    "message": "Error in datastore client",
                }
            ]
        )


@jwt_required()
def bookPlace(data):

    # request_params = request.json
    # # print(request_params)
    # format = "%Y-%m-%dT%H:%M:%S.%fZ"
    # format1 = "%Y-%m-%dT%H:%M:%S.%f%z"
    # tz = pytz.timezone(request_params.get("timezone"))
    # booker_id = request_params.get("host_id")
    # property_id = request_params.get("id")
    # booking_date = datetime.strptime(
    #     request_params.get("booking_date"), format
    # )  # .astimezone(tz)
    # booking_date = timeConverter(tz, booking_date)
    # # print(booking_date)
    # check_in = datetime.strptime(request_params.get("check_in"), format)
    # check_in = timeConverter(tz, check_in).replace(
    #     hour=0, minute=0, second=0, microsecond=0
    # )
    # check_out = datetime.strptime(
    #     request_params.get("check_out"), "%Y-%m-%dT%H:%M:%S.%fZ"
    # )
    # check_out = timeConverter(tz, check_out).replace(
    #     hour=23, minute=59, second=59, microsecond=0
    # )

    # total_paid = request_params.get("price")
    print(data)
    with client.context():
        already_booked = (
            Bookings.query(Bookings.property_id == data.get("property_id"))
            # .filter(ndb.AND(Bookings.check_in < check_in))
            .fetch()
        )
        isBooked = False
        for entity in already_booked:
            if entity.check_in <= data.get("check_in") and entity.check_out >= data.get(
                "check_in"
            ):
                isBooked = True
                break
            elif entity.check_in <= data.get(
                "check_out"
            ) and entity.check_out >= data.get("check_out"):
                isBooked = True
                break
        if not isBooked:
            booking_details = Bookings(
                booker_id=data.get("booker_id"),
                property_id=data.get("property_id"),
                booking_date=data.get("booking_date"),
                total_paid=data.get("total_paid"),
                check_in=data.get("check_in"),
                check_out=data.get("check_out"),
            )
            booking_details.put()
            return jsonify(
                {"status": "success", "message": "Property booked Successfully"}
            )
        else:
            return jsonify({"status": "error", "message": "Illegal Operation"})

    # except:
    #     return jsonify(
    #         [
    #             {
    #                 "status": "error",
    #                 "message": "Error in datastore client",
    #             }
    #         ]
    #     )
