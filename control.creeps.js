var roleHarvester = require('creep.harvester');
var roleUpgrader = require('creep.upgrader');
var roleBuilder = require('creep.builder');
var roleDigger = require('creep.digger');
var roleCarrier = require('creep.carrier');
var roleRepairer = require('creep.repairer');
var roleAttacker = require('creep.attacker');
var roleHealer = require('creep.healer');
var roleClaimer = require('creep.claimer');
var roleTroll = require('creep.troll');

module.exports = {
    run: function()
    {
        for(var name in Game.creeps) 
        {
            var creep = Game.creeps[name];
            if(typeof(creep.ticksToLive) == 'undefined')
            {
                continue;
            }
            
            if(creep.memory.role == 'h') {
                if(!roleHarvester.run(creep))
                {
                    //roleUpgrader.run(creep);
                }
            }
            if(creep.memory.role == 'u') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'b') {
                if(!roleBuilder.run(creep))
                {
                    roleRepairer.run(creep);
                }
            }
            if(creep.memory.role == 'd') {
                roleDigger.run(creep);
            }
            if(creep.memory.role == 'c') {
                roleCarrier.run(creep);
            }
            if(creep.memory.role == 'r') {
                roleRepairer.run(creep);
            }
            if(creep.memory.role == 'a') {
                roleAttacker.run(creep);
            }
            if(creep.memory.role == 'he') {
                roleHealer.run(creep);
            }
            if(creep.memory.role == 'cl') {
                roleClaimer.run(creep);
            }
            if(creep.memory.role == 't') {
                roleTroll.run(creep);
            }
        }
    }
};