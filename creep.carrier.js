var roleCarrier = {
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) 
	    {
	        var s = Memory.sources.filter(function(x) { return typeof(x.containerId) != 'undefined' } ).sort(sortContainers);
            console.log(s.map(function (x) {return x.id} ));
            //var source = Game.getObjectById(creep.memory.sourceId);
            //if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                //creep.moveTo(source);
            //}
        }
        else 
        {
            //var targets;
            //targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                //filter: (structure) => {
                    //return (structure.structureType == STRUCTURE_CONTAINER) 
                    //&& structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    //;
                //}
            //});
            
            //if(targets.length > 0) 
            //{
                //if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    //creep.moveTo(targets);
                //}
            //}
        }
	}
};

var sortContainers = function(x,y) 
{
    var xg = Game.getObjectById(x.newContainer); 
    var yg = Game.getObjectById(y.newContainer);
    if(xg == null)
    {
        return 1;
    }
    if(yg == null)
    {
        return -1;
    }
    if(xg.getFreeCapacity() > yg.getFreeCapacity())
    {
        return 1;
    }
    else if(xg.getFreeCapacity() == yg.getFreeCapacity())
    {
        return 0;
    }
    return -1;
} 

module.exports = roleCarrier;