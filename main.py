from app import create_app
from flask import send_from_directory
app= create_app()

# @app.route('/')
# def home():
#     return send_from_directory(app.static_folder, "index.html")
if __name__=='__main__':
    app.run()