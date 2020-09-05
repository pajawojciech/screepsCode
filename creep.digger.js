var roleDigger = {
    run: function(creep) {
        var source = Game.getObjectById(creep.memory.sourceId);
        
	    if(creep.store.getFreeCapacity() > creep.body.filter(x => x.type == 'work').length * 2) 
	    {
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
            
            if(typeof(target) != 'undefined' && target != null && target.store.getFreeCapacity() != 0)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
            {
                creep.drop(RESOURCE_ENERGY);
            }
            creep.harvest(source);
        }
	}
};

module.exports = roleDigger;