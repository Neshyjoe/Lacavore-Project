from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.vendor import Vendor

vendors_bp = Blueprint('vendors', __name__, url_prefix='/vendors')

@vendors_bp.route('/', methods=['GET'])
@jwt_required()
def list_vendors():
    vendors = Vendor.query.all()
    result = []
    for v in vendors:
        result.append({
            'id': v.id,
            'name': v.name,
            'description': v.description,
            'owner_id': v.owner_id
        })
    return jsonify(result), 200

@vendors_bp.route('/', methods=['POST'])
@jwt_required()
def add_vendor():
    data = request.get_json()
    name = data.get('name')
    location = data.get('location')
    description = data.get('description')
    if not name:
        return jsonify({'message': 'Vendor name is required'}), 400
    if not location:
        return jsonify({'message': 'Vendor location is required'}), 400
    user_id = get_jwt_identity()
    vendor = Vendor(name=name, location=location, description=description, owner_id=user_id)
    db.session.add(vendor)
    db.session.commit()
    return jsonify({'message': 'Vendor added', 'id': vendor.id}), 201

@vendors_bp.route('/<int:vendor_id>', methods=['GET'])
@jwt_required()
def vendor_detail(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    reviews = []
    for r in vendor.reviews:
        reviews.append({
            'id': r.id,
            'rating': r.rating,
            'comment': r.comment,
            'user_id': r.user_id,
            'created_at': r.created_at.isoformat()
        })
    return jsonify({
        'id': vendor.id,
        'name': vendor.name,
        'description': vendor.description,
        'owner_id': vendor.user_id,
        'reviews': reviews
    }), 200

@vendors_bp.route('/<int:vendor_id>', methods=['PUT'])
@jwt_required()
def update_vendor(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    user_id = get_jwt_identity()
    if vendor.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    if name:
        vendor.name = name
    if description:
        vendor.description = description
    db.session.commit()
    return jsonify({'message': 'Vendor updated'}), 200

@vendors_bp.route('/<int:vendor_id>', methods=['DELETE'])
@jwt_required()
def delete_vendor(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    user_id = get_jwt_identity()
    if vendor.owner_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    db.session.delete(vendor)
    db.session.commit()
    return jsonify({'message': 'Vendor deleted'}), 200
