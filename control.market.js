module.exports = {
    run: function()
    {
        var marketRoom = '';
        //var usedCPU = Game.cpu.getUsed();
        if(Game.rooms['E13S23'].terminal.cooldown == 0 && Game.rooms['E13S23'].terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
        {
            marketRoom = 'E13S23';
        }
        if(Game.rooms['E12S24'].terminal.cooldown == 0 && Game.rooms['E12S24'].terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
        {
            if(marketRoom != '')
            {
                 marketRoom = 
                    Game.rooms['E13S23'].terminal.store.getUsedCapacity(RESOURCE_ENERGY) > Game.rooms['E12S24'].terminal.store.getUsedCapacity(RESOURCE_ENERGY) ?
                    'E13S23' : 'E12S24';
            }
            else
            {
                marketRoom = 'E12S24';
            }
        }
        
        if(marketRoom != '')
        {
            var energy = Game.rooms[marketRoom].terminal.store.getUsedCapacity(RESOURCE_ENERGY);
            var MIN_PRICE;
            if(energy == 300000)
                MIN_PRICE = 0.12;
            else if(energy > 200000)
                MIN_PRICE = 0.18;
            else if(energy > 150000)
                MIN_PRICE = 0.2;
            else if(energy > 100000)
                MIN_PRICE = 0.2;
            else 
                MIN_PRICE = 0.5;
    
            var orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY}).filter((x) => x.price >= MIN_PRICE);
            if(orders.length > 0)
            {
                var o = maxPrice(orders, marketRoom);
                var realPrice = getRealPrice(o, marketRoom);
                var roomr = '';
                
                if(realPrice > MIN_PRICE)
                {
                    var res = Game.market.deal(o.id, o.remainingAmount, marketRoom);
                }
                console.log('market Deal: ' + res + ' ' + o.price + ' ' + o.remainingAmount + ' ' + realPrice + ' room: ' + marketRoom);
            }
            else
            {
                console.log('market: ' + MIN_PRICE + ' ' + energy + ' ' + marketRoom);
            }
            
        }
        //console.log(Game.cpu.getUsed() - usedCPU);
    }
}

var getRealPrice = function(o, room)
{
    return (o.remainingAmount * o.price) / (o.remainingAmount + Game.market.calcTransactionCost(o.remainingAmount, o.roomName, room));
}

var maxPrice = function(offers, room)
{
    var res;
    for(var o in offers)
    {
        var offer = offers[o];
        if(typeof(res) == 'undefined')
        {
            res = offer;
        }
        else
        {
            if(getRealPrice(offer, room) > getRealPrice(res, room))
            {
                res = offer;
            }
        }
    }
    return res;
}
