import os
import logging
import shelve
from marshmallow import Schema, fields, ValidationError
from flask import Flask, g, request
from flask_restful import Resource, Api
from passlib.hash import pbkdf2_sha256 as sha256
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    jwt_refresh_token_required, get_jwt_identity, get_raw_jwt
)

app = Flask(__name__)
app.config.update(
    DEBUG=os.getenv('DEBUG_MODE'),
    JWT_SECRET_KEY=os.getenv('JWT_SECRET'),
    JWT_BLACKLIST_ENABLED=True,
    JWT_BLACKLIST_TOKEN_CHECKS=['access', 'refresh']
)
DB_USER = os.getenv('DB_USER')
DB_REV_TOKEN = os.getenv('DB_REVOKED_TOKENS')

api = Api(app)
jwt = JWTManager(app)

logging.basicConfig(filename='../test_api.log', level=logging.INFO,
                    format='%(asctime)s:%(funcName)s:%(lineno)d:%(message)s')


def get_db(db_file):
    db = getattr(g, '_database', None)
    if db is None:
        print("is none")
        db = g._database = shelve.open(os.path.join(os.path.dirname(__file__), "../" + db_file))
    return db


@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


class UserSchema(Schema):
    name = fields.Str(required=False)
    username = fields.Str(required=True)
    password = fields.Method(deserialize='load_password')
    admin = fields.Bool(required=False, missing=False)

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hashed):
        return sha256.verify(password, hashed)

    def load_password(self, value):
        return self.generate_hash(value)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return decrypted_token['jti'] in get_db(DB_REV_TOKEN)


class User(Resource):
    def get(self, username):
        db = get_db(DB_USER)
        if username not in db:
            return {'msg': 'User {} not found'.format(username), 'data': None}, 404
        return {'msg': 'User found', 'data': db[username]}, 200

    def put(self, username):
        db = get_db(DB_USER)
        if username not in db:
            return {'msg': 'User {} not found'.format(username), 'data': None}, 404

        schema = UserSchema()
        try:
            result = schema.load(request.json)
            db[username] = result
            return {'msg': 'User {} modified'.format(username), 'data': None}, 200

        except ValidationError as err:
            logging.error("Validation error " + str(err.messages))
            return {'msg': 'Validation error', 'data': err.messages}, 400

    def delete(self, username):
        db = get_db(DB_USER)
        if username not in db:
            return {'msg': 'User {} not found'.format(username), 'data': None}, 201

        del db[username]
        return {'msg': 'User {} deleted'.format(username), 'data': None}, 200


class AllUsers(Resource):
    def get(self):
        db = get_db(DB_USER)
        result = []

        for key in db:
            result.append(db[key])

        return {'msg': 'Users', 'data': result}, 200


class Register(Resource):
    def post(self):
        db = get_db(DB_USER)
        schema = UserSchema()

        try:
            result = schema.load(request.json)
            username = request.json['username']

            if username in db:
                return {'msg': 'User {} already exists'.format(username), 'data': None}, 400

            db[username] = result
            return {'msg': 'User {} created'.format(username), 'data': {
                'access_token': create_access_token(identity=username),
                'refresh_token': create_refresh_token(identity=username)
            }}, 200

        except ValidationError as err:
            logging.error("Validation error " + str(err.messages))
            return {'msg': 'Validation error', 'data': err.messages}, 400


class Login(Resource):
    def post(self):
        db = get_db(DB_USER)

        try:
            UserSchema().load(request.json)
            username = request.json['username']
            password = request.json['password']

            if username not in db:
                return {'msg': 'User {} not found'.format(username), 'data': None}, 404

            if UserSchema.verify_hash(password, db[username]['password']):
                return {'msg': 'Logged in as {}'.format(username), 'data': {
                    'access_token': create_access_token(identity=username),
                    'refresh_token': create_refresh_token(identity=username)
                }}, 200
            else:
                return {'msg': 'Wrong password', 'data': None}, 401

        except ValidationError as err:
            logging.error("Validation error " + str(err.messages))
            return {'msg': 'Validation error', 'data': err.messages}, 400


class Logout(Resource):
    @jwt_refresh_token_required
    def post(self):  # FIXME the access token is not revoked
        refresh_jwt = get_raw_jwt()
        jti = refresh_jwt['jti']
        db = get_db(DB_REV_TOKEN)

        db[jti] = refresh_jwt
        return {'msg': 'Logged out', 'data': None}, 200


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {'msg': 'New access token for {}'.format(current_user), 'data': {
            'access_token': access_token
        }}, 200


api.add_resource(User, '/user/<string:username>')
api.add_resource(AllUsers, '/all_users')
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(TokenRefresh, '/token/refresh')


if __name__ == '__main__':
    app.run()
