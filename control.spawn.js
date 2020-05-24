var roleSpawn = {
    run: function()
    {
        if(Game.spawns['Spawn1'].spawning != null) return;
        if(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS).length > 0)
        {
            checkAndCreate('a', 5);
        }
        
        if(checkAndCreate('h'))
        {
            if(Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0)
            {
                checkAndCreate('b');
            }
            
            var d = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
            if(d > 0)
            {
                checkAndCreate('u');

                d = 0;
                var dLimit = getBody('d', Game.spawns['Spawn1'].room.energyCapacityAvailable).limit;
                if(typeof(dLimit) == 'undefined') dLimit = 0;
                for(var i in Memory.sources)
                {
                    var mem = Memory.sources[i];
                    if(typeof(mem.containerId) != 'undefined')
                    {
                        var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'd' && creep.memory.sourceId == mem.sourceId);  
                        var limit = (mem.space > dLimit) ? dLimit : mem.space;
                        
                        d += limit;
                        
                        if(cr.length < limit)
                        {
                            var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'd' && typeof(creep.memory.sourceId) == 'undefined');
                            if(crFree.length > 0)
                            {
                                crFree[0].memory.sourceId = mem.sourceId;
                            }
                        }
                    }
                }
                if(checkAndCreate('d', d) && Game.spawns['Spawn1'].memory.containerCount > Memory.sources.length)
                {
                    checkAndCreate('r');
                    checkAndCreate('c');

                    var ill = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, { filter: (x) => x.hits < x.hitsMax });
                    if(ill.length > 0)
                    {
                        checkAndCreate('he');
                    }
                }
            }
        }
    }
};

var checkAndCreate = function(role, limit) //zwraca informację, czy limit spełniony
{
    var sp = Game.spawns['Spawn1'];
    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.ticksToLive > 50);
	var energyCap = Game.spawns['Spawn1'].room.energyCapacityAvailable;
	
	if((role == 'h' || role == 'd') && cr.length == 0)
	{
	    energyCap = (sp.room.energyAvailable > 300) ? sp.room.energyAvailable : 300;
	}
	
    var conf = getBody(role, energyCap);
    if(typeof(limit) == 'undefined')
    {
        limit = conf.limit;
    }
    
	if(cr.length < limit) {
		var newName = role + Game.time;
        var body = conf.body;
		var res = Game.spawns['Spawn1'].spawnCreep(body, newName, {memory: {role: role}});
		if(res == 0)
		{
		    console.log('Spawning new ' + newName);
		}
		else
		{
		    //console.log(res + body + ' ' + newName);
		}
		return false;
	}
	else
	{
	    return true;
	}
};

var getBody = function(role, limit)
{
    limit = Math.floor(limit / 50) * 50;
    var body = bodyDict[role + limit];
    
    while(typeof(body) == 'undefined' && limit >= 100)
    {
        limit = limit - 50;
        body = bodyDict[role + limit];
    }

    return {
        "limit": body[0],
        "body": body[1]
    };
}

var bodyDict = {
  "h300" : [2, [CARRY, CARRY, CARRY, MOVE, WORK]], 
  "b300" : [2, [CARRY, MOVE, WORK, WORK]],
  "u300" : [0, [CARRY, CARRY, MOVE, WORK]],
  "d300" : [3, [CARRY, MOVE, WORK, WORK]],
  "r300" : [1, [CARRY, MOVE, WORK]],
  "c300" : [0, [CARRY, MOVE]],
  "a300" : [1, [TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK, MOVE]],
  "he300" : [1, [HEAL, MOVE]],
  
  "h400" : [2, [CARRY, CARRY, CARRY, MOVE, MOVE, WORK]],
  "b400" : [3, [CARRY, CARRY, CARRY, MOVE, MOVE, WORK]],
  "u400" : [0, [CARRY, MOVE, WORK, WORK, WORK]],
  "d400" : [2, [CARRY, MOVE, WORK, WORK, WORK]],
  "c400" : [2, [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]],

  "h500" : [2, [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK]],
  "b500" : [3, [CARRY, CARRY, CARRY, MOVE, WORK, WORK, WORK]],
  "u500" : [2, [CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK]],
  "d500" : [2, [CARRY, MOVE, WORK, WORK, WORK, WORK]],
  "c500" : [2, [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]],
  "a500" : [1, [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,ATTACK,RANGED_ATTACK]],
  
  "h600" : [2, [MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]],
  "b600" : [2, [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK]],
  "u600" : [2, [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK]],
  "d600" : [2, [CARRY, MOVE, WORK, WORK, WORK, WORK, WORK]],
  "c600" : [3, [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]],
  
  "d800" : [1, [CARRY, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK]],
  "c800" : [3, [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]],
  
  "d1000" : [1, [CARRY, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]],
  "c1000" : [4, [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]],
  "u1000" : [1, [CARRY, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]],
};

module.exports = roleSpawn;




