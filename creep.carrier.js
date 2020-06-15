var roleCarrier = {
    run: function(creep) {
        var GET_FROM_STORAGE = false;
        
        if(typeof(creep.memory.steal) != 'undefined')
        {
            if(creep.store.getFreeCapacity() == 0)
            {
                var storage = Game.getObjectById('5ececa7a8abf3530e03c1d17');
                var res = creep.transfer(storage, RESOURCE_HYDROGEN);
                if(res == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(storage);
                }
            }
            else
            {
                if(creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
                {
                    creep.drop(RESOURCE_ENERGY);
                }
                var target = Game.getObjectById(creep.memory.steal);
                creep.moveTo(target);
                var res = creep.withdraw(target, RESOURCE_HYDROGEN);
            }
            
            return;
        }
        
	    if(creep.store.getUsedCapacity() < creep.store.getCapacity() / 2) 
	    {
	        delete creep.memory.targetId;

            var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2, {filter : (x) => x.resourceType == RESOURCE_ENERGY});
            if(dropped.length > 0)
            {
                var closestDropped = creep.pos.findClosestByRange(dropped);
                var res = creep.pickup(closestDropped);
                if(res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestDropped);
                }
                return;
            }

	        if(typeof(creep.memory.containerId) == 'undefined')
	        {
	            if(typeof(creep.memory.assignedCont) != 'undefined')
	            {
	                var ac = Game.getObjectById(creep.memory.assignedCont);
	                if(ac != null && ac.store.getUsedCapacity(RESOURCE_ENERGY) > 300)
	                {
	                    creep.memory.containerId = creep.memory.assignedCont;
	                }
	            }
	            
	            if(typeof(creep.memory.containerId) == 'undefined')
	            {
        	        var s = Memory.sources
        	            .filter((x) => typeof(x.containerId) != 'undefined' && x.home == creep.memory.room )
        	            .map((x) => x.containerId)
        	            .sort(sortContainers);

                    if(s.length > 0)
                    {
                        creep.memory.containerId = s[0];
                    }
	            }

                if(GET_FROM_STORAGE && typeof(creep.room.storage) != 'undefined' && creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
                {
                    creep.memory.containerId = creep.room.storage.id;
                }
	        }
                
            var c = Game.getObjectById(creep.memory.containerId);
            var res = creep.withdraw(c, RESOURCE_ENERGY);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(c.pos);
            }
            else
            {
                delete creep.memory.containerId;
            }
        }
        else 
        {
            delete creep.memory.containerId;
            var x = Memory.sources.map((x) => x.containerId);
            var room = Game.rooms[creep.memory.room];
            
            if(typeof(creep.memory.targetId) == 'undefined')
	        {
    	        var targets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) 
                    && structure.store.getFreeCapacity(RESOURCE_ENERGY) > creep.store.getCapacity() / 2
                    && !(x.includes(structure.id));
                    }
                });

                if(targets.length > 0 && Game.time % 100 != 0)
                {
                    creep.memory.targetId = minEnergy(targets).id;
                }
                else if(typeof(room.storage) != 'undefined')
                {
                    creep.memory.targetId = room.storage.id;
                }
                else
                {
                    creep.moveTo(room.controller);
                }
	        }
	        
	        var target = Game.getObjectById(creep.memory.targetId);
            
            if(typeof(target) != 'undefined')
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else
                {
                    delete creep.memory.targetId;
                }
            }
        }
	}
};

var minEnergy = function(targets)
{
    var res;
    for(var t in targets)
    {
        var temp = targets[t];
        if(typeof(res) == 'undefined')
        {
            res = temp;
        }
        else
        {
            if(res.store.getUsedCapacity(RESOURCE_ENERGY) > temp.store.getUsedCapacity(RESOURCE_ENERGY))
            {
                res = temp;
            }
        }
    }
    return res;
}

var sortContainers = function(x,y) 
{
    var xg = Game.getObjectById(x); 
    var yg = Game.getObjectById(y);
    if(xg == null)
    {
        return 1;
    }
    if(yg == null)
    {
        return -1;
    }
    if(xg.store.getFreeCapacity() > yg.store.getFreeCapacity())
    {
        return 1;
    }
    else if(xg.store.getFreeCapacity() == yg.store.getFreeCapacity())
    {
        return 0;
    }
    return -1;
} 

module.exports = roleCarrier;