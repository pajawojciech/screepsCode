var utils = require('utils.creep');
//flaga t1 - pokój przeciwnika na granicy
//flaga t2 - pokój własny, krok od granicy
var roleTroll = {
    run: function(creep) {

        if(typeof(Game.flags['t2']) == 'undefined' || typeof(Game.flags['t1']) == 'undefined')
        {
            creep.say('flag');
            return;
        }

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