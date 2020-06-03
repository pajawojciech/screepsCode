var role = {
    run: function(creep) {
        var roomName = Memory.claim[0].room;
        if(roomName != creep.room.name)
        {
            var direction = creep.room.findExitTo(roomName);
            var exits = creep.room.find(direction);
            if(exits.length > 0)
            {
                creep.moveTo(exits[0]);
            }
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