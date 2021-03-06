module.exports = {
    run: function()
    {
        var CONT_RANGE = 3;

        for(var name in Game.spawns)
        {
            var sp = Game.spawns[name];
            var room = sp.room;
            var cont = room.find(FIND_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
            var contB = room.find(FIND_MY_CONSTRUCTION_SITES,  { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
            var controller = room.controller;
            var towers = room.find(FIND_STRUCTURES, {filter: (st) => st.structureType == STRUCTURE_TOWER }).length;
            var towersB = room.find(FIND_CONSTRUCTION_SITES, {filter: (st) => st.structureType == STRUCTURE_TOWER }).length;
            
            var ext = room.find(FIND_MY_STRUCTURES,  { filter: (st) => st.structureType == STRUCTURE_EXTENSION } ).length;
            var extB = room.find(FIND_MY_CONSTRUCTION_SITES,  { filter: (st) => st.structureType == STRUCTURE_EXTENSION } ).length;
            
            if(isNaN(sp.room.energyCapacityAvailable))
            {
                sp.memory.eca = ext * (sp.room.controller.level == 8 ? 200 : sp.room.controller.level == 7 ? 100 : 50);// + 300;
            }
            else
            {
                sp.memory.eca = sp.room.energyCapacityAvailable;
            }

            var extensions;
            
            sp.memory.containerCount = cont;
            
            if(CONTROLLER_STRUCTURES.extension[room.controller.level] == ext)
            {
                extensions = ERR_RCL_NOT_ENOUGH;
            }
            else if(extB == 0 && contB == 0)
            {
                extensions = createConstructionSquare(sp.pos, STRUCTURE_EXTENSION, true, 6);
            }
            
            //ustaw memory sources containerId
            if(typeof(Memory.sources) != 'undefined' && Memory.sources.filter(function(x) { return x.newContainer; } ).length > 0)
            {
                var sourceMems = Memory.sources.filter(function(x) { return x.newContainer; } );
                for(var i in sourceMems)
                {
                    var sourceMem = sourceMems[i];
                    var obj = Game.getObjectById(sourceMem.sourceId);
                    if(obj != null)
                    {
                        var container = obj.pos.findInRange(FIND_STRUCTURES, CONT_RANGE, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } );
                        if(container.length > 0)
                        {
                            sourceMem.containerId = container[0].id;
                            sourceMem.newContainer = false;
                        }
                    }
                }
            }
            
            //jeśli jest max extensionów buduj kontenery do reszty source
            if(sp.room.controller.level > 1 && typeof(Memory.sources) != 'undefined')
            {
                var sources = Memory.sources.filter(function(x) { return typeof(x.newContainer) == 'undefined' } );
                if(sources.length > 0)
                {
                    var source = Game.getObjectById(sources[0].sourceId);
                    if(source != null)
                    {
                        var nearbyContainer = source.pos.findInRange(FIND_STRUCTURES, CONT_RANGE, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length
                                            + source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, CONT_RANGE, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } ).length;
                        var res;
                        if(nearbyContainer > 0)
                        {
                            res = 0;
                        }
                        else
                        {
                            res = createConstructionX(source.pos, STRUCTURE_CONTAINER);
                        }
                        if(res == 0)
                        {
                            sources[0].newContainer = true;
                        }
                    }
                }
                else if(extensions == ERR_RCL_NOT_ENOUGH && contB + extB == 0)//drogi
                {
                    var source = Memory.sources.find(function(x) { return typeof(x.road) == 'undefined' && x.home == sp.room.name} );
                    if(typeof(source) != 'undefined')
                    {
                        var cont = Game.getObjectById(source.sourceId);
                        var path = PathFinder.search(cont.pos, sp.pos, { roomCallback: roadPathCost, plainCost: 2, swampCost: 4 });
                        for(var pos in path.path)
                        {
                            var pos = path.path[pos];
                            if(typeof(Game.rooms[pos.roomName]) != 'undefined')
                            {
                                new RoomVisual(pos.roomName).circle(pos.x, pos.y);
                                Game.rooms[pos.roomName].createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                            }
                        }
                        
                        var path = PathFinder.search(sp.pos, { pos: cont.room.controller.pos, range: 1 }, { roomCallback: roadPathCost, plainCost: 2, swampCost: 4 });
                        for(var pos in path.path)
                        {
                            var pos = path.path[pos];
                            if(typeof(Game.rooms[pos.roomName]) != 'undefined')
                            {
                                Game.rooms[pos.roomName].createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                            }
                        }

                        source.road = true;
                    }
                }
            }
            
            if(typeof(sp.memory.newContainer) == 'undefined' && extensions == ERR_RCL_NOT_ENOUGH && cont > 1)
            {
                var nearbyContainer = sp.pos.findInRange(FIND_STRUCTURES, 5, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } );
                
                var res;
                if(nearbyContainer.length > 0)
                {
                    res = 0;
                }
                else
                {
                    res = createConstructionSquare(sp.pos, STRUCTURE_CONTAINER, false);
                }
                if(res == 0)
                {
                    sp.memory.newContainer = true;
                }
            }
            if(typeof(sp.memory.newContainer) != 'undefined' && sp.memory.newContainer)
            {
                var nearbyContainer = sp.pos.findInRange(FIND_STRUCTURES, 4, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } );
                if(nearbyContainer.length > 0)
                {
                    sp.memory.newContainer = false;
                    sp.memory.containerId = nearbyContainer[0].id;
                }
            }
            
            if(typeof(sp.memory.newContainer2) == 'undefined' && extensions == ERR_RCL_NOT_ENOUGH && cont >= Memory.sources.length && cont > 1)
            {
                var nearbyContainer = controller.pos.findInRange(FIND_STRUCTURES, 4, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } );
                
                var res;
                if(nearbyContainer.length > 0)
                {
                    res = 0;
                }
                else
                {
                    res = createConstructionX(controller.pos, STRUCTURE_CONTAINER, 3);
                }
                if(res == 0)
                {
                    sp.memory.newContainer2 = true;
                }
            }
            if(typeof(sp.memory.newContainer2) != 'undefined' && sp.memory.newContainer2)
            {
                var nearbyContainer = controller.pos.findInRange(FIND_STRUCTURES, 4, { filter: (st) => st.structureType == STRUCTURE_CONTAINER } );
                if(nearbyContainer.length > 0)
                {
                    sp.memory.newContainer2 = false;
                    sp.memory.containerId2 = nearbyContainer[0].id;
                }
            }
            
            if(room.controller.level > 2 && typeof(sp.memory.road) == 'undefined' && contB + extB == 0 && cont > 2)
            {
                createConstructionSquare(sp.pos, STRUCTURE_ROAD, false, room.controller.level > 4 ? 4 : 3, false);
                sp.memory.road = true;
            }
            
            sp.memory.towers = towers;
            if(extB == 0 && towers + towersB < CONTROLLER_STRUCTURES.tower[room.controller.level])
            {
                res = createConstructionSquare(sp.pos, STRUCTURE_TOWER);
            }
            
            if(typeof(room.storage) == 'undefined' && CONTROLLER_STRUCTURES.storage[room.controller.level] > 0 && extB == 0)
            {
                createConstructionSquare(sp.pos, STRUCTURE_STORAGE);
            }
            
            if(typeof(room.terminal) == 'undefined' && CONTROLLER_STRUCTURES.terminal[room.controller.level] > 0 && extB == 0)
            {
                createConstructionSquare(sp.pos, STRUCTURE_TERMINAL);
            }
            
            //Memory.testwall = createWall('W3N9', Memory.testwall);
        }
    }
};

