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
	},
	
	prepare : function(sp, getBody)
    {
        var eca = sp.memory.eca;
        var b = sp.room.find(FIND_CONSTRUCTION_SITES, { filter: (x) => x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_RAMPART}).length > 0 ? getBody('b', eca).limit : 0;
        var claims = Memory.claim.filter((x) => x.home == sp.room.name );
        for(var i in claims)
        {
            var roomName = claims[i].room;
            var claimRoom = Game.rooms[roomName];
            if(typeof(claimRoom) != 'undefined' && claimRoom.find(FIND_CONSTRUCTION_SITES, { filter: (x) => x.my }).length > 0)
            {
                var t = getBody('b', eca).limit;
                b = b + t;
                //if(claimRoom.controller.my)
                //{
                    //b += 1;
                    //t = 2;
                //}
                
                var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'b' && creep.memory.destRoom == roomName && creep.memory.room == sp.room.name).length; 
                if(cr < t)
                {
                    var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'b' && creep.memory.room == sp.room.name && typeof(creep.memory.destRoom) == 'undefined');
                    if(crFree.length > 0)
                    {
                        crFree[0].memory.destRoom = roomName;
                    }
                }
            }
        }
        return b;
    }
};

module.exports = roleBuilder;