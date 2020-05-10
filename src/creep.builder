var utils = require('utils.creep');

var roleBuilder = {
    run: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length == 0) {
            return false;
        }

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
	    }
	    else {
	        utils.getEnergy(creep);
	    }
	    return true;
	}
};

module.exports = roleBuilder;