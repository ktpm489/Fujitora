const identifier = require('idgen');
//TODO - use custom id generator
const validUrl = require('valid-url');
//TODO - use regex instead
const Url = require('../models/url');


module.exports = (app, config) => {

    app.post('/api/v1/shorten', (req, res) => {
        const id = identifier(3);
        const shortened = config.baseUrl + id;

        if (!validUrl.isUri(req.body.url)){
            res.status(400).json({
                message: 'Please input a valid url'
            });
        } else {
            const shortenedUrl  = new Url({
                long: req.body.url,
                short: shortened,
                id,
            });
            shortenedUrl.save((error) => {
                if (error) {
                    res.status(400).json({
                        message: "Error saving to db",
                        error,
                    })
                } else {
                    res.status(201).json({
                        long: req.body.url,
                        short: shortened,
                        id,
                    })
                }
            });
        }
    });

    app.get('/:id', (req, res) => {
        Url.findOne({
            id: req.params.id
        }, (error, url) =>{
            if (error) {
                res.redirect(config.baseUrl);
            }
            if (url) {
                res.redirect(301, url.long);
            }
            else {
                res.status(404).json({
                    info:"Url not found"
                });
            }
        })
    });
};