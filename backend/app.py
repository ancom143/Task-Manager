from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from flask_bcrypt import Bcrypt




app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Team(db.Model):
    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True)

    team_name = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    subteams = db.relationship(
        "Subteam",
        backref="team",
        cascade="all, delete"
    )

    users = db.relationship(
        "User",
        backref="team",
        cascade="all, delete"
    )

    tasks = db.relationship(
        "Task",
        backref="team",
        cascade="all, delete"
    )


class Subteam(db.Model):
    __tablename__ = "subteams"

    id = db.Column(db.Integer, primary_key=True)

    subteam_name = db.Column(
        db.String(100),
        nullable=False
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id"),
        nullable=False
    )

    users = db.relationship(
        "User",
        backref="subteam",
        cascade="all, delete"
    )

    tasks = db.relationship(
        "Task",
        backref="subteam",
        cascade="all, delete"
    )


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    username = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(100),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        default="user"
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id")
    )

    subteam_id = db.Column(
        db.Integer,
        db.ForeignKey("subteams.id")
    )



class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    deadline = db.Column(
        db.String(50)
    )

    status = db.Column(
        db.String(50),
        default="Pending"
    )

    assigned_by = db.Column(
        db.String(100)
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id")
    )

    subteam_id = db.Column(
        db.Integer,
        db.ForeignKey("subteams.id")
    )



@app.route("/")
def home():
    return jsonify({
        "message": "Task Manager Backend Running"
    })


@app.route("/signup", methods=["POST"])
def signup():

    data = request.json

    name = data.get("name")
    username = data.get("username")
    password = data.get("password")
    team_id = data.get("team_id")
    subteam_id = data.get("subteam_id")

    # Username already exists?
    existing = User.query.filter_by(username=username).first()

    if existing:
        return jsonify({
            "message": "Username already exists"
        }), 400

    # Team exists?
    team = Team.query.get(team_id)

    if team is None:
        return jsonify({
            "message": "Invalid Team"
        }), 400

    # Subteam belongs to team?
    subteam = Subteam.query.filter_by(
        id=subteam_id,
        team_id=team_id
    ).first()

    if subteam is None:
        return jsonify({
            "message": "Invalid Subteam"
        }), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(
        name=name,
        username=username,
        password=hashed_password,
        role="user",
        team_id=team_id,
        subteam_id=subteam_id
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Signup Successful"
    })




@app.route("/login", methods=["POST"])
def login():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(
        username=username,
        password=password
    ).first()

    if user is None:

        return jsonify({
            "message": "Invalid Username or Password"
        }), 401

    team_name = ""
    subteam_name = ""

    if user.team:
        team_name = user.team.team_name

    if user.subteam:
        subteam_name = user.subteam.subteam_name

    return jsonify({

        "message": "Login Successful",

        "user": {

            "id": user.id,
            "name": user.name,
            "username": user.username,
            "role": user.role,

            "team_id": user.team_id,
            "subteam_id": user.subteam_id,

            "team_name": team_name,
            "subteam_name": subteam_name

        }

    })



@app.route("/teams", methods=["GET"])
def get_teams():

    teams = Team.query.all()

    result = []

    for team in teams:

        result.append({
            "id": team.id,
            "team_name": team.team_name
        })

    return jsonify(result)



@app.route("/team/<int:id>", methods=["GET"])
def get_team(id):

    team = Team.query.get(id)

    if team is None:
        return jsonify({
            "message": "Team not found"
        }),404

    return jsonify({
        "id": team.id,
        "team_name": team.team_name
    })




@app.route("/teams", methods=["POST"])
def create_team():

    data = request.json

    team_name = data.get("team_name")

    if not team_name:

        return jsonify({
            "message":"Enter Team Name"
        }),400

    existing = Team.query.filter_by(
        team_name=team_name
    ).first()

    if existing:

        return jsonify({
            "message":"Team already exists"
        }),400

    new_team = Team(
        team_name=team_name
    )

    db.session.add(new_team)
    db.session.commit()

    return jsonify({
        "message":"Team Created Successfully"
    })




@app.route("/teams/<int:id>", methods=["PUT"])
def rename_team(id):

    team = Team.query.get(id)

    if team is None:

        return jsonify({
            "message":"Team not found"
        }),404

    data = request.json

    team.team_name = data.get("team_name")

    db.session.commit()

    return jsonify({
        "message":"Team Updated"
    })



@app.route("/teams/<int:id>", methods=["DELETE"])
def delete_team(id):

    team = Team.query.get(id)

    if team is None:

        return jsonify({
            "message":"Team not found"
        }),404

    db.session.delete(team)
    db.session.commit()

    return jsonify({
        "message":"Team Deleted"
    })

# --------------------------------------------------
# GET ALL SUBTEAMS OF A TEAM
# --------------------------------------------------

