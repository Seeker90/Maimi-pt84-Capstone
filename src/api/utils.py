from flask import jsonify
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from api.models import User

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults or ()
    arguments = rule.arguments or ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = str(rule)
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(f"<li><a href='{y}'>{y}</a></li>" for y in links)
    return f"""
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project using the <a href="/admin/">Admin</a></p>
        <ul style="text-align: left;">{links_html}</ul></div>
    """

def role_required(required_role):
    def decorator_wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_jwt_identity()

            user = User.query.get(current_user["id"])
            if not user or user.role != required_role:
                return jsonify({'message': f'{required_role.capitalize()} access required'}), 403

            return fn(*args, **kwargs)
        return decorated
    return decorator_wrapper

def provider_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id_str = get_jwt_identity()
            user_id = int(user_id_str)
            user = User.query.get(user_id)
            
            if not user or user.role != 'provider':
                return jsonify({'message': 'Provider access required'}), 403
            
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def customer_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id_str = get_jwt_identity()
            user_id = int(user_id_str)
            user = User.query.get(user_id)
            
            if not user or user.role != 'customer':
                return jsonify({'message': 'Customer access required'}), 403
            
            return fn(*args, **kwargs)
        return decorator
    return wrapper
