import os
import shelve
from marshmallow import Schema, fields
from flask import Flask, g, request
from flask_restful import Resource, Api

DEBUG_MODE = os.getenv('DEBUG_MODE')
DB_USER = os.getenv('DB_FILE')
app = Flask(__name__)
api = Api(app)


def get_db(db_file):
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = shelve.open(os.path.join(os.path.dirname(__file__), "../" + db_file))
    return db


@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


class UserSchema(Schema):
    name = fields.Str()
    username = fields.Str(required=True)
    password = fields.Str(required=True)


class User(Resource):
    def get(self, username):
        db = get_db(DB_USER)
        if username not in db:
            return {'message': 'User {} not found'.format(username), 'data': {}}, 404
        return {'message': 'User found', 'data': db[username]}, 200

    def put(self, username):
        db = get_db(DB_USER)
        if username not in db:
            return {'message': 'User {} not found'.format(username), 'data': None}, 404

        schema = UserSchema()
        result = schema.load(request.json)  # TODO ValidationError
        db[username] = result
        return {'message': 'User modified', 'data': result}, 200

    def delete(self, username):
        db = get_db(DB_USER)
        if username not in db:
            return {'message': 'User {} not found'.format(username), 'data': None}, 201

        del db[username]
        return {'message': 'User {} deleted'.format(username), 'data': None}, 200


class AllUsers(Resource):
    def get(self):
        db = get_db(DB_USER)
        result = []

        for key in db:
            result.append(db[key])

        return {'message': 'Users', 'data': result}, 200


class NewUser(Resource):
    def post(self):
        db = get_db(DB_USER)

        schema = UserSchema()
        result = schema.load(request.json)  # TODO ValidationError
        username = request.json['username']

        if username in db:
            return {'message': 'User {} already exists'.format(username), 'data': None}, 400

        db[username] = result
        return {'message': 'User created', 'data': result}, 200


api.add_resource(User, '/user/<string:username>')
api.add_resource(AllUsers, '/all_users')
api.add_resource(NewUser, '/new_user')
# api.add_resource(Login, '/login')


if __name__ == '__main__':
    app.run(debug=DEBUG_MODE)
