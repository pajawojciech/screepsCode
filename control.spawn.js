var roleSpawn = {
    run: function()
    {
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
                for(var i in Memory.sources)
                {
                    var mem = Memory.sources[i];
                    if(typeof(mem.containerId) != 'undefined')
                    {
                        var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'd' && creep.memory.sourceId == mem.sourceId);  
                        var limit = (mem.space > 2) ? 2 : mem.space;
                        
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
                checkAndCreate('d', d);
            }
        }
    }
};

var checkAndCreate = function(role, limit) //zwraca informację, czy limit spełniony
{
    var sp = Game.spawns['Spawn1'];
    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == role);   
	var energyCap = Game.spawns['Spawn1'].room.energyCapacityAvailable;
	
	if(role == 'h' && cr.length == 0)
	{
	    energyCap = (sp.room.energyAvailable > 300) ? sp.room.energyAvailable : 300;
	}
	else
	{
	    energyCap = Math.floor(energyCap / 100) * 100;
	}

	if(energyCap > 600)
	{
		energyCap = 600;
	}
	
    var conf = bodyDict[role + energyCap];
    if(typeof(limit) == 'undefined')
    {
        limit = conf[0];
    }
    
	if(cr.length < limit) {
		var newName = role + Game.time;
        var body = conf[1];
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

var bodyDict = {
  "h300" : [2, [CARRY, CARRY, CARRY, MOVE, WORK]], 
  "b300" : [2, [CARRY, MOVE, WORK, WORK]],
  "u300" : [0, [CARRY, CARRY, MOVE, WORK]],
  "d300" : [3, [CARRY, MOVE, WORK, WORK]],
  
  "h400" : [2, [CARRY, CARRY, MOVE, MOVE, MOVE, WORK]],
  "b400" : [3, [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK]],
  "u400" : [0, [CARRY, MOVE, WORK, WORK, WORK]],
  "d400" : [2, [CARRY, MOVE, WORK, WORK, WORK]],

  "h500" : [2, [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, WORK, WORK]],
  "b500" : [3, [CARRY, CARRY, CARRY, MOVE, WORK, WORK, WORK]],
  "u500" : [2, [CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK]],
  "d500" : [2, [CARRY, MOVE, WORK, WORK, WORK, WORK]],
  
  "h600" : [2, [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK]],
  "b600" : [2, [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK]],
  "u600" : [2, [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK]],
  "d600" : [2, [CARRY, MOVE, WORK, WORK, WORK, WORK, WORK]],
};

module.exports = roleSpawn;




