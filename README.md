# DISCLAIMER

## This software is experimental and under development. In no way can it be considered a finished product.

# A simple CMS written in Node JS 

## To install all the requirements:

* Download and install node.js
* Download and install npm
* npm install underscore
* npm install express
* npm install mongoose
* npm install jade
* npm install optimist
* npm install docco

Docco requires Pygments. On Debian based systems you can install these with the following command:

* sudo aptitude install python-pygments

You will also require Foreman if you wish to start the process using the Procfile. Foreman comes as part of the Heroku toolbelt. Please see here for further information:

* http://devcenter.heroku.com/articles/procfile  

## To generate the documentation do this:

* chmod u+x doc-generator.sh
* ./doc-generator.sh

## To start the server:

* node js/simple-cms.js --env=dev --ac_config=config/settings.js

### or with Foreman:

* foreman start

## To access the app:

* http://localhost:8000

## To access the config:

* http://localhost:8000/config

## To access the docs:

* http://localhost:8000/docs

## Heroku ready!

* Set up a new Heroku app 
* git push heroku master
