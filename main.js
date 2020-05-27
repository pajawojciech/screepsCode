var spawner = require('control.spawn');
var constructor = require('control.construction');
var creeps = require('control.creeps');
var tower = require('control.tower');

module.exports.loop = function () {

    constructor.run();
    spawner.run(); 
    creeps.run();
    tower.run();

};