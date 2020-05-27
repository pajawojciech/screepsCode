var roleCarrier = {
    run: function(creep) {
	    if(creep.store.getUsedCapacity() == 0) 
	    {
	        if(typeof(creep.memory.containerId) == 'undefined')
	        {
    	        var s = Memory.sources
    	            .filter((x) => typeof(x.containerId) != 'undefined' )
    	            .map((x) => x.containerId)
    	            .sort(sortContainers);

                if(s.length > 0)
                {
                    creep.memory.containerId = s[0];
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
            var x = Memory.sources.map((x) => x.containerId);
            if(typeof(creep.memory.targetId) == 'undefined')
	        {
    	        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) 
                    && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    && !(x.includes(structure.id));
                    }
                });    

                if(target != null)
                {
                    creep.memory.targetId = target.id;
                }
                else if(typeof(creep.room.storage) != 'undefined')
                {
                    creep.memory.targetId = creep.room.storage.id;
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