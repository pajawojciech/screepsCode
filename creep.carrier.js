var cm = require('utils.common');

var roleCarrier = {
    run: function(creep) {
        var GET_FROM_STORAGE = false;
         
        if(typeof(creep.memory.stealFrom) != 'undefined')
        {
            //if(creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            {
                //creep.drop(RESOURCE_ENERGY);
            }
            var type = creep.memory.stealType;
            
            if(creep.store.getFreeCapacity() == 0)
            {
                var target = Game.getObjectById(creep.memory.stealTo);
                var res = creep.transfer(target, type);
                if(res == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }
            else
            {
                var target = Game.getObjectById(creep.memory.stealFrom);
                var res = creep.withdraw(target, type);
                if(res == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
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
        	        var containers = Memory.sources
        	            .filter((x) => typeof(x.containerId) != 'undefined' && x.home == creep.memory.room )
        	            .map((x) => x.containerId);
        	            
        	        var mm = cm.getMinMax(containers, x => getContainerFreeCapacity(x));
        	        if(mm != null)
        	        {
        	            creep.memory.containerId = mm.minObj;
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
                    var mm = cm.getMinMax(targets, x => x.store.getUsedCapacity(RESOURCE_ENERGY));
                    if(mm != null)
                    {
                        creep.memory.targetId = mm.minObj.id;
                    }
                }
                else if(typeof(room.terminal) != 'undefined' && room.terminal.store.getFreeCapacity() > 0)
                {
                    creep.memory.targetId = room.terminal.id;
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

var getContainerFreeCapacity = function(x)
{
    var obj = Game.getObjectById(x);
    if(obj == null)
    {
        return 0;
    }
    else
    {
        return obj.store.getFreeCapacity();
    }
}

module.exports = roleCarrier;