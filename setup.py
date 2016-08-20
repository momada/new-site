from setuptools import setup

setup(name='EventMonitor',
      version='1.0',
      description='A basic Flask app with Flask, SocketIO, mongodb',
      author='Jason Lei',
      author_email='momada@zoho.com',
      url='http://www.python.org',
      install_requires=['Flask>=0.10.1', 'pymongo>=3.3', 'flask_socketio==2.6', 'werkzeug==0.11', 'bson==0.4.3'],
      )
