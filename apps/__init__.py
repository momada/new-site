from flask import Flask
#from pymongo import MongoClient
from flask_socketio import SocketIO, emit
from apps.modules.user import mod_user
from apps.modules.eventMonitor import mod_eventMonitor
from apps.modules.device import mod_device


app = Flask(__name__)
app.config.from_pyfile('apps.cfg')

#db_server = os.environ['OPENSHIFT_MONGODB_DB_HOST'] + ':' + os.environ['OPENSHIFT_MONGODB_DB_PORT']
#mongo_user = 'admin'
#mongo_pw = 'MnKDmKKn6_Yk'
#uri = "mongodb://" + mongo_user + ":" + mongo_pw + "@" + db_server
#mongo = MongoClient(uri)

async_mode = None
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)

app.register_blueprint(mod_user)
app.register_blueprint(mod_eventMonitor)
app.register_blueprint(mod_device)


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/test')
def test():
    return "Hello World!"


@app.route('/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)


@socketio.on('EventOccurred', namespace='/ws')
def event_occurred(data):
    emit('Moniter need refresh', data, broadcast=True)
