var roleDigger = {
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) 
	    {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else 
        {
            var targets;
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if(targets.length > 0) 
            {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
	}
};

module.exports = roleDigger;