module.exports = {
    getEnergy : function (creep)
    {
        var sources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10); //TODO dodaj filter where resoruceType == RESOURCE_ENERGY //TODO po³¹cz dropniête z containerami
        if(sources.length > 0)
        {
            var closestSource = creep.pos.findClosestByRange(sources);
            var res = creep.pickup(closestSource);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource);
            }
        }
        else
        {
            sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && 
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
            });

            var contInRange = creep.pos.findInRange(sources, 10);
            
            //console.log('cont in range ' + contInRange.len)
            if(contInRange.length > 0)
            {
                var closestSource = creep.pos.findClosestByRange(sources);
                var res = creep.withdraw(closestSource, RESOURCE_ENERGY);
                if(res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSource);
                }
            }
            else
            {
                var sourcesInRange = creep.pos.findInRange(FIND_SOURCES_ACTIVE, 10);
                if(sourcesInRange.length > 0)
                {
                    if(creep.harvest(sourcesInRange[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sourcesInRange[0]);
                    }
                }
                else{
                    if(sources.length > 0)
                    {
                        var closestSource = creep.pos.findClosestByRange(sources);
                        var res = creep.withdraw(closestSource, RESOURCE_ENERGY);
                        if(res == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closestSource);
                        }
                    }
                    else
                    {
                        sources = creep.room.find(FIND_SOURCES_ACTIVE);
                        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0]);
                        }
                    }
                }
            }
        }
    }
};