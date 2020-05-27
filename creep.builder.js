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
	        var target = creep.pos.findClosestByRange(targets);
	        var res = creep.build(target) ;
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else if(res == ERR_INVALID_TARGET)
            {
                if(creep.pos.x == target.pos.x && creep.pos.y == target.pos.y)
                {
                    creep.move(Math.floor(Math.random() * 8 + 1));
                }
            }
	    }
	    else {
	        utils.getEnergy(creep);
	    }
	    return true;
	}
};

module.exports = roleBuilder;