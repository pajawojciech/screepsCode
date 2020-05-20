var utils = require('utils.creep');

var roleHarvester = {
    run: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && 
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        if(targets.length == 0) {
            return false;
        }
        
        if(creep.memory.transf && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transf = false;
	    }
	    if(!creep.memory.transf && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transf = true;
	    }
        
	    if(creep.memory.transf) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                var res = creep.moveTo(targets[0]);
            }
        }
        else {
	        utils.getEnergy(creep);
        }
        return true;
	}
};

module.exports = roleHarvester;