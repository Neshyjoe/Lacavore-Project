from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.review import Review
from models.vendor import Vendor

reviews_bp = Blueprint('reviews', __name__, url_prefix='/reviews')

@reviews_bp.route('/reviews', methods=['POST'])
@jwt_required()
def add_review():
    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment')
    vendor_id = data.get('vendor_id')
    if not rating or not vendor_id:
        return jsonify({'message': 'Rating and vendor_id are required'}), 400
    user_id = get_jwt_identity()
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'message': 'Vendor not found'}), 404
    review = Review(rating=rating, comment=comment, user_id=user_id, vendor_id=vendor_id)
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review added', 'id': review.id}), 201

@reviews_bp.route('/reviews/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    review = Review.query.get_or_404(review_id)
    user_id = get_jwt_identity()
    if review.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment')
    if rating:
        review.rating = rating
    if comment:
        review.comment = comment
    db.session.commit()
    return jsonify({'message': 'Review updated'}), 200

@reviews_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    user_id = get_jwt_identity()
    if review.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted'}), 200

