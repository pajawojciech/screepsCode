var utils = require('utils.creep');
var roleUpgrader = require('creep.upgrader');

var roleRepairer = {
    run: function(creep) {
        //var unwanted = Game.getObjectById('4a1a4c0ddb29064');
        //if(unwanted != null)
        {
            //creep.moveTo(unwanted);
            //creep.dismantle(unwanted);
            //return;
        }
        
        var roomName = creep.memory.destRoom;
        if(typeof(roomName) == 'undefined')
        {
            roomName = creep.memory.room;
        }

        if(roomName != creep.room.name)
        {
            delete creep.memory.targetId;
            utils.goToRoom(creep, roomName);
            return true;
        }
        
        if(creep.room.controller.my && creep.room.controller.level == 1)
        {
            roleUpgrader.run(creep);
            return;
        }
        
        if(creep.memory.work && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.work = false;
            delete creep.memory.targetId;
	    }
	    if(!creep.memory.work && creep.store.getFreeCapacity() == 0) {
	        creep.memory.work = true;
	    }
        
	    if(creep.memory.work) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: (x) => x.structureType == STRUCTURE_WALL || x.structureType == STRUCTURE_RAMPART});
	        if(targets.length > 0)
	        {
    	        var target = creep.pos.findClosestByRange(targets);
    	        var res = creep.build(target) ;
                if(res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { maxRooms : 1 });
                }
                else if(res == ERR_INVALID_TARGET)
                {
                    if(creep.pos.x == target.pos.x && creep.pos.y == target.pos.y)
                    {
                        creep.move(Math.floor(Math.random() * 8 + 1));
                    }
                }
                delete creep.memory.targetId;
                return;
	        }
	        
	        var target;
	        if(typeof(creep.memory.targetId) == 'undefined')
	        {
	            var targets;
	            var spArr = creep.room.find(FIND_STRUCTURES, {filter: (x) => x.structureType == STRUCTURE_SPAWN});
	            var sp;
	            if(spArr.length > 0)
	            {
	                sp = spArr[0];
	            }

	            if(typeof(sp) == 'undefined' || typeof(sp.memory.towerId) == 'undefined')
	            {
	                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            ((structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) || structure.hits < 10000)
                            && structure.hits != structure.hitsMax);
                        }
                    });
                    target = targets.sort(sortStructuresByHits)[0];
	            }
	            else
	            {
	                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits != structure.hitsMax);
                        }
                    });
                    target = targets.sort(sortStructuresByHits2)[0];
	            }
	            
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
                creep.moveTo(target, {maxRooms: 1});
            }
            else if(res != OK || target.hits == target.hitsMax)
            {
                delete creep.memory.targetId;
            }
        }
        else {
            var ruins = creep.room.find(FIND_RUINS, {
                filter: function(object) {
                    return object.store.getUsedCapacity() > 0;
                }
            });
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

var sortStructuresByHits2 = function(x,y) //procentowo najsłabszy
{
    var xg = x.hits;
    var yg = y.hits;

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