module.exports = {
    getEnergy : function (creep)
    {
        var MAX_RANGE = 10;
        
        var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, MAX_RANGE);
        if(dropped.length > 0)
        {
            var closestDropped = creep.pos.findClosestByRange(dropped);
            var res = creep.pickup(closestDropped);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDropped);
            }
            return;
        }
        
        var containers = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && 
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        var contInRange = creep.pos.findInRange(containers, MAX_RANGE);
        if(contInRange.length > 0)
        {
            var closestContainer = creep.pos.findClosestByRange(containers);
            var res = creep.withdraw(closestContainer, RESOURCE_ENERGY);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer);
            }
            return;
        }
         
        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        
        var sourcesInRange = creep.pos.findInRange(sources, MAX_RANGE);
        if(sourcesInRange.length > 0)
        {
            var closestSource = creep.pos.findClosestByRange(sourcesInRange);
            
            var res = creep.withdraw(closestSource, RESOURCE_ENERGY);
            if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource);
            }
            return;
        }
                
        if(containers.length > 0)
        {
            var closestContainer = creep.pos.findClosestByRange(containers);
            var res = creep.withdraw(closestContainer, RESOURCE_ENERGY);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer);
            }
            return;
        }

        var closestSource = creep.pos.findClosestByRange(sources);
        var res = creep.withdraw(closestSource, RESOURCE_ENERGY);
        if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestSource);
        }
        creep.say('5');
    }
    
};