var createConstructionX = function(pos, type, start = 1)
{
    var rad = start; 
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

var createConstructionSquare = function(pos, type, even = true, range = 5, one = true)
{
    var rad = 1; 
    var x = pos.x;
    var y = pos.y;
    var step = 0;
    var loop = true;
    var terrain = new Room.Terrain(pos.roomName);
    
    while(loop)
    {
        switch(step)
        {
            case 0:
                x = pos.x - rad;
                y = pos.y + rad;
                step++;
                break;
            case 1:
                y -= 1;
                if(y == pos.y - rad)
                {step++;}
                break;
            case 2:
                x += 1;
                if(x == pos.x + rad)
                {step++;}
                break;
            case 3:
                y += 1;
                if(y == pos.y + rad)
                {step++;}
                break;
            case 4:
                x -= 1;
                if(x - 1 == pos.x - rad)
                {
                    step++;
                    rad++;
                }
                break;
        }
        step = step % 5;
        if((x + y + pos.x + pos.y) % 2 == (even ? 0 : 1))
        {
            var res = -100;
            if(terrain.get(x,y) != TERRAIN_MASK_WALL)
            {
                //Game.rooms[pos.roomName].visual.circle(x, y);
                res = Game.rooms[pos.roomName].createConstructionSite(x, y, type);
            }
        }

        if(one && (res == OK || res == ERR_RCL_NOT_ENOUGH)) return res;
        if(rad > range) return 1;
    }
};


var roadPathCost = function(roomName) {
    
    let room = Game.rooms[roomName];
    let costs = new PathFinder.CostMatrix;
    if (!room) 
    {
        var i; var j;
        for(i = 0; i<= 49; i++)
        {
            for(j = 0; j<=49; j++)
            {
                costs.set(i, j, 0xff);
            }
        }
        return costs;
    }
    
    room.find(FIND_STRUCTURES).forEach(function(struct) 
    {
        if (struct.structureType === STRUCTURE_ROAD) 
        {
            costs.set(struct.pos.x, struct.pos.y, 1);
        }
        else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my)) 
        {
            // Can't walk through non-walkable buildings
            costs.set(struct.pos.x, struct.pos.y, 0xff);
        }
    });
    
    room.find(FIND_CONSTRUCTION_SITES, {filter: (x) => x.structureType == STRUCTURE_ROAD}).forEach(function(struct) 
    {
        costs.set(struct.pos.x, struct.pos.y, 1);
    });
    
    return costs;
}

