var roleBuilder = require('creep.builder');
var roleDigger = require('creep.digger');
var roleCarrier = require('creep.carrier');
var roleRepairer = require('creep.repairer');
var roleAttacker = require('creep.attacker');
var roleClaimer = require('creep.claimer');

var bodyDict = require('data.body');

var roleSpawn = {
    run: function()
    {
        for(var name in Game.spawns)
        {
            var sp = Game.spawns[name];
            var b = roleBuilder.prepare(sp, getBody);
            var d = roleDigger.prepare(sp, getBody);
            var c = roleCarrier.prepare(sp, getBody);
            var r = roleRepairer.prepare(sp, getBody);
            var cl = roleClaimer.prepare(sp, getBody);
            var a = roleAttacker.prepare(sp, getBody);
    
            if(sp.spawning != null) continue;
    
            if(!checkAndCreate(sp, 'a', a)) return;
            //if(!checkAndCreate(sp, 'he', a / 4)) return;
            
            if(sp.room.name == 'E13S23') //TODO jesli flaga istnieje
            {
                //checkAndCreate(sp, 't');
            }
    
            if(checkAndCreate(sp, 'h'))
            {
                checkAndCreate(sp, 'b', b);
                
                var cont = sp.room.find(FIND_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
                if(cont > 0)
                {
                    if(sp.room.controller.level == 8)
                    {
                        checkAndCreate(sp, 'u', 1);
                    }
                    else
                    {
                        checkAndCreate(sp, 'u');
                    }
    
                    if(typeof(Memory.sources) != 'undefined')
                    {
                        if(checkAndCreate(sp, 'd', d))
                        {
                            checkAndCreate(sp, 'c', c);

                            checkAndCreate(sp, 'r', r);
                            
                            if(typeof(Memory.claim) != 'undefined')
                            {
                                checkAndCreate(sp, 'cl', cl);
                            }
                            
                            //if(typeof(sp.memory.towerId) == 'undefined')
                            //{
                                //var ill = sp.room.find(FIND_MY_CREEPS, { filter: (x) => x.hits < x.hitsMax });
                                //if(ill.length > 0)
                                ///{
                                    //checkAndCreate(sp, 'he');
                                //}
                            //}
                        }
                    }
                    
                    //checkAndCreate(sp, 'u');
                }
            }
        }
    }
};

var checkAndCreate = function(sp, role, limit) //zwraca informację, czy limit spełniony
{
    var cr = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.room == sp.room.name && (creep.ticksToLive > 50 || typeof(creep.ticksToLive) == 'undefined'));
	var energyCap = sp.memory.eca;
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




