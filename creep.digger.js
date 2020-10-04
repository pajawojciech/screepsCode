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
	},
	
	prepare : function(sp, getBody)
    {
        var eca = sp.memory.eca;
        var d = 0;
        var dLimit = getBody('d', eca).limit;
        if(typeof(dLimit) == 'undefined') dLimit = 0;
        var sources = Memory.sources.filter((x) => x.home == sp.room.name);
        for(var i in sources)
        {
            var mem = sources[i];
            if(typeof(mem.containerId) != 'undefined')
            {
                var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'd' && creep.memory.room == sp.room.name && creep.memory.sourceId == mem.sourceId);  
                var limit = (mem.space > dLimit) ? dLimit : mem.space;
                
                d += limit;
                
                if(cr.length < limit)
                {
                    var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'd' && creep.memory.room == sp.room.name && typeof(creep.memory.sourceId) == 'undefined');
                    if(crFree.length > 0)
                    {
                        crFree[0].memory.sourceId = mem.sourceId;
                    }
                }
            }
        }
        return d;
    }

};

module.exports = roleDigger;