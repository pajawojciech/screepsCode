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
                    if(Memory.attack[i] == creep.memory.attackId)
                    {
                        Memory.attack.splice(i, 1);
                    }
                }
                delete creep.memory.attackId;
				delete creep.memory.attack;
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
                //, {filter: (x) => x.structureType != STRUCTURE_STORAGE}
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