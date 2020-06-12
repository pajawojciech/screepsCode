var utils = require('utils.creep');

var roleHealer = {
    run: function(creep) {
        if(typeof(creep.body.find((x) => x.type == HEAL)) != 'undefined')
        {
            if(creep.hits != creep.hitsMax)
            {
                creep.heal(creep);
            }
            
            var ill = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax && object.memory.role != 't';
                }
            });
            if(ill) {
                if(creep.heal(ill) == ERR_NOT_IN_RANGE) {
                    creep.rangedHeal(ill);
                    creep.moveTo(ill);
                }
                return;
            }
            else
            {
                var cr1 = '';
                var cr2 = '';
                for(var c in Game.creeps)
                {
                    var cr = Game.creeps[c];
                    if(cr.memory.role == 't') continue;
                    if(cr1 == '' && cr.hits != cr.hitsMax)
                    {
                        cr1 = cr.name;
                    }
                    if(cr2 == '' && cr.memory.role == 'a')
                    {
                        cr2 = cr.name;
                    }
                }
                if(cr2 != '')
                {
                    creep.moveTo(Game.creeps[cr2].pos);
                }
                if(cr1 != '')
                {
                    creep.moveTo(Game.creeps[cr1].pos);
                }
            }
        }
	}
};

module.exports = roleHealer;

        