var cm = require('utils.common');

module.exports = {
    run: function()
    {
        var marketRoom = '';
        
        var spawns = _.filter(Game.spawns, x => typeof(x.room.terminal) != 'undefined' &&  x.room.terminal.cooldown == 0 && x.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
        var mm = cm.getMinMax(spawns, x => x.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY));
        
        if(mm != null)
        {
            marketRoom = mm.maxObj.room.name;
        }

        if(marketRoom != '')
        {
            var energy = Game.rooms[marketRoom].terminal.store.getUsedCapacity(RESOURCE_ENERGY);
            var MIN_PRICE;
            if(energy > 290000)
                MIN_PRICE = 0.1;
            //else if(energy > 200000)
                //MIN_PRICE = 0.175;
            //else if(energy > 150000)
                //MIN_PRICE = 0.2;
            else if(energy > 100000)
                MIN_PRICE = 0.3;
            else 
                MIN_PRICE = 0.5;

            var orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY}).filter((x) => x.price >= MIN_PRICE);
            if(orders.length > 0)
            {
                var o = cm.getMinMax(orders, x => getRealPrice(x, marketRoom)).maxObj;
                if(o == null) return;
                var realPrice = getRealPrice(o, marketRoom);
                var roomr = '';
                
                if(realPrice > MIN_PRICE)
                {
                    var res = Game.market.deal(o.id, o.remainingAmount, marketRoom);
                    console.log('market Deal: ' + res + ' ' + o.price + ' ' + o.remainingAmount + ' ' + realPrice + ' room: ' + marketRoom);
                }
            }
            else
            {
                //console.log('market: ' + MIN_PRICE + ' ' + energy + ' ' + marketRoom);
            }
            
        }
        //console.log(Game.cpu.getUsed() - usedCPU);
    }
}

var getRealPrice = function(o, room)
{
    return (o.remainingAmount * o.price) / (o.remainingAmount + Game.market.calcTransactionCost(o.remainingAmount, o.roomName, room));
}