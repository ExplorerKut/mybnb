from flask import Blueprint,request
from services.authentication import login,signup,logout
authenticate = Blueprint("authenticate", __name__)


@authenticate.route("/login", methods=["POST"])
def loginHandler():
    request_params = request.json
    user_email = request_params.get("email")
    user_password = request_params.get("password").encode("UTF-8")
    return login(user_email,user_password)


@authenticate.route("/signup",methods=["POST"])
def signUpHandler():
    request_params = request.json
    user_email = request_params.get("email")
    user_password = request_params.get("password").encode("UTF-8")
    role =request_params.get("role", "user").lower()
    return signup(user_email,user_password,role)

@authenticate.route("/logout",methods=["POST"])
def logOutHandler():
    return logout()
