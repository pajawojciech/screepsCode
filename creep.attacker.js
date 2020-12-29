var utils = require('utils.creep');

var roleAttacker = {
    run: function(creep) {
        var f = Game.flags['Flag1'];
        if(typeof(f) != 'undefined')
        {
            creep.moveTo(f.pos);
            return;
        }
        
        if(typeof(creep.memory.attackId) != 'undefined' )
        {
            if(typeof(Game.flags['t3']) != 'undefined')
            {
                creep.moveTo(Game.flags['t3'].pos);
                //creep.say('wait');
                return;
            }
            var obj = Game.getObjectById(creep.memory.attackId);
            if(obj != null)
            {
                var res = creep.attack(obj);
                if(res == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(obj);
                }
                return;
            }
            else
            {
                for(var i in Memory.attack)
                {
                    if(Memory.attack[i].id == creep.memory.attackId)
                    {
                        //Memory.attack.splice(i, 1);
                    }
                }
                //delete creep.memory.attackId;
				//delete creep.memory.attack;
            }
        }

        var roomName = creep.memory.attack;
        if(typeof(roomName) == 'undefined')
        {
            return;
        }
        
        if(roomName != creep.room.name)
        {
            utils.goToRoom(creep, roomName);
            return;
        }
        
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if(enemies.length > 0)
        {
            var minRank = 10;
            for(var e in enemies)
            {
                var rank = getRank(enemies[e]);
                if(rank < minRank)
                {
                    minRank = rank;
                }
            }
            
            var enemy = creep.pos.findClosestByPath(enemies.filter((x) => getRank(x) == minRank));
            var res = creep.attack(enemy);
            if(res == ERR_NOT_IN_RANGE || res == ERR_NO_BODYPART) 
            {
                res = creep.rangedAttack(enemy);
                //res = creep.rangedMassAttack();
            }
            creep.moveTo(enemy);
        }
        else
        {
            var enemySt = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES
                    , {filter: (x) => x.structureType != STRUCTURE_CONTROLLER}
                );
            if(enemySt != null)
            {
                var res2 = creep.attack(enemySt);
                if(res2 == ERR_NOT_IN_RANGE) {
                    var resmove = creep.moveTo(enemySt);
                }    
            }
            else
            {
                delete creep.memory.attack;
                //creep.moveTo(new RoomPosition(25,25, creep.room.name));
            }
        }
	},
	
    prepare : function(sp, getBody)
    {
        var ATTACK_ROOM = 3;
        var ATTACK_ID = 4;
        
        var ret = 0;
        var claims = Memory.claim.filter((x) => x.home == sp.room.name);
        for(var i in claims)
        {
            var roomName = claims[i].room;
            var room = Game.rooms[roomName];
            if(typeof(room) != 'undefined')
            {
                var res = room.controller.reservation;
                if(typeof(res) != 'undefined' || room.controller.my)
                {
                    var x1 = room.find(FIND_HOSTILE_CREEPS).length;
                    var x2 = room.find(FIND_HOSTILE_STRUCTURES
				        , {filter: (x) => x.structureType != STRUCTURE_CONTROLLER}
    				).length;
                    
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
        if(sp.memory.towers > 0)
        {
            var room = sp.room;
            var x1 = room.find(FIND_HOSTILE_CREEPS).length;
            if(x1 > 0)
            {
                ret += ATTACK_ROOM;
            }
        }
        if(typeof(Memory.attack) != 'undefined' && Memory.attack.length > 0 && sp.room.name == 'E13S23')
        {
            var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'a' && creep.memory.attackId == Memory.attack[0].id && creep.memory.room == sp.room.name).length; 
            if(cr < ATTACK_ID)
            {
                var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'a' && typeof(creep.memory.attack) == 'undefined' && creep.memory.room == sp.room.name);
                if(crFree.length > 0)
                {
                    var obj = Game.getObjectById(Memory.attack[0].id);
                    var attackedRoom = "";
                    if(obj == null)
                    {
                        attackedRoom = Memory.attack[0].room;
                    }
                    else
                    {
                        attackedRoom = obj.room.name;
                    }
                    
                    crFree[0].memory.attackId = Memory.attack[0].id;
                    crFree[0].memory.attack = attackedRoom;
                }
            }
            
            ret+= ATTACK_ID;
        }
        return ret;
    }

};

module.exports = roleAttacker;

var getRank = function (creep)
{
    var b = creep.body.filter((x) => x.hits > 0).map((x) => x.type);
    if(b.includes('heal')) return 1;
    if(b.includes('attack')) return 2;
    if(b.includes('ranged_attack')) return 2;
    if(b.includes('claim')) return 3;
    return 4;
};