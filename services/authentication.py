from flask import request, jsonify
import bcrypt
from models import User, Property
from app import client
from app import jwt
from flask_jwt_extended import (
    create_access_token,
    unset_jwt_cookies,
)


def login(user_email, user_password):

    # request_params = request.json
    # user_email = request_params.get("email")
    # user_password = request_params.get("password").encode("UTF-8")
    # role = request_params.get("role", "user")

    # try:
    with client.context():
        user_details = User.query(User.email == user_email.lower()).fetch()

        registered_user = True if len(user_details) > 0 else False
        if registered_user:
            role = user_details[0].role
            if bcrypt.checkpw(user_password, user_details[0].password.encode("UTF-8")):
                access_token = create_access_token(identity=user_email)
                return jsonify(
                    [
                        {
                            "access_token": access_token,
                            "status": "success",
                            "message": f"Successfull {role} login",
                            "role": role,
                        }
                    ]
                )
            else:
                return jsonify([{"status": "error", "message": "Error in Password"}])
        else:
            return jsonify([{"status": "error", "message": "Error in Username"}])


def signup(user_email, user_password, role):
    # request_params = request.json
    # user_email = request_params.get("email")
    # user_password = request_params.get("password").encode("UTF-8")
    # hashed_password = bcrypt.hashpw(user_password, bcrypt.gensalt(14)).decode("UTF-8")
    # role = request_params.get("role", "user")
    hashed_password = bcrypt.hashpw(user_password, bcrypt.gensalt(14)).decode("UTF-8")
    try:
        with client.context():
            user_already_registered = (
                True
                if len(User.query(User.email == user_email.lower()).fetch()) > 0
                else False
            )
            if user_already_registered:
                return jsonify(
                    [{"status": "error", "message": "User already registered"}]
                )
            else:
                user_credential = User(
                    email=user_email.lower(), password=hashed_password, role=role
                )
                user_credential.put()
                return jsonify(
                    [{"status": "success", "message": "User successfully registered"}]
                )
    except:
        return jsonify(
            [{"status": "error", "message": "Could not initate datastore client"}]
        )


def logout():
    unset_jwt_cookies
    return jsonify({"msg": "logout successfull"})
