from setuptools import setup

setup(name='FlaskApp',
      version='1.0',
      description='A basic Flask app with static files',
      author='Ryan Jarvinen',
      author_email='ryanj@redhat.com',
      url='http://www.python.org/sigs/distutils-sig/',
      install_requires=['Flask>=1.0.1', 'pymongo >= 3.3.0', 'requests>=2.1'],
      )
