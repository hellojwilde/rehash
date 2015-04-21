#!/usr/bin/python

import sys, getopt

argdict = {}
first = 0
for arg in sys.argv:
  if first == 0:
    first = 1
  else:
    pair=arg.split("=", 2)
    argdict[pair[0]] = pair[1]

print argdict

fo = open('config.py', 'w')

fo.write("OAUTH_CONFIG = { 'tw': { \n \
            'consumer_key': "+ argdict['consumer_key'] +", \n \
            'consumer_secret': "+ argdict['consumer_secret'] +", \n \
            'request_token_url': 'https://twitter.com/oauth/request_token', \n \
            'access_token_url': 'https://twitter.com/oauth/access_token', \n \
            'user_auth_url': 'http://twitter.com/oauth/authorize', \n \
            'default_api_prefix': 'http://twitter.com',\n \
            'default_api_suffix': '.json',\n \
            'account_url': 'https://api.twitter.com/1.1/account/verify_credentials.json', \n \
            'callback_url': "+ argdict['callback_url'] +",\n \
          }, \n \
          'internal': { \n \
            'logout_redirect_url': '/', \n \
          }\n \
        }")

fo.close()

