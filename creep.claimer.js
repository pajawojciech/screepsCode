var utils = require('utils.creep');

var role = {
    run: function(creep) {
        if(Memory.claim.length == 0) return;
        
        var roomName = Memory.claim[0].room;
        if(roomName != creep.room.name)
        {
            utils.goToRoom(creep, roomName);
        }
        else
        {
            var res = creep.reserveController(creep.room.controller);
            if(res == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.room.controller.pos);
            }
        }
	}
};

module.exports = role;