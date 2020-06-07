var utils = require('utils.creep');

var roleAttacker = {
    run: function(creep) {
        var roomName = creep.memory.attack;
        if(typeof(roomName) == 'undefined')
        {
            roomName = creep.memory.room;
        }
        
        if(roomName != creep.room.name)
        {
            utils.goToRoom(creep, roomName);
            return;
        }
        
        var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(enemy != null)
        {
            var res = creep.attack(enemy);
            if(res == ERR_NOT_IN_RANGE || res == ERR_NO_BODYPART) 
            {
                res = creep.rangedAttack(enemy);
            }
            creep.moveTo(enemy);
        }
        else
        {
            var enemySt = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
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
            }
        }
	}
};

module.exports = roleAttacker;