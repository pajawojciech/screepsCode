var roleAttacker = {
    run: function(creep) {
        var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(enemy != null)
        {
            var res = creep.rangedAttack(enemy);
            if(res == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy);
            }
        }
        /*else
        {
            var enemySt = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            if(enemySt != null)
            {
                var res2 = creep.attack(enemySt);
                if(res2 == ERR_NOT_IN_RANGE) {
                    var resmove = creep.moveTo(enemySt);
                }    
                creep.say(res2);
            }
        }*/
	}
};

module.exports = roleAttacker;