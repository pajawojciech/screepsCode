var roleTower = {
    run: function()
    {
        var towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (x) => x.structureType == STRUCTURE_TOWER });
        if(towers.length > 0) {
            var tower = towers[0];
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
           /* else
            {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
            */
        }
    }
};

module.exports = roleTower;