/* 
MEMORY
-attack[] - tablica id do zniszczenia, TODO room 
    -id - obiekt do zniszczenia
    -room - pokój w którym jest obiekt (niepotrzebne jesli widoczny)
-claim[]
    -room - pokój do zdobycia
    -home - pokój matka
    -getRoom - ? zrób claim : claim zrobiony, undef - bez claima
-creeps[]
    -role - wykonywana rola
    -room - pokój matka
    >a
        -attack - pokój do ataku
        -attackId - id do ataku
    >b
        -destRoom - pokój przeznaczenia
        -building - czy pracuje
    >c
        -targetId - skąd właśnie bierze energię
        -containerId - gdzie zanosi energię
        -assignedCont - przypisany contener
        -stealFrom - id do brania
        -stealTo - id do oddawania
        -stealType - typ surowca
    >d
        -sourceId - przypisane źródło
    >h
        -transf - ? pracuje : zbiera energie
    >r
        -work ? pracuje : zbiera energie
        -targetId - id celu
        -destRoom - pokój przeznaczenia
    >u
        -upgrading ? upgraduje : zbiera energie
    >cl
        -claim - room do przejęcia
        -home - jeszcze nie jest uzywane
        -getRoom - zajecie pokoju
-sources[]
    -sourceId
    -space - ilosc miejsca wokół source
    -newContainer - powstało construction site, false jeśli zbudowane
    -containerId
    -road - droga wyznaczona do controller i spawn
    -home - pokój odpowiedzialny
-spawns[]
    newContainer
    containerId
    containerCount - kontenery w pomieszczeniu {do wyrzucenia}
    newContainer2
    containerId2
    towers
	wall - czy był budowany mur
    road - droga wokół spawna i extensionów
-steal[]
    -from 
    -to
    -room
    -type
    
FLAGS:
-t1, t2 troll
-t3 oczekiwanie na atak
*/


module.exports = { run: function()
{
    if(Game.time % 1000 == 0)
    {
        var d = new Date() - Date.parse(Memory.tick);
        console.log('tickrate ' + (d / 1000));
        Memory.tick = new Date();
    }
    if(typeof(Memory.claim) == 'undefined')
    {
        Memory.claim = [];
    }
    if(typeof(Memory.sources) == 'undefined' || Memory.sources.length == 0)
    {
        Memory.sources = [];
        
        for(var i in Memory.spawns)
        {
            var room = Game.rooms[Game.spawns[i].room.name];
            var terr = new Room.Terrain(room.name);
            var sources = room.find(FIND_SOURCES).map(function (x) { return x.id; });
            for(var source in sources)
            {
                var val = sources[source];
                var item = { "sourceId" : val, "home" : room.name };
                
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
        }

        console.log("INIT MEM SOURCES");
    }
    else
    {
        for(var i in Memory.sources)
        {
            var mem = Memory.sources[i];
            if(mem == null)
            {
                console.log("CLEAN NULL MEM SOURCES");
                Memory.sources.splice(i, 1);
                return;
            }
            
            var s = Game.getObjectById(mem.sourceId);
            if(s == null)
            {
                console.log("CLEAN MEM SOURCES");
                Memory.sources.splice(i, 1);
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
                if(typeof(controller.reservation) != 'undefined' && controller.reservation.ticksToEnd > 100 && controller.reservation.username == 'wp171') //todo name
                {
                    
                    var sources = room.find(FIND_SOURCES);
                    for(var s in sources)
                    {
                        var source = sources[s];
                        if(!sourcesMemory.includes(source.id))
                        {
                            var item = { "sourceId" : source.id, "space" : 1, "ext" : true, "home" : Memory.claim[i].home };
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
