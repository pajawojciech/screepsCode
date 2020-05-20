module.exports = {
    run: function()
    {
        initializeMemory();

        for(var name in Game.spawns)
        {
            var sp = Game.spawns[name];
            var room = sp.room;
            var cont = sp.room.find(FIND_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
            var contB = sp.room.find(FIND_MY_CONSTRUCTION_SITES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
            var controller = room.controller;
            
            var ext = sp.room.find(FIND_MY_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_EXTENSION } ).length;
            var extB = sp.room.find(FIND_MY_CONSTRUCTION_SITES,  { filter: (st) => st.structureType == STRUCTURE_EXTENSION } ).length;
            
            var extensions;
            
            if(cont + contB == 0) //jeśli nie ma zbudowanych i budowanych containerów buduj pierwszy container
            {
                var source = sp.room.find(FIND_SOURCES)[0];
                var res = createConstructionX(source.pos, STRUCTURE_CONTAINER);
                if(res == 0)
                {
                    Memory.sources.find(function (x) { return x.sourceId == source.id; }).newContainer = true;
                }
            }
            else if(extB == 0) //jeśli skończony pierwszy container buduj extensiony
            {
                extensions = createConstructionX(sp.pos, STRUCTURE_EXTENSION);
            }
            
            //ustaw memory sources containerId
            if(Memory.sources.filter(function(x) { return x.newContainer; } ).length > 0)
            {
                var sourceMem = Memory.sources.find(function(x) { return x.newContainer; } );
                var obj = Game.getObjectById(sourceMem.sourceId);
                
                var container = obj.pos.findInRange(FIND_STRUCTURES, 5, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } );
                if(container.length > 0)
                {
                    sourceMem.containerId = container[0].id;
                    sourceMem.newContainer = false;
                }
            }
            
            //jeśli jest max extensionów buduj kontenery do reszty source
            if(extensions == ERR_RCL_NOT_ENOUGH && contB + extB == 0 && sp.room.controller.level > 1)
            {
                var sources = Memory.sources.filter(function(x) { return typeof(x.containerId) == 'undefined' } );
                if(sources.length > 0)
                {
                    var source = Game.getObjectById(sources[0].sourceId);
                    var nearbyContainer = source.pos.findInRange(FIND_STRUCTURES, 5, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } );
                    var res;
                    if(nearbyContainer.length > 0)
                    {
                        res = 0;
                    }
                    else
                    {
                        res = createConstructionX(source.pos, STRUCTURE_CONTAINER);
                    }
                    if(res == 0)
                    {
                        Memory.sources.find(function (x) { return x.sourceId == source.id; }).newContainer = true;
                    }
                }
                else //drogi
                {
                    var source = Memory.sources.find(function(x) { return typeof(x.road) == 'undefined' } );
                    if(typeof(source) != 'undefined')
                    {
                        var cont = Game.getObjectById(source.sourceId);
                
                        var path = room.findPath(cont.pos, sp.pos, { ignoreCreeps: true, ignoreRoads: true, swampCost: 1 });
                        for(var pos in path)
                        {
                            room.createConstructionSite(path[pos].x, path[pos].y, STRUCTURE_ROAD);
                        }
                        
                        var path = room.findPath(cont.pos, controller.pos, { ignoreCreeps: true, ignoreRoads: true, swampCost: 1 });
                        path.splice(path.length - 3, 3);
                        for(var pos in path)
                        {
                            room.createConstructionSite(path[pos].x, path[pos].y, STRUCTURE_ROAD);
                        }
                        
                        source.road = true;
                    }
                }
            }
        }
    }
};

var createConstructionX = function(pos, type)
{
    var rad = 1; 
    var x = pos.x;
    var y = pos.y;
    var step = 0;
    var loop = true;
    while(loop)
    {
        var res = Game.rooms[pos.roomName].createConstructionSite(x, y, type);
            
        if(res == OK || res == ERR_RCL_NOT_ENOUGH) return res;
        if(rad > 5) break;
                
        switch(step)
        {
            case 0:
                x = pos.x - rad;
                y = pos.y + rad;
                break;
            case 1:
                y -= rad * 2;
                break;
            case 2:
                x += rad * 2;
                break;
            case 3:
                y += rad *2;
                rad++;
                break;
        }
        step = (step + 1) % 4;
    }
};

var initializeMemory = function()
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
        }
    }
};

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





