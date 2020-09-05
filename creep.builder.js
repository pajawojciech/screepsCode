var utils = require('utils.creep');

var roleBuilder = {
    run: function(creep) {
        var roomName = creep.memory.destRoom;
        if(typeof(roomName) == 'undefined')
        {
            roomName = creep.memory.room;
        }
        
        if(roomName != creep.room.name)
        {
            utils.goToRoom(creep, roomName);
            return true;
        }
        
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: (x) => x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_RAMPART});
        if(targets.length == 0) {
            delete creep.memory.destRoom;
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
                creep.moveTo(target, { maxRooms: 1});
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