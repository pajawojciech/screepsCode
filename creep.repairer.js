var utils = require('utils.creep');

var roleRepairer = {
    run: function(creep) {
        if(creep.memory.work && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.work = false;
	    }
	    if(!creep.memory.work && creep.store.getFreeCapacity() == 0) {
	        creep.memory.work = true;
	    }
        
	    if(creep.memory.work) {
	        var target;
	        if(typeof(creep.memory.targetId) == 'undefined')
	        {
	            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType != STRUCTURE_WALL 
                            && structure.hits != structure.hitsMax);
                    }
                });
                
	            target = targets.sort(sortStructuresByHits)[0];
                if(target != null)
                {
                    creep.memory.targetId = target.id;
                }
	        }
	        else
	        {
	            target = Game.getObjectById(creep.memory.targetId);
	        }
	        
	        var res = creep.repair(target);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else if(res != OK || target.hits == target.hitsMax)
            {
                delete creep.memory.targetId;
            }
        }
        else {
            var ruins = creep.room.find(FIND_RUINS);
            if(ruins.length > 0) {
                var ruin = ruins[0];
	            var res = creep.withdraw(ruin, RESOURCE_ENERGY);
	            if(res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ruin);
                }    
            }
            else
            {
	            utils.getEnergy(creep);
            }
        }
	}
};

var sortStructuresByHits = function(x,y) //procentowo najsłabszy
{
    var xg = x.hits / x.hitsMax;
    var yg = y.hits / y.hitsMax;

    if(xg > yg)
    {
        return 1;
    }
    else if(xg == yg)
    {
        return 0;
    }
    return -1;
} 

module.exports = roleRepairer;