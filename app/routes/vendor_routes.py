from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Vendor, User

vendor_bp = Blueprint('vendors', __name__, url_prefix='/vendors')

@vendor_bp.route('', methods=['GET'])
@jwt_required()
def get_vendors():
    vendors = Vendor.query.all()
    return jsonify([{
        'id': v.id,
        'name': v.name,
        'description': v.description,
        'user_id': v.user_id
    } for v in vendors]), 200


@vendor_bp.route('', methods=['POST'])
@jwt_required()
def add_vendor():
    data = request.get_json()
    user_id = get_jwt_identity()

    vendor = Vendor(
        name=data.get('name'),
        description=data.get('description'),
        user_id=user_id
    )
    db.session.add(vendor)
    db.session.commit()

    return jsonify({'message': 'Vendor added successfully'}), 201


@vendor_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_vendor(id):
    vendor = Vendor.query.get_or_404(id)
    return jsonify({
        'id': vendor.id,
        'name': vendor.name,
        'description': vendor.description,
        'user_id': vendor.user_id
    }), 200


@vendor_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_vendor(id):
    vendor = Vendor.query.get_or_404(id)
    user_id = get_jwt_identity()
    if vendor.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    vendor.name = data.get('name', vendor.name)
    vendor.description = data.get('description', vendor.description)
    db.session.commit()

    return jsonify({'message': 'Vendor updated successfully'}), 200


@vendor_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_vendor(id):
    vendor = Vendor.query.get_or_404(id)
    user_id = get_jwt_identity()
    if vendor.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(vendor)
    db.session.commit()
    return jsonify({'message': 'Vendor deleted successfully'}), 200
