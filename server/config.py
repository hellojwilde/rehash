# 'callback_url': 'https://pure-zoo-87404.appspot.com/twitterauthorized/',

OAUTH_CONFIG = {
	'tw': {
    'consumer_key': '4MBc4zxmgEWQgtcR92kembkRy',
    'consumer_secret': '5XOPtiAJa8tKDNChOeSsK4J9jkiw5vHmdKffaaolG03G86i4Qk',
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