var createWall = function(roomName, memoryArray) 
{
    var room = Game.rooms[roomName];
    if(typeof(room) == 'undefined') return;
    
    if(typeof(memoryArray) == 'undefined')
    {
        console.log(3);
        var exits = room.find(FIND_EXIT);
        var exitPrev = null;
        var i = 0;
        for(var e in exits)
        {
            i++;
            var exit = exits[e];
            if(exitPrev != null && (
                (exit.x - exitPrev.x != 1 && (exitPrev.y == 0 || exitPrev.y == 49)) 
                    || 
                (exit.y - exitPrev.y != 1 && (exitPrev.x == 0 || exitPrev.x == 49)) 
            ))
            {
                exitPrev = null;
                exits[Math.floor(e - i / 2)].entrance = true;
                i = 0;
            }
            exitPrev = exit;
        }
        exits[Math.floor(e - i / 2)].entrance = true;
        
        var wallArray = [];
        
        for(var e in exits)
        {
            var exit = exits[e];
            var wallPos = {
                x : exit.x,
                y : exit.y
            }
            wallPos.entrance = typeof(exit.entrance) != 'undefined';
            wallArray.push(wallPos);
        }
        memoryArray = wallArray;
    }
    else if(memoryArray.length > 0)
    {
        var wallIndex = memoryArray.findIndex((x) => x.entrance === true);
        if(wallIndex != -1)
        {
            console.log('e');
            var entrance = memoryArray.splice(wallIndex, 1)[0];
            room.createConstructionSite(entrance.x, entrance.y - 2, STRUCTURE_RAMPART);
            room.createConstructionSite(entrance.x, entrance.y + 2, STRUCTURE_RAMPART);
            room.createConstructionSite(entrance.x - 2, entrance.y, STRUCTURE_RAMPART);
            room.createConstructionSite(entrance.x + 2, entrance.y, STRUCTURE_RAMPART);
        }
        else
        {
            console.log('i');
            wallIndex = memoryArray.findIndex((x) => x.entrance === false);
            
            var entrance = memoryArray.splice(wallIndex, 1)[0];
            room.createConstructionSite(entrance.x + 2, entrance.y - 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x + 1, entrance.y - 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x + 0, entrance.y - 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x - 1, entrance.y - 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x - 2, entrance.y - 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x + 2, entrance.y + 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x + 1, entrance.y + 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x + 0, entrance.y + 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x - 1, entrance.y + 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x - 2, entrance.y + 2, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x - 2, entrance.y + 1, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x - 2, entrance.y + 0, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x - 2, entrance.y - 1, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x + 2, entrance.y + 1, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x + 2, entrance.y + 0, STRUCTURE_WALL);
            room.createConstructionSite(entrance.x + 2, entrance.y - 1, STRUCTURE_WALL);
        }
    }
    return memoryArray;
}

