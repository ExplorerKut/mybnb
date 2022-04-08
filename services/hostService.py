from flask import request,jsonify
import bcrypt
from models import User,Property
from app import client
from app import jwt
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