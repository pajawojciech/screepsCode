var utils = require('utils.creep');

var roleUpgrader = {
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
	        var controller = Game.rooms[creep.room.name].controller;
            if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { range:3 });
            }
        }
        else {
            utils.getEnergy(creep);
        }
	}
};

module.exports = roleUpgrader;