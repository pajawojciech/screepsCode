var bodyDict = require('data.body');

var roleSpawn = {
    run: function()
    {
        var b = prepareB();
        var d = prepareD();
        prepareC();
        var r = prepareR();
        var cl = prepareCL();
        var a = prepareA();

        if(Game.spawns['Spawn1'].spawning != null) return;

        if(!checkAndCreate('a', a)) return;

        if(checkAndCreate('h'))
        {
            checkAndCreate('b', b);
            
            var cont = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
            if(cont > 0)
            {
                checkAndCreate('u');

                if(typeof(Memory.sources) != 'undefined')
                {
                    if(checkAndCreate('d', d)) // && Game.spawns['Spawn1'].memory.containerCount > Memory.sources.length)
                    {
                        checkAndCreate('c', Memory.sources.length + Memory.claim.length);
                        
                        checkAndCreate('r', r);
    
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
                            checkAndCreate('cl', cl);
                        }
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

var prepareB = function()
{
    var eca = Game.spawns['Spawn1'].room.energyCapacityAvailable;
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
    return b;
}

var prepareR = function()
{
    var eca = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    var ret = getBody('r', eca).limit;
    for(var i in Memory.claim)
    {
        var roomName = Memory.claim[i].room;
        var claimRoom = Game.rooms[roomName];
        if(typeof(claimRoom) != 'undefined' && claimRoom.find(FIND_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_CONTAINER }).length > 0)
        {
            ret++;
            var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'r' && creep.memory.destRoom == roomName).length; 
            if(cr < 1)
            {
                var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'r' && typeof(creep.memory.destRoom) == 'undefined');
                if(crFree.length > 0)
                {
                    crFree[0].memory.destRoom = roomName;
                }
            }
        }
    }
    return ret;
}

var prepareD = function()
{
    var eca = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    var d = 0;
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
    return d;
}

var prepareC = function()
{
    if(typeof(Memory.sources) == 'undefined') return;
    var sources = Memory.sources.filter((x) => typeof(x.containerId) != 'undefined' );
    for(var i in sources)
    {
        var source = sources[i];
        var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'c' && creep.memory.assignedCont == source.containerId).length; 
        if(cr < 1)
        {
            var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'c' && typeof(creep.memory.assignedCont) == 'undefined');
            if(crFree.length > 0)
            {
                crFree[0].memory.assignedCont = source.containerId;
            }
        }
    }
}

var prepareCL = function()
{
    for(var i in Memory.claim.filter((x) => typeof(x.getRoom) == 'undefined' || x.getRoom ))
    {
        var roomName = Memory.claim[i].room;
        var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && creep.memory.claim == roomName).length; 
        if(cr < 1)
        {
            var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && typeof(creep.memory.claim) == 'undefined');
            if(crFree.length > 0)
            {
                crFree[0].memory.claim = roomName;
            }
        }
        
        var getRoom = Memory.claim[i].getRoom;
        if(typeof(getRoom) != 'undefined' && getRoom == true)
        {
            var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && creep.memory.claim == roomName); 
            if(cr.length > 0)
            {
                cr[0].memory.getRoom = true;
            }
        }
    }
    return Memory.claim.length;
}

var prepareA = function()
{
    var ret = 0;
    for(var i in Memory.claim)
    {
        var roomName = Memory.claim[i].room;
        var room = Game.rooms[roomName];
        if(typeof(room) != 'undefined')
        {
            var res = room.controller.reservation;
            if(typeof(res) != 'undefined')
            {
                var x1 = room.find(FIND_HOSTILE_CREEPS).length;
                var x2 = room.find(FIND_HOSTILE_STRUCTURES).length;
                
                if(x1 + x2 > 0)
                {
                    ret += 4;
                    
                    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'a' && creep.memory.attack == roomName).length; 
                    if(cr < 4)
                    {
                        var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'a' && typeof(creep.memory.attack) == 'undefined');
                        if(crFree.length > 0)
                        {
                            crFree[0].memory.attack = roomName;
                        }
                    }
                }
            }
        }
    }
    return ret;
}

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




