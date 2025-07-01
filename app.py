import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from config import Config
from database import db

load_dotenv()  

app = Flask(__name__)

app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

db.init_app(app)

with app.app_context():
    db.create_all()

migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

from routes.auth_route import auth_bp
from routes.vendors_route import vendors_bp  
from routes.reviews_route import reviews_bp   

app.register_blueprint(auth_bp)
app.register_blueprint(vendors_bp)  
app.register_blueprint(reviews_bp)   

if __name__ == '__main__':
    app.run(debug=True)