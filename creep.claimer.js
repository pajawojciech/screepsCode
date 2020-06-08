var utils = require('utils.creep');

var role = {
    run: function(creep) {
        if(Memory.claim.length == 0) return;
        
        var roomName = creep.memory.claim;
        if(roomName != creep.room.name)
        {
            utils.goToRoom(creep, roomName);
        }
        else
        {
            var contr = creep.room.controller;
            if(contr.reservation != null && contr.reservation.username != 'www')
            {
                var res = creep.attackController(contr);
                if(res == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(contr.pos);
                }
            }
            else
            {
                var res = creep.reserveController(contr);
                if(res == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(contr.pos);
                }
            }
        }
	}
};

module.exports = role;