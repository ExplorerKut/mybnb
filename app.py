from flask import Flask, request, jsonify, Blueprint

# from dateutil import parser
import pytz
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    unset_jwt_cookies,
    jwt_required,
    JWTManager,
)

from models import User, Property, Bookings
import bcrypt
from datetime import datetime, timedelta
from google.cloud import ndb


app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "QzPmTvYbWcNSRhfdsUwIDnNwej"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)
jwt = JWTManager(app)
client = ndb.Client()


# from auth.auth import authenticate
from handlers.auth import authenticate
from handlers.host import host
from handlers.location import location
from handlers.places import places
from handlers.bookings import bookings

app.register_blueprint(authenticate, url_prefix="/auth")
app.register_blueprint(host, url_prefix="/host")
app.register_blueprint(location, url_prefix="/locations")
app.register_blueprint(places, url_prefix="/api/places")
app.register_blueprint(bookings, url_prefix="/bookings")

# @app.route("/login", methods=["POST"])
# def login():
#     request_params = request.json
#     user_email = request_params.get("email")
#     user_password = request_params.get("password").encode("UTF-8")
#     # role = request_params.get("role", "user")

#     # try:
#     with client.context():
#         user_details = User.query(User.email == user_email.lower()).fetch()

#         registered_user = True if len(user_details) > 0 else False
#         if registered_user:
#             role = user_details[0].role
#             if bcrypt.checkpw(user_password, user_details[0].password.encode("UTF-8")):
#                 access_token = create_access_token(identity=user_email)
#                 return jsonify(
#                     [
#                         {
#                             "access_token": access_token,
#                             "status": "success",
#                             "message": f"Successfull {role} login",
#                             "role": role,
#                         }
#                     ]
#                 )
#             else:
#                 return jsonify([{"status": "error", "message": "Error in Password"}])
#         else:
#             return jsonify([{"status": "error", "message": "Error in Username"}])
#     # except:
#     #     return {"status":"error","message":"could not initiate datastore client"}


# @app.route("/signup", methods=["POST"])
# def signup():
#     request_params = request.json
#     user_email = request_params.get("email")
#     user_password = request_params.get("password").encode("UTF-8")
#     hashed_password = bcrypt.hashpw(user_password, bcrypt.gensalt(14)).decode("UTF-8")
#     role = request_params.get("role", "user")
#     try:
#         with client.context():
#             user_already_registered = (
#                 True
#                 if len(User.query(User.email == user_email.lower()).fetch()) > 0
#                 else False
#             )
#             if user_already_registered:
#                 return jsonify(
#                     [{"status": "error", "message": "User already registered"}]
#                 )
#             else:
#                 user_credential = User(
#                     email=user_email.lower(), password=hashed_password, role=role
#                 )
#                 user_credential.put()
#                 return jsonify(
#                     [{"status": "success", "message": "User successfully registered"}]
#                 )
#     except:
#         return jsonify(
#             [{"status": "error", "message": "Could not initate datastore client"}]
#         )


# @app.route("/logout", methods=["POST"])
# def logout():
#     unset_jwt_cookies
#     return jsonify({"msg": "logout successfull"})


# @app.route("/addProperty", methods=["POST"])
# @jwt_required()
# def addProperty():
#     request_params = request.json
#     property_name = request_params.get("property_name").lower()
#     property_type = request_params.get("property_type").lower()
#     property_description = request_params.get("property_description").lower()
#     property_location = request_params.get("property_location").lower()
#     property_address = request_params.get("property_address").lower()
#     property_price = int(request_params.get("property_price"))
#     # property_=request.form.get("property_type")
#     property_addDate = datetime.now()
#     host_id = get_jwt_identity()
#     try:
#         with client.context():
#             property_already_registered = (
#                 True
#                 if len(
#                     Property.query(
#                         Property.address == property_address,
#                         Property.location == property_location,
#                     ).fetch()
#                 )
#                 > 0
#                 else False
#             )
#             if not property_already_registered:
#                 property_details = Property(
#                     name=property_name,
#                     host_id=host_id,
#                     property_type=property_type,
#                     address=property_address,
#                     description=property_description,
#                     location=property_location,
#                     date_registered=property_addDate,
#                     price=property_price,
#                 )
#                 property_details.put()
#                 return jsonify(
#                     [
#                         {
#                             "status": "success",
#                             "message": "Property Successfully registered",
#                         }
#                     ]
#                 )
#             else:
#                 return jsonify(
#                     [
#                         {
#                             "status": "error",
#                             "message": "Property with the same address already registered",
#                         }
#                     ]
#                 )
#     except:
#         return jsonify(
#             [{"status": "error", "message": "Could Not initiate datastore client"}]
#         )


# @app.route("/places/<string:locationName>", methods=["GET"])
# def getLocations(locationName):
#     print("")
#     try:
#         with client.context():
#             property_details = Property.query(
#                 Property.location == locationName.lower()
#             ).fetch()
#             response_data = []

