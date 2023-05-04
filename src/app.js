require('dotenv').config();
const path = require('path');   // this will include core node module that is path into our file, this is added just to be organised
const express = require('express');
const hbs = require('hbs');   // in this way we load the hbs module in our file

const app = express();
const port = process.env.PORT || 3000;

// Importing functions from utils directory
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Define paths for Express Configuration
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views'); // we change the views directory
const partialsPath = path.join(__dirname, '../templates/partials'); // we create a directory for the partials folder

// Setup Handlebars Engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);   // we set up another setting for express, we changed the directory of the views folder to templates
hbs.registerPartials(partialsPath);   // this hbs.registerPartials take the path as an argument where the .hbs partials files will be there

// Setup Static Directory to serve
app.use(express.static(publicDirectoryPath));  // this becomes our main directory on our local host

// For index.hbs
app.get('', (req, res) => {   // Making it Dynamic
    res.render('index', {
        title: 'Weather',
        name: 'Kimaya Ved'
    });
});

// For about.hbs
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Kimaya Ved'
    });
});

// For help.hbs
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Kimaya Ved'
    });
});

// app/weather
app.get('/weather', (req, res) => {  // for weather page 
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        });
    }

    // Here we apply default function parameter by setting it to empty object
    geoCode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error           // its similar to "error: error" (shorthand property for ES6 js objects)
            });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error           // its similar to "error: error" (shorthand property for ES6 js objects)
                });
            }

            res.send({
                location,               // its similar to "location: location" (shorthand property for ES6 js objects)
                forecast: forecastData,
                address: req.query.address
            });
        })
    })
});

// For Help Error page          (Now this will be catch for help 404)
app.get('/help/*', (req, res) => {
    res.render('error404', {
        errorMessage: 'Help article not found.',
        title: 'Error 404',
        name: 'Kimaya Ved'
    });
});

// For Error page               (Now this will be catch all for any 404 that occurs)
app.get('*', (req, res) => {
    res.render('error404', {
        errorMessage: 'Page not found.',
        title: 'Error 404',
        name: 'Kimaya Ved'
    });
});

app.listen(port, () => {    // this will start our server
    console.log(`Server is up on port ${port}`);  // this will print in the terminal, and this will be only visible to us!
});