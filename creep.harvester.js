var utils = require('utils.creep');

var roleHarvester = {
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ) && 
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) 
                    || (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 150);
            }
        });
        
        if(target == null) {
            return false;
        }
        
        if(creep.memory.transf && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transf = false;
	    }
	    if(!creep.memory.transf && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transf = true;
	    }
        
	    if(creep.memory.transf) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                var res = creep.moveTo(target);
            }
        }
        else {
	        utils.getEnergy(creep);
        }
        return true;
	}
};

module.exports = roleHarvester;