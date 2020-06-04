/* 
MEMORY
-claim[]
    -room
-creeps[]
    -role
    -room
    >b
        -destRoom
        -building
    >c
        -targetId
        -containerId
        -assignedCont
    >d
        -sourceId
    >h
        -transf
    >r
        -work
        -targetId
        -destRoom
    >u
        -upgrading
-sources[]
    -sourceId
    -space - miejsce wokół source
    -newContainer - powstało construction site, false jeśli zbudowane
    -containerId
    -road - droga wyznaczona do controller i spawn
-spawns[]
    newContainer
    containerId
    containerCount - kontenery w pomieszczeniu
    newContainer2
    containerId2
    newTower
    towerId
	wall
    road - droga wokół spawna i extensionów
*/


module.exports = { run: function()
{
    if(typeof(Memory.sources) == 'undefined')
    {
        Memory.sources = [];
        var terr = new Room.Terrain(Game.spawns['Spawn1'].room.name);
        var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES).map(function (x) { return x.id; });
        for(var source in sources)
        {
            var val = sources[source];
            var item = { "sourceId" : val };
             
            var count = 0;
            var sourcePos = Game.getObjectById(val).pos;
            var x = sourcePos.x;
            var y = sourcePos.y;
            for(var i in nearbyArr)
            {
                var arrPos = nearbyArr[i];
                if(terr.get(x - arrPos[0], y - arrPos[1]) != 1)
                {
                    count++;
                }
            }
            item.space = count;
            
            Memory.sources.push(item);
        }   
        console.log("INIT MEM SOURCES");
    }
    else
    {
        for(var i in Memory.sources)
        {
            var mem = Memory.sources[i];
            var s = Game.getObjectById(mem.sourceId);
            if(s == null)
            {
                console.log("CLEAN MEM SOURCES");
                delete Memory.sources;
                return;
            }
            if(typeof(mem.containerId) != 'undefined')
            {
                var c = Game.getObjectById(mem.containerId);
                if(c == null)
                {
                    console.log("CLEAN CONTAINER");
                    delete mem.newContainer;
                    delete mem.containerId;
                }
            }
            if(mem.road && Game.time % 5000 == 0)
            {
                delete mem.road;
            }
        }
        
        for(var i in Memory.creeps) 
        {
            if(!Game.creeps[i]) 
            {
                delete Memory.creeps[i];
            }
        }
        
        for(var i in Memory.spawns)
        {
            var mem = Memory.spawns[i];
            if(typeof(mem.containerId) != 'undefined')
            {
                var c = Game.getObjectById(mem.containerId);
                if(c == null)
                {
                    console.log("CLEAN SP CONTAINER");
                    delete mem.containerId;
                    delete mem.newContainer;
                }
            }
            
            if(typeof(mem.containerId2) != 'undefined')
            {
                var c = Game.getObjectById(mem.containerId2);
                if(c == null)
                {
                    console.log("CLEAN SP CONTAINER2");
                    delete mem.containerId2;
                    delete mem.newContainer2;
                }
            }
            
            if(mem.road && Game.time % 10000 == 0)
            {
                delete mem.road;
            }
            
            if(Game.time % 1000 == 0)
            {
                //delete mem.wall;
            }
            
            if(typeof(mem.towerId) != 'undefined')
            {
                var c = Game.getObjectById(mem.towerId);
                if(c == null)
                {
                    console.log("CLEAN TOWER");
                    delete mem.towerId;
                    delete mem.newTower;
                }
            }
        }
        
        var sourcesMemory = Memory.sources.map((x) => x.sourceId);
        
        for(var i in Memory.claim)
        {
            var room = Game.rooms[Memory.claim[i].room];
            if(typeof(room) != 'undefined')
            {
                var controller = room.controller;
                if(typeof(controller.reservation) != 'undefined' && controller.reservation.ticksToEnd > 100)
                {
                    var sources = room.find(FIND_SOURCES);
                    for(var i in sources)
                    {
                        var source = sources[i];
                        if(!sourcesMemory.includes(source.id))
                        {
                            var item = { "sourceId" : source.id, "space" : 1, "ext" : true };
                            Memory.sources.push(item);
                            console.log('ADD EXT SOURCE');
                        }
                    }    
                }
            }
        }
    }
}};

var nearbyArr = 
[
    [-1,-1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0,  1],
    [1, -1],
    [1,  0],
    [1,  1]
];
