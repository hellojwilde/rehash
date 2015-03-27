# rehash

Simple broadcasting for online dialogues. In a nutshell, you:

1. Schedule a meeting and invite some people to it.
2. People submit questions and you answer them live, on-air.
3. Rehash automatically slices the broadcast into short, shareable clips.

A [Tufts](http://www.tufts.edu/) [School of Engineering](http://engineering.tufts.edu/) senior capstone project. In partnership with [The GroundTruth Project](http://thegroundtruthproject.org/).

## Development

To set it up locally, you'll need the following prerequisites:

- [Google App Engine SDK](https://cloud.google.com/appengine/downloads) for Python
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- The [Webpack](webpack.github.io) CLI, which you can install with `npm install -g webpack`

Once you've got that set up check out the code:

    git clone https://github.com/hellojwilde/rehash.git
    cd rehash/src
  
Then build the JavaScript for the client-side webapp:

    webpack
  
You'll need to re-run webpack everytime you change any code in the app.
  
And finally, add `rehash/src` to the Google App Engine Launcher as an application, run the application, and then open the URL that you set it to run at.
  
