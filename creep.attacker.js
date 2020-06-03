var roleAttacker = {
    run: function(creep) {
        var roomName = creep.room.name;
        if(roomName != creep.room.name)
        {
            var direction = creep.room.findExitTo(roomName);
            var exits = creep.room.find(direction);
            
            if(exits.length > 0)
            {
                var exit = creep.pos.findClosestByPath(exits);
                creep.moveTo(exit);
            }
            
            return;
        }
        
        var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(enemy != null)
        {
            var res = creep.rangedAttack(enemy);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy);
            }
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
        }
	}
};

module.exports = roleAttacker;