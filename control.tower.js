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
                else if(tower.store.getUsedCapacity(RESOURCE_ENERGY) > 700)
                {
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL 
                    });
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