#             if len(property_details) > 0:
#                 for entity in property_details:
#                     temp = {}
#                     temp["address"] = entity.address
#                     temp["date_registered"] = entity.date_registered
#                     temp["description"] = entity.description
#                     temp["host_id"] = entity.host_id
#                     temp["name"] = entity.name
#                     temp["property_type"] = entity.property_type
#                     temp["location"] = entity.location
#                     temp["price"] = entity.price
#                     temp["id"] = entity.key.id()
#                     response_data.append(temp)
#                 return jsonify(
#                     [
#                         {
#                             "status": "success",
#                             "message": "Location returned",
#                             "response": response_data,
#                         }
#                     ]
#                 )
#             else:
#                 return jsonify(
#                     [
#                         {
#                             "status": "fail",
#                             "message": "Location Not Found",
#                         }
#                     ]
#                 )
#     except:
#         return jsonify(
#             [{"status": "error", "message": "Could Not initiate datastore client"}]
#         )


# @app.route("/places/<string:locationName>/<int:locationId>", methods=["GET"])
# def getLocationId(locationName, locationId):
#     try:
#         # print("here")
#         with client.context():

#             property_details = Property.get_by_id(locationId)

#             # print(len(property_details))
#             if (
#                 property_details is not None
#                 and property_details.location == locationName.lower()
#             ):
#                 temp = {}
#                 temp["address"] = property_details.address
#                 temp["date_registered"] = property_details.date_registered
#                 temp["description"] = property_details.description
#                 temp["host_id"] = property_details.host_id
#                 temp["name"] = property_details.name
#                 temp["property_type"] = property_details.property_type
#                 temp["location"] = property_details.location
#                 temp["price"] = property_details.price
#                 temp["id"] = property_details.key.id()

#                 return jsonify(
#                     [
#                         {
#                             "status": "success",
#                             "message": "Location returned",
#                             "response": temp,
#                         }
#                     ]
#                 )
#             else:
#                 return jsonify(
#                     [
#                         {
#                             "status": "fail",
#                             "message": "Property Not Present on specified location",
#                         }
#                     ]
#                 )
#     except:
#         return jsonify(
#             [
#                 {
#                     "status": "error",
#                     "message": "Error in datastore client",
#                 }
#             ]
#         )


# @app.route("/places/<string:locationName>/<int:locationId>/book", methods=["POST"])
# # @jwt_required()
# def bookPlace(locationName, locationId):
#     request_params = request.json
#     # print(request_params)
#     format = "%Y-%m-%dT%H:%M:%S.%fZ"
#     format1 = "%Y-%m-%dT%H:%M:%S.%f%z"
#     tz = pytz.timezone(request_params.get("timezone"))
#     booker_id = request_params.get("host_id")
#     property_id = request_params.get("id")
#     booking_date = datetime.strptime(
#         request_params.get("booking_date"), format
#     )  # .astimezone(tz)
#     booking_date = timeConverter(tz, booking_date)
#     # print(booking_date)
#     check_in = datetime.strptime(request_params.get("check_in"), format)
#     check_in = timeConverter(tz, check_in).replace(
#         hour=0, minute=0, second=0, microsecond=0
#     )
#     check_out = datetime.strptime(
#         request_params.get("check_out"), "%Y-%m-%dT%H:%M:%S.%fZ"
#     )
#     check_out = timeConverter(tz, check_out).replace(
#         hour=23, minute=59, second=59, microsecond=0
#     )

#     total_paid = request_params.get("price")
#     with client.context():
#         already_booked = (
#             Bookings.query(Bookings.property_id == property_id)
#             # .filter(ndb.AND(Bookings.check_in < check_in))
#             .fetch()
#         )
#         isBooked = False
#         for entity in already_booked:
#             if entity.check_in <= check_in and entity.check_out >= check_in:
#                 isBooked = True
#                 break
#             elif entity.check_in <= check_out and entity.check_out >= check_out:
#                 isBooked = True
#                 break
#         if not isBooked:
#             booking_details = Bookings(
#                 booker_id=booker_id,
#                 property_id=property_id,
#                 booking_date=booking_date,
#                 total_paid=total_paid,
#                 check_in=check_in,
#                 check_out=check_out,
#             )
#         # booking_details.put()
#         return jsonify({"status": "sucess", "message": "Property booked Successfully"})


# @app.route("/places/<string:locationName>/<int:locationId>/check", methods=["GET"])
# def checkPlaceAvailability(locationName, locationId):
#     request_params = request.json
#     property_id = locationId
#     current_date = datetime.now()
#     with client.context():
#         booking_details = Bookings.query(Bookings.property_id == property_id)
#         time_availability = []
#         for entity in booking_details:
#             time_availability.append({"from": entity.check_in, "to": entity.check_out})
#         return jsonify(
#             {
#                 "status": "sucess",
#                 "message": "Property booked Successfully",
#                 "Availability": time_availability,
#             }
#         )


# def timeConverter(timezone, current_time):
#     format = "%Y-%m-%dT%H:%M:%S.%f%z"
#     current_time = current_time.replace(tzinfo=pytz.UTC)
#     current_time = current_time.astimezone(timezone).replace(tzinfo=None)
#     # print(current_time)
#     # current_time = current_time.strptime(format)
#     return current_time
