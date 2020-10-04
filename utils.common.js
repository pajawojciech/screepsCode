module.exports = {
    getMinMax : function (list, func)
    {
        if(typeof(list) == 'undefined' || list == null || list == 0)
        {
            return null;
        }
        
        var value = func(list[0]);
        var minObj = list[0];
        var minVal = value;
        var maxObj = list[0];
        var maxVal = value;
        
        for(var i in list)
        {
            if(i == 0) continue;
            value = func(list[i]);
            if(value > maxVal)
            {
                maxVal = value;
                maxObj = list[i];
            }
            if(value < minVal)
            {
                minVal = value;
                minObj = list[i];
            }
        }

        return {
            minObj : minObj,
            minVal : minVal,
            maxObj : maxObj,
            maxVal : maxVal
        }
    },
};