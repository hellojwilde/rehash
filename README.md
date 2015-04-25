# rehash

[![Build Status](https://travis-ci.org/hellojwilde/rehash.svg?branch=master)](https://travis-ci.org/hellojwilde/rehash)

Simple broadcasting for online dialogues. In a nutshell, you:

1. Schedule a meeting and invite some people to it.
2. People submit questions and you answer them live, on-air.
3. Rehash automatically slices the broadcast into short, shareable clips.

A [Tufts](http://www.tufts.edu/) [School of Engineering](http://engineering.tufts.edu/) senior capstone project. In partnership with [The GroundTruth Project](http://thegroundtruthproject.org/).



## Installing

To set it up locally, you'll need the following already installed:

- [Google App Engine SDK](https://cloud.google.com/appengine/downloads) for Python
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- The [Webpack](http://webpack.github.io) CLI, which you can install with `npm install -g webpack`

Once you've got that set up check out the code:

    git clone https://github.com/hellojwilde/rehash.git
    cd rehash/src
  
Then build the JavaScript for the client-side webapp:

    webpack
  
You'll need to re-run webpack everytime you change any code in the app.
  
Under rehash/, 'config_generate.py' which allows you to run and generate various OAuth parameters for Twitter login. Please run the following command to generate a valid 'config.py':

> python config_generate.py --consumer_key=$CONSUMER_KEY --consumer_secret=$CONSUMER_SECRET --callback_url=$CALLBACK_URL

where $CONSUMER_KEY and $CONSUMER_SECRET can be found from Keys and Access Tokens section of your own twitter application management page. Once login is successufl, users will be redirected to the $CALLBACK_URL as specified in the command above. 

And finally, add `rehash/src` to the Google App Engine Launcher as an application, run the application, and then open the URL that you set it to run at.



## Deployment

Just deploy it from the Google App Engine Launcher. Boom, done.
  


## Known issues and solutions

Issue 1: If you are testing on localhost with dev_appserver.py or Google App Engine Launcher, you may encouter "TypeError: must be _socket.socket, not socket" & “ImportError: No module named _ssl”

Solution: here is a workaround at https://stackoverflow.com/questions/16192916/importerror-no-module-named-ssl-with-dev-appserver-py-from-google-app-engine/16937668#16937668

