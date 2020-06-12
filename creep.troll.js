var utils = require('utils.creep');

var roleTroll = {
    run: function(creep) {

        if(creep.memory.healing && creep.hits == creep.hitsMax) {
            creep.memory.healing = false;
	    }
	    if(!creep.memory.healing && creep.hits < creep.hitsMax / 3 * 2) {
	        creep.memory.healing = true;
	    }

	    if(creep.memory.healing) {
	        creep.moveTo(Game.flags['t2'].pos);
        }
        else {
            creep.moveTo(Game.flags['t1'].pos);
        }
        creep.heal(creep);
	}
};

module.exports = roleTroll;