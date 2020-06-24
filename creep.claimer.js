var utils = require('utils.creep');

var role = {
    run: function(creep) {
        if(typeof(Memory.claim) == 'undefined' || Memory.claim.length == 0) return;
        
        var roomName = creep.memory.claim;
        if(roomName != creep.room.name)
        {
            utils.goToRoom(creep, roomName);
        }
        else
        {
            var contr = creep.room.controller;
            if((contr.reservation != null && contr.reservation.username != creep.owner.username) || (contr.owner != null && contr.owner != creep.owner.username))
            {
                var res = creep.attackController(contr);
                if(res == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(contr.pos, {maxRooms: 1});
                }
            }
            else
            {
                var res;
                if(typeof(creep.memory.getRoom) != 'undefined')
                {
                    res = creep.claimController(contr);
                    if(res == 0)
                    {
                        delete creep.memory.claim;
                        delete creep.memory.getRoom;
                        for(var i in Memory.claim)
                        {
                            if(Memory.claim[i].room == roomName)
                            {
                                Memory.claim[i].getRoom = false;
                            }
                        }
                    }
                    if(res == -15)
                    {
                        //delete creep.memory.getRoom;
                    }
                }
                else
                {
                    res = creep.reserveController(contr);
                }
                if(res == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(contr.pos, {maxRooms: 1});
                }
            }
        }
	}
};

module.exports = role;