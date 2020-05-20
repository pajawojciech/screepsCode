var spawner = require('control.spawn');
var constructor = require('control.construction');
var creeps = require('control.creeps');

module.exports.loop = function () {
    
    constructor.run();
    spawner.run(); 
    creeps.run();

};