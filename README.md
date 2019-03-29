# Autograder CSE 496dl


## Backend



## FrontEnd

The front end consists of a basic React-Redux app and was bootstrapped
with [Create React App](https://github.com/facebook/create-react-app).
The project supports confusion matrix views as well as competition
tracking of error rate (for classification problems), or reward (for
reinforcement learning).

### Running and Building

As this project was boostrapped with Create React App, the following
commands will work for development and deployment:

* `npm start` - Starts a local development server and will recompile
  whenever source code is modified.
* `npm run build` - Builds a production-ready build in the `build/`
  directory. Drop the contents of this directory into your webserver.


### Configuration

There is little configuration as this project is exteremely basic. To
configure the front end, simply modify the the `public/config.json`
file. The fields include:

* `title`: The title presented to users on the page.
* `dataPath`: The location of the score JSON file, relative to the
  directory in which the front end is located.
* `type`: The type of homework to show. Currently supported types are
  `classification` and `value` (used for reward).