@app.route("/subteams/<int:team_id>", methods=["GET"])
def get_subteams(team_id):

    subteams = Subteam.query.filter_by(team_id=team_id).all()

    result = []

    for subteam in subteams:

        result.append({
            "id": subteam.id,
            "subteam_name": subteam.subteam_name,
            "team_id": subteam.team_id
        })

    return jsonify(result)



@app.route("/subteams", methods=["POST"])
def create_subteam():

    data = request.json

    team_id = data.get("team_id")
    subteam_name = data.get("subteam_name")

    team = Team.query.get(team_id)

    if team is None:

        return jsonify({
            "message":"Invalid Team"
        }),400

    existing = Subteam.query.filter_by(
        team_id=team_id,
        subteam_name=subteam_name
    ).first()

    if existing:

        return jsonify({
            "message":"Subteam already exists"
        }),400

    new_subteam = Subteam(
        subteam_name=subteam_name,
        team_id=team_id
    )

    db.session.add(new_subteam)
    db.session.commit()

    return jsonify({
        "message":"Subteam Created Successfully"
    })



@app.route("/subteams/<int:id>", methods=["PUT"])
def update_subteam(id):

    subteam = Subteam.query.get(id)

    if subteam is None:

        return jsonify({
            "message":"Subteam not found"
        }),404

    data = request.json

    subteam.subteam_name = data.get("subteam_name")

    db.session.commit()

    return jsonify({
        "message":"Subteam Updated"
    })




@app.route("/subteams/<int:id>", methods=["DELETE"])
def delete_subteam(id):

    subteam = Subteam.query.get(id)

    if subteam is None:

        return jsonify({
            "message":"Subteam not found"
        }),404

    db.session.delete(subteam)
    db.session.commit()

    return jsonify({
        "message":"Subteam Deleted"
    })

@app.route("/team_tasks/<int:team_id>/<int:subteam_id>", methods=["GET"])
def get_team_tasks(team_id, subteam_id):

    tasks = Task.query.filter_by(
        team_id=team_id,
        subteam_id=subteam_id
    ).all()

    result = []

    for task in tasks:

        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "deadline": task.deadline,
            "status": task.status,
            "assigned_by": task.assigned_by
        })

    return jsonify(result)




@app.route("/team_tasks", methods=["POST"])
def create_team_task():

    data = request.json

    new_task = Task(
        title=data.get("title"),
        description=data.get("description"),
        deadline=data.get("deadline"),
        status="Pending",
        assigned_by="Admin",
        team_id=data.get("team_id"),
        subteam_id=data.get("subteam_id")
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        "message": "Task Created Successfully"
    })



@app.route("/team_tasks/<int:id>", methods=["PUT"])
def complete_team_task(id):

    task = Task.query.get(id)

    if task is None:
        return jsonify({
            "message": "Task not found"
        }),404

    task.status = "Completed"

    db.session.commit()

    return jsonify({
        "message": "Task Completed"
    })



@app.route("/team_tasks/<int:id>", methods=["DELETE"])
def delete_team_task(id):

    task = Task.query.get(id)

    if task is None:
        return jsonify({
            "message": "Task not found"
        }),404

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Task Deleted"
    })


@app.route("/personal_tasks/<int:user_id>", methods=["GET"])
def get_personal_tasks(user_id):

    tasks = Task.query.filter_by(
        assigned_by=str(user_id),
        team_id=None,
        subteam_id=None
    ).all()

    result = []

    for task in tasks:

        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "deadline": task.deadline,
            "status": task.status
        })

    return jsonify(result)


@app.route("/personal_tasks", methods=["POST"])
def create_personal_task():

    data = request.json

    task = Task(
        title=data.get("title"),
        description=data.get("description"),
        deadline=data.get("deadline"),
        status="Pending",
        assigned_by=str(data.get("user_id")),
        team_id=None,
        subteam_id=None
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({
        "message":"Personal Task Added"
    })




@app.route("/personal_tasks/<int:id>", methods=["PUT"])
def complete_personal_task(id):

    task = Task.query.get(id)

    if task is None:

        return jsonify({
            "message":"Task not found"
        }),404

    task.status="Completed"

    db.session.commit()

    return jsonify({
        "message":"Task Completed"
    })



@app.route("/personal_tasks/<int:id>", methods=["DELETE"])
def delete_personal_task(id):

    task = Task.query.get(id)

    if task is None:

        return jsonify({
            "message":"Task not found"
        }),404

    db.session.delete(task)

    db.session.commit()

    return jsonify({
        "message":"Task Deleted"
    })




with app.app_context():
    db.create_all()

    # Create default admin account
    admin = User.query.filter_by(username="admin").first()

    if admin is None:

        admin = User(
            name="Administrator",
            username="admin",
            password="admin123",
            role="admin"
        )

        db.session.add(admin)
        db.session.commit()


# --------------------------------------------------
# Run
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)