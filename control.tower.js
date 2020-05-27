var roleTower = {
    run: function()
    {
        var towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (x) => x.structureType == STRUCTURE_TOWER });
        if(towers.length > 0) {
            for(var i in towers)
            {
                var tower = towers[i];
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    tower.attack(closestHostile);
                }
                /*else
                {
                    var enemySt = tower.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                    console.log(enemySt);
                    tower.attack(enemySt);
                }*/
                else if(tower.store.getUsedCapacity(RESOURCE_ENERGY) > 500)
                {
                    var structures = tower.room.find(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < structure.hitsMax && 
                        ((structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) || structure.hits < 100000)
                    });

                    var newRampart = structures.find((x) => x.structureType == STRUCTURE_RAMPART && x.hits < 1000);
                    var closestDamagedStructure;
                    if(typeof(newRampart) == 'undefined')
                    {
                        closestDamagedStructure = structures[0];
                    }
                    else
                    {
                        closestDamagedStructure = newRampart;
                    }

                    if(closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                    else
                    {
                        var ill = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: function(object) {
                                return object.hits < object.hitsMax;
                            }
                        });
                        if(ill) {
                            tower.heal(ill);
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleTower;