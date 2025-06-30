from flask import Flask
from .extensions import db, migrate, jwt, cors
from .routes.auth_routes import auth_bp
from .routes.vendor_routes import vendor_bp
from .routes.review_routes import review_bp
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(vendor_bp)
    app.register_blueprint(review_bp)

    @app.route('/')
    def home():
        return 'Welcome to Locavore Backend API!'

    return app
