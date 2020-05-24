var roleHealer = {
    run: function(creep) {
        if(typeof(creep.body.find((x) => x.type == HEAL)) != 'undefined')
        {
            var ill = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
                }
            });
            if(ill) {
                if(creep.heal(ill) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ill);
                }
                return;
            }
        }
	}
};

module.exports = roleHealer;

        