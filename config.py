OAUTH_CONFIG = { 'tw': { 
             'consumer_key': 'oTZTgCb8j9rDWRRj9y3bYH3rb', 
             'consumer_secret': 'GNJG0HurTDuVRj6vcbFAi366d1p82Ahg4hjUw6qF3inVaud9wn', 
             'request_token_url': 'https://twitter.com/oauth/request_token', 
             'access_token_url': 'https://twitter.com/oauth/access_token', 
             'user_auth_url': 'http://twitter.com/oauth/authorize', 
             'default_api_prefix': 'http://twitter.com',
             'default_api_suffix': '.json',
             'account_url': 'https://api.twitter.com/1.1/account/verify_credentials.json', 
             'callback_url': 'http://localhost:3000/twitterauthorized',
           }, 
           'internal': { 
             'logout_redirect_url': '/', 
           }
         }