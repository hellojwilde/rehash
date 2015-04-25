"""
Automatically loaded when a new app instance starts. 
Runs before WSGI applications specified in app.yaml are loaded.
SeesionMiddleware is loaded. 
"""

import sys
sys.path.insert(0, 'libs')

from gaesessions import SessionMiddleware

COOKIE_KEY = 'Y726Ii7GuXRIb06HJ3X0cy8uQ0cpcYXd'

def webapp_add_wsgi_middleware(app):
  from google.appengine.ext.appstats import recording
  app = SessionMiddleware(app, cookie_key=COOKIE_KEY)
  app = recording.appstats_wsgi_middleware(app)
  return app