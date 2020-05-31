var spawner = require('control.spawn');
var memory = require('control.memory');
var constructor = require('control.construction');
var creeps = require('control.creeps');
var tower = require('control.tower');

module.exports.loop = function () {

    memory.run();
    constructor.run();
    spawner.run(); 
    creeps.run();
    tower.run();

};