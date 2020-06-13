var bodyDict = require('data.body');

var roleSpawn = {
    run: function()
    {
        for(var name in Game.spawns)
        {
            var sp = Game.spawns[name];
            var b = prepareB(sp);
            var d = prepareD(sp);
            var c = prepareC(sp);
            var r = prepareR(sp);
            var cl = prepareCL(sp);
            var a = prepareA(sp);
            //var h = prepareH(sp);
    
            if(sp.spawning != null) continue;
    
            if(!checkAndCreate(sp, 'a', a)) return;
            if(!checkAndCreate(sp, 'he', a / 4)) return;
            
            //checkAndCreate(sp, 't');
    
            if(checkAndCreate(sp, 'h'))
            {
                checkAndCreate(sp, 'b', b);
                
                var cont = sp.room.find(FIND_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
                if(cont > 0)
                {
                    checkAndCreate(sp, 'u');
    
                    if(typeof(Memory.sources) != 'undefined')
                    {
                        if(checkAndCreate(sp, 'd', d))
                        {
                            checkAndCreate(sp, 'c', c);
                            
                            checkAndCreate(sp, 'r', r);
        
                            //if(typeof(sp.memory.towerId) == 'undefined')
                            //{
                                //var ill = sp.room.find(FIND_MY_CREEPS, { filter: (x) => x.hits < x.hitsMax });
                                //if(ill.length > 0)
                                ///{
                                    //checkAndCreate(sp, 'he');
                                //}
                            //}
        
                            if(typeof(Memory.claim) != 'undefined')
                            {
                                checkAndCreate(sp, 'cl', cl);
                            }
                        }
                    }
                }
            }
        }
    }
};

var checkAndCreate = function(sp, role, limit) //zwraca informację, czy limit spełniony
{
    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.room == sp.room.name && (creep.ticksToLive > 50 || typeof(creep.ticksToLive) == 'undefined'));
	var energyCap = sp.room.energyCapacityAvailable;
	
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
		var newName = role + Game.time + sp.name;
        var body = conf.body;
		var res = 
		//1;
		sp.spawnCreep(body, newName, {memory: {role: role, room: sp.room.name }});
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

var prepareB = function(sp)
{
    var eca = sp.room.energyCapacityAvailable;
    var b = sp.room.find(FIND_CONSTRUCTION_SITES, { filter: (x) => x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_RAMPART}).length > 0 ? getBody('b', eca).limit : 0;
    var claims = Memory.claim.filter((x) => x.home == sp.room.name );
    for(var i in claims)
    {
        var roomName = claims[i].room;
        var claimRoom = Game.rooms[roomName];
        if(typeof(claimRoom) != 'undefined' && claimRoom.find(FIND_CONSTRUCTION_SITES, { filter: (x) => x.my }).length > 0)
        {
            var t = 1;
            b++;
            if(claimRoom.controller.my)
            {
                b += 1;
                t = 2;
            }
            
            var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'b' && creep.memory.destRoom == roomName && creep.memory.room == sp.room.name).length; 
            if(cr < t)
            {
                var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'b' && creep.memory.room == sp.room.name && typeof(creep.memory.destRoom) == 'undefined');
                if(crFree.length > 0)
                {
                    crFree[0].memory.destRoom = roomName;
                }
            }
        }
    }
    return b;
}

var prepareR = function(sp)
{
    var eca = sp.room.energyCapacityAvailable;
    var ret = getBody('r', eca).limit;
    var claims = Memory.claim.filter((x) => x.home == sp.room.name );
    for(var i in claims)
    {
        var roomName = claims[i].room;
        var claimRoom = Game.rooms[roomName];
        if(typeof(claimRoom) != 'undefined' && claimRoom.find(FIND_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_CONTAINER }).length > 0)
        {
            ret++;
            var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'r' && creep.memory.room == sp.room.name && creep.memory.destRoom == roomName).length; 
            if(cr < 1)
            {
                var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'r' && creep.memory.room == sp.room.name && typeof(creep.memory.destRoom) == 'undefined');
                if(crFree.length > 0)
                {
                    crFree[0].memory.destRoom = roomName;
                }
            }
        }
    }
    return ret;
}

var prepareD = function(sp)
{
    var eca = sp.room.energyCapacityAvailable;
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

var prepareC = function(sp)
{
    if(typeof(Memory.sources) == 'undefined') return;
    var sources = Memory.sources.filter((x) => typeof(x.containerId) != 'undefined' && x.home == sp.room.name );
    for(var i in sources)
    {
        var source = sources[i];
        var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'c' && creep.memory.room == sp.room.name && creep.memory.assignedCont == source.containerId).length; 
        if(cr < 1)
        {
            var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'c' && creep.memory.room == sp.room.name && typeof(creep.memory.assignedCont) == 'undefined');
            if(crFree.length > 0)
            {
                crFree[0].memory.assignedCont = source.containerId;
            }
        }
    }
    
    var st = 0;
    if(typeof(Memory.steal) != 'undefined')
    {
        st++;
        var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'c' && creep.memory.room == sp.room.name && creep.memory.steal == Memory.steal).length; 
        if(cr < 1)
        {
            var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'c' && creep.memory.room == sp.room.name && typeof(creep.memory.assignedCont) == 'undefined' && typeof(creep.memory.steal) == 'undefined');
            if(crFree.length > 0)
            {
                crFree[0].memory.steal = Memory.steal;
            }
        }
    }
    
    return sources.length + Memory.claim.filter((x) => x.home == sp.room.name).length + st;
}

var prepareCL = function(sp)
{
    var claims = Memory.claim.filter((x) => (typeof(x.getRoom) == 'undefined' || x.getRoom) && x.home == sp.room.name );
    for(var i in claims)
    {
        var roomName = claims[i].room;
        
        var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && creep.memory.room == sp.room.name && creep.memory.claim == roomName).length; 
        if(cr < 1)
        {
            var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && creep.memory.room == sp.room.name && typeof(creep.memory.claim) == 'undefined');
            if(crFree.length > 0)
            {
                crFree[0].memory.claim = roomName;
            }
        }
        
        var getRoom = claims[i].getRoom;
        if(typeof(getRoom) != 'undefined' && getRoom == true)
        {
            var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && creep.memory.room == sp.room.name && creep.memory.claim == roomName); 
            if(cr.length > 0)
            {
                cr[0].memory.getRoom = true;
            }
        }
    }
    return Memory.claim.filter((x) => x.home == sp.room.name && x.getRoom != false).length;
}

var prepareA = function(sp)
{
    var ATTACK_ROOM = 3;
    var ATTACK_ID = 1;
    
    var ret = 0;
    for(var i in Memory.claim.filter((x) => x.home == sp.room.name))
    {
        var roomName = Memory.claim[i].room;
        var room = Game.rooms[roomName];
        if(typeof(room) != 'undefined')
        {
            var res = room.controller.reservation;
            if(typeof(res) != 'undefined' || room.controller.my)
            {
                var x1 = room.find(FIND_HOSTILE_CREEPS).length;
                var x2 = room.find(FIND_HOSTILE_STRUCTURES).length;
                
                if(x1 + x2 > 0)
                {
                    ret += ATTACK_ROOM;
                    
                    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'a' && creep.memory.attack == roomName).length; 
                    if(cr < ATTACK_ROOM)
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
    if(typeof(sp.memory.towerId) == 'undefined')
    {
        var room = sp.room;
        var x1 = room.find(FIND_HOSTILE_CREEPS).length;
        if(x1 > 0)
        {
            ret += ATTACK_ROOM;
        }
    }
    if(typeof(Memory.attack) != 'undefined' && Memory.attack.length > 0)
    {
        var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'a' && creep.memory.attackId == Memory.attack[0]).length; 
        if(cr < ATTACK_ID)
        {
            var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'a' && typeof(creep.memory.attack) == 'undefined');
            if(crFree.length > 0)
            {
                var obj = Game.getObjectById(Memory.attack[0]);
                if(obj != null)
                {
                    crFree[0].memory.attackId = Memory.attack[0];
                    crFree[0].memory.attack = obj.room.name;
                }
            }
        }
        
        ret+= ATTACK_ID;
    }
    return ret;
}

var prepareH = function(sp)
{
    var ret = 0;
    
    
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
    if(typeof(body) == 'undefined')
    {
        console.log("ERROR SPAWN: " + role + limit);
        return {
            "limit": 0,
            "body": []
        };
    }
    return {
        "limit": body[0],
        "body": body[1]
    };
}

module.exports = roleSpawn;




