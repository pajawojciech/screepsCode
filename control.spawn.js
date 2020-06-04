var bodyDict = require('data.body');

var roleSpawn = {
    run: function()
    {
        if(Game.spawns['Spawn1'].spawning != null) return;
        var eca = Game.spawns['Spawn1'].room.energyCapacityAvailable;
        
        //if(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS).length > 0)
        //{
            //checkAndCreate('a', 1);
        //}

        if(checkAndCreate('h'))
        {
            var b = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES, { filter: (x) => x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_RAMPART}).length > 0 ? getBody('b', eca).limit : 0;
            for(var i in Memory.claim)
            {
                var roomName = Memory.claim[i].room;
                var claimRoom = Game.rooms[roomName];
                if(typeof(claimRoom) != 'undefined' && claimRoom.find(FIND_CONSTRUCTION_SITES, { filter: (x) => x.my }).length > 0)
                {
                    b++;
                    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'b' && creep.memory.destRoom == roomName).length; 
                    if(cr < 1)
                    {
                        var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'b' && typeof(creep.memory.destRoom) == 'undefined');
                        if(crFree.length > 0)
                        {
                            crFree[0].memory.destRoom = roomName;
                        }
                    }
                }
            }
            checkAndCreate('b', b);
            
            var d = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
            if(d > 0)
            {
                checkAndCreate('u');

                d = 0;
                var dLimit = getBody('d', eca).limit;
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
                    checkAndCreate('c', Memory.sources.length);
                    checkAndCreate('r');

                    if(typeof(Game.spawns['Spawn1'].memory.towerId) == 'undefined')
                    {
                        var ill = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, { filter: (x) => x.hits < x.hitsMax });
                        if(ill.length > 0)
                        {
                            checkAndCreate('he');
                        }
                    }

                    if(typeof(Memory.claim) != 'undefined')
                    {
                        checkAndCreate('cl');
                    }
                }
            }
        }
    }
};

var checkAndCreate = function(role, limit) //zwraca informację, czy limit spełniony
{
    var sp = Game.spawns['Spawn1'];
    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == role && (creep.ticksToLive > 50 || typeof(creep.ticksToLive) == 'undefined'));
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
		var res = Game.spawns['Spawn1'].spawnCreep(body, newName, {memory: {role: role, room: sp.room.name }});
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

module.exports = roleSpawn;




