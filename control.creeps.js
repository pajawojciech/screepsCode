var roleHarvester = require('creep.harvester');
var roleUpgrader = require('creep.upgrader');
var roleBuilder = require('creep.builder');
var roleDigger = require('creep.digger');
var roleCarrier = require('creep.carrier');

module.exports = {
    run: function()
    {
        for(var name in Game.creeps) 
        {
            var creep = Game.creeps[name];
        
            if(creep.memory.role == 'h') {
                if(!roleHarvester.run(creep))
                {
                    roleUpgrader.run(creep);
                }
            }
            if(creep.memory.role == 'u') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'b') {
                if(!roleBuilder.run(creep))
                {
                    roleUpgrader.run(creep);
                }
            }
            if(creep.memory.role == 'd') {
                roleDigger.run(creep);
            }
            if(creep.memory.role == 'c') {
                roleCarrier.run(creep);
            }
            
        }
    }
};