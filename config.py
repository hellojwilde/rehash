OAUTH_CONFIG = {         	'tw': { 
             'consumer_key': a, 
             'consumer_secret': b, 
             'request_token_url': 'https://twitter.com/oauth/request_token', 
             'access_token_url': 'https://twitter.com/oauth/access_token', 
             'user_auth_url': 'http://twitter.com/oauth/authorize', 
             'default_api_prefix': 'http://twitter.com',
             'default_api_suffix': '.json',
             'account_url': 'https://api.twitter.com/1.1/account/verify_credentials.json', 
             'callback_url': c,
           }, 
           'internal': { 
             'logout_redirect_url': '/', 
           }
         }