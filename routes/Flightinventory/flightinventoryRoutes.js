
// const express = require('express');
const { getFlight } = require('../../controllers/flightinventoryController/flightInventoryController');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
  
    app.post('/skyTrails/api/Inventory/flights',getFlight);   
}