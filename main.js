var spawner = require('control.spawn');
var memory = require('control.memory');
var constructor = require('control.construction');
var creeps = require('control.creeps');
var tower = require('control.tower');
var market = require('control.market');

module.exports.loop = function () {

    memory.run();
    spawner.run(); 
    creeps.run();
    
    if(Game.time % 10 == 0)
    {
        constructor.run();
    }
    
    if(Game.cpu.getUsed() < 20)
    {
        tower.run();
    }
    
    if(Game.cpu.getUsed() < 20)
    {
        market.run();
    }
 
};

