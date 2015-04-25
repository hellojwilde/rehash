#!/usr/bin/python

"""
This script generatess various OAuth parameters for Twitter login. 
Please run the following command to generate a valid 'config.py':
  >>> python config_generate.py --consumer_key=$CONSUMER_KEY --consumer_secret=$CONSUMER_SECRET
  ...                           --callback_url=$CALLBACK_URL
where $CONSUMER_KEY and $CONSUMER_SECRET can be found from Keys and Access Tokens section of your own 
twitter application management page. Once login is successufl, users will be redirected to the $CALLBACK_URL
as specified in the command above. 
"""

import sys

argdict = {}
iterargv = iter(sys.argv)
next(iterargv)
for arg in iterargv:
  pair=arg.split("=", 2)
  argdict[pair[0]] = pair[1]

fo = open('config.py', 'w')
fo.write("OAUTH_CONFIG = { 'tw': { \n \
            'consumer_key': '"+ argdict['--consumer_key'] +"', \n \
            'consumer_secret': '"+ argdict['--consumer_secret'] +"', \n \
            'request_token_url': 'https://twitter.com/oauth/request_token', \n \
            'access_token_url': 'https://twitter.com/oauth/access_token', \n \
            'user_auth_url': 'http://twitter.com/oauth/authorize', \n \
            'default_api_prefix': 'http://twitter.com',\n \
            'default_api_suffix': '.json',\n \
            'account_url': 'https://api.twitter.com/1.1/account/verify_credentials.json', \n \
            'callback_url': '"+ argdict['--callback_url'] +"',\n \
          }, \n \
          'internal': { \n \
            'logout_redirect_url': '/', \n \
          }\n \
        }")
fo.close()

