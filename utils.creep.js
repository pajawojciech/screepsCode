module.exports = {
    getEnergy : function (creep, say)
    {
        var MAX_RANGE = 10;
       
        var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, MAX_RANGE, {filter : (x) => x.resourceType == RESOURCE_ENERGY});
        if(dropped.length > 0)
        {
            var closestDropped = creep.pos.findClosestByRange(dropped);
            var res = creep.pickup(closestDropped);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDropped, {maxRooms: 1});
            }
            if(say)creep.say('drop');
            return;
        }
        
        var containers = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && 
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 50;
            }
        });

        var contInRange = creep.pos.findInRange(containers, MAX_RANGE);
        if(contInRange.length > 0)
        {
            var closestContainer = creep.pos.findClosestByRange(containers);
            var res = creep.withdraw(closestContainer, RESOURCE_ENERGY);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer, {maxRooms: 1});
            }
            if(say)creep.say('cont' + MAX_RANGE);
            return;
        }

        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        
        if(creep.room.controller.owner == null || creep.room.controller.owner.username == creep.owner.username)
        {
            var sourcesInRange = creep.pos.findInRange(sources, MAX_RANGE);
            if(sourcesInRange.length > 0)
            {
                var closestSource = creep.pos.findClosestByRange(sourcesInRange);
                
                var res = creep.harvest(closestSource, RESOURCE_ENERGY);
                if(res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSource, {maxRooms: 1});
                }
                if(say)creep.say(res + 'source' + MAX_RANGE);
                return;
            }
        }

        if(containers.length > 0)
        {
            var closestContainer = creep.pos.findClosestByRange(containers);
            creep.moveTo(closestContainer, {maxRooms: 1});
            if(say)creep.say('cont L');
            return;
        }

        if(creep.room.controller.owner == null || creep.room.controller.owner.username == creep.owner.username)
        {
            var closestSource = creep.pos.findClosestByRange(sources);
            creep.moveTo(closestSource, {maxRooms: 1});
            if(say)creep.say('source L');
            return;
        }
        else
        {
            if(say)creep.say('false');
            return false;
        }
    },
    
    goToRoom : function (creep, roomName)
    {
        if(typeof(roomName) == 'undefined')
        {
            return;
        }

		creep.moveTo(new RoomPosition(25,25, roomName));
		return;

        var room = Game.rooms[roomName];
        if(typeof(room) != 'undefined')
        {
            creep.moveTo(Game.rooms[roomName].controller);
        }
        else
        {
            var direction = creep.room.findExitTo(roomName);
            var exit = creep.pos.findClosestByPath(direction);
            if(typeof(exit) != 'undefined' && exit != null)
            {
                creep.moveTo(exit);
            }
            else
            {
                creep.say('error');
            }
        }
    },
    
    dropResources : function(creep)
    {
        if(creep.store.getUsedCapacity() != creep.store.getUsedCapacity(RESOURCE_ENERGY))
        {
            creep.drop(RESOURCE_HYDROGEN);
        }
    }
    
};