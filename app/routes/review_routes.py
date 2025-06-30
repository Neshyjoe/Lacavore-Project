from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models import Review, Vendor

review_bp = Blueprint('reviews', __name__, url_prefix='/reviews')

@review_bp.route('', methods=['POST'])
@jwt_required()
def add_review():
    data = request.get_json()
    vendor = Vendor.query.get(data.get('vendor_id'))
    if not vendor:
        return jsonify({"error": "Vendor not found"}), 404

    review = Review(
        content=data.get('content'),
        rating=data.get('rating'),
        vendor_id=data.get('vendor_id')
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({'message': 'Review added successfully'}), 201


@review_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_review(id):
    review = Review.query.get_or_404(id)
    data = request.get_json()
    review.content = data.get('content', review.content)
    review.rating = data.get('rating', review.rating)
    db.session.commit()

    return jsonify({'message': 'Review updated successfully'}), 200


@review_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_review(id):
    review = Review.query.get_or_404(id)
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted successfully'}), 200