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
                    if(res == ERR_GCL_NOT_ENOUGH)
                    {
                        res = creep.reserveController(contr);
                    }
                    if(res == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(contr.pos, {maxRooms: 1});
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
	},
	prepare : function(sp, getBody)
    {
        var eca = sp.memory.eca;
        var limit = getBody('cl', eca).limit;
        var claims = Memory.claim.filter((x) => (typeof(x.getRoom) == 'undefined' || x.getRoom) && x.home == sp.room.name );
        var res = 0;
        for(var i in claims)
        {
            var roomName = claims[i].room;
            var room = Game.rooms[roomName];
            if(typeof(room) != 'undefined' && room.controller.reservation != null && room.controller.reservation.ticksToEnd < 4000)
            {
                res += limit;
            }
            else
            {
                res++;
            }
            
            var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && creep.memory.room == sp.room.name && creep.memory.claim == roomName).length; 
            if(cr < limit)
            {
                var crFree = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && creep.memory.room == sp.room.name && typeof(creep.memory.claim) == 'undefined');
                if(crFree.length > 0)
                {
                    crFree[0].memory.claim = roomName;
                }
            }
            
            var getRoom = claims[i].getRoom;
            if(typeof(getRoom) != 'undefined' && getRoom == true)
            {
                var cr = _.filter(Game.creeps, (creep) => creep.memory.role == 'cl' && creep.memory.room == sp.room.name && creep.memory.claim == roomName); 
                if(cr.length > 0)
                {
                    cr[0].memory.getRoom = true;
                }
            }
        }
        return res;
    }
};

module.exports = role;