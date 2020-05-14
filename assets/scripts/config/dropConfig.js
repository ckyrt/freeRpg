
var global = require('global')
var itemConfig = require('itemConfig')

var dropConfig = {
    '1':{
        'drop_id':'1',
        'item':'短剑',
        'count':1,
        'rate':9000,//万分制
    },

    dropToRole:function(gs, dropStr)
    {
        //"'短剑':1:1000", //item count rate
        let drops = dropStr.split('|')
        for(var j = 0,len = drops.length; j < len; j++){
            
            let drop = drops[j].split(':')
            let itemName = drop[0]//name
            let count = drop[1]//count
            let rate = drop[2]//rate

            let n = global.random(1,10000)
            if(rate >=n)
            {
                //命中
                for(var i=0;i<count;i++)
                {
                    gs.addBagItem(itemConfig[itemName])
                }
            }
        }
        
    },
}
module.exports = dropConfig
