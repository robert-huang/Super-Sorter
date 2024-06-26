from flask_restx import Model, fields

NEW_SESSION = Model("NewSession", {
    "name": fields.String(example="My Sort Session"),
    "type": fields.String(example="general-character"),
    "items": fields.List(fields.String),
    "algorithm": fields.String(example="queue-merge", enum=["merge", "queue-merge"]),
    "shuffle": fields.Boolean(default=True)
})

UPDATE_SESSION = Model("UpdateSession", {
    "name": fields.String(example="My Sort Session"),
    "items": fields.List(fields.String, default=[]),
    "deletedItems": fields.List(fields.String, default=[]),
    "history": fields.List(fields.String, default=[]),
    "deletedHistory": fields.List(fields.String, default=[]),
    "algorithm": fields.String(example="queue-merge", enum=["merge", "queue-merge"]),
    "seed": fields.Integer(example=123)
})

DELETE_SESSION = Model("DeleteSession", {
    "id": fields.String(example="00000000-0000-0000-0000-000000000000")
})

USER_BASIC = Model("BasicUserInput", {
    "fullData": fields.Boolean(default=False)
})

USER_CHOICE = Model.inherit("UserChoice", USER_BASIC, {
    "itemA": fields.String(example="123"),
    "itemB": fields.String(example="456"),
    "choice": fields.String(example="456")
})

USER_DELETE = Model.inherit("UserDelete", USER_BASIC, {})

USER_UNDELETE = Model.inherit("UserUndelete", USER_DELETE, {})

OPTIONS = Model("Options", {
    "itemA": fields.String,
    "itemB": fields.String
})

SESSION_DATA = Model("SessionData", {
    "sessionId": fields.String,
    "name": fields.String,
    "type": fields.String,
    "options": fields.Nested(OPTIONS),
    "results": fields.List(fields.String),
    "items": fields.List(fields.String),
    "deleted": fields.List(fields.String),
    "history": fields.List(fields.String),
    "deletedHistory": fields.List(fields.String),
    "algorithm": fields.String,
    "seed": fields.Integer,
    "estimate": fields.Integer
})

SESSION_LIST = Model("SessionList", {
    "sessions": fields.List(fields.Nested(SESSION_DATA))
})
