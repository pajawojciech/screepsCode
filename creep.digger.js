var roleDigger = {
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) 
	    {
            var source = Game.getObjectById(creep.memory.sourceId);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else 
        {
            var target;
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
                }
            });
            
            if(target.store.getFreeCapacity() != 0)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
            {
                creep.drop(RESOURCE_ENERGY);
            }
        }
	}
};

module.exports = roleDigger;