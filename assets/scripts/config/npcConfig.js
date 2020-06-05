
var itemConfig = require('itemConfig')
var monsterConfig = require('monsterConfig')

var npcConfig = {

    '新手指导员':{
                
        'imgSrc':'137-BunnyGirl01',
        'spriteWidth':32,
        'spriteHeight':48,
        'npcName':'新手指导员',
        onRoleCloseTo:function(role, gs)
        {
            if(role.getAttr('zhengxie') == null)
                gs._showDialog('小子 欢迎来到泫渤派啊 你还太嫩 需要去加入一个门派, 你可以去找 柳娟(正)或者 温有余(邪), 他们会告诉你怎么做')
            else
                gs._showDialog('你已经加入了门派 去做该做的事情去吧')
        },
    },

    '地图3传送员':{ 
        'imgSrc':'047-Grappler02',
        'spriteWidth':32,
        'spriteHeight':48,
        'npcName':'地图3传送员',
        onRoleCloseTo:function(role, gs)
        {
            gs._showDialog('你要去 地图3 吗？',
            function()
            {
                gs.jumpMap(role, '地图3', 1, 1)
                gs._closeDialog()
            },
            function()
            {
                gs._closeDialog()
            },'好','不')
        },
    },

    '地图1传送员':{ 
        'imgSrc':'046-Grappler01',
        'spriteWidth':32,
        'spriteHeight':48,
        'npcName':'地图1传送员',
        onRoleCloseTo:function(role, gs)
        {
            gs._showDialog('你要去 地图1 吗？',
            function()
            {
                gs.jumpMap(role, '地图1', 1, 1)
                gs._closeDialog()
            },
            function()
            {
                gs._closeDialog()
            },'好','不')
        },
    },

    '柳娟':{
                
        'imgSrc':'006-Fighter06',
        'spriteWidth':32,
        'spriteHeight':48,
        'npcName':'柳娟',
        onRoleCloseTo:function(role, gs)
        {
            if(role.getAttr('zhengxie') == null)
            {
                gs._showDialog(
                    '二愣子睁大着双眼，直直望着茅草和烂泥糊成的黑屋顶，身上盖着的旧棉被，已呈深黄色，看不出原来的本来面目，还若有若无的散发着淡淡的霉味。'+

                    '在他身边紧挨着的另一人，是二哥韩铸，酣睡的十分香甜，从他身上不时传来轻重不一的阵阵打呼声。'+
                    
                    '离床大约半丈远的地方，是一堵黄泥糊成的土墙，因为时间过久，墙壁上裂开了几丝不起眼的细长口子，从这些裂纹中，隐隐约约的传来韩母唠唠叨叨的埋怨声，偶尔还掺杂着韩父，抽旱烟杆的“啪嗒”“啪嗒”吸允声。'+
                    
                    '二愣子缓缓的闭上已有些发涩的双目，迫使自己尽早进入深深的睡梦中。他心里非常清楚，再不老实入睡的话，明天就无法早起些了，也就无法和其他约好的同伴一起进山拣干柴。',
                function()
                {
                    role.setAttr('zhengxie', 'zheng')
                    gs._addTextInfo('你已加入正派')
                    gs._showDialog('恭喜，你已经是正派的成员了，赠送你一个礼物，以后江湖路就看你的了！')
                    //gs.addBagItem(itemConfig['重曲刀'])

                },
                function()
                {
                    gs._closeDialog()
                },
                '行','算了')
            }
            else
            {
                gs._showDialog('你已经加入了门派 去做该做的事情去吧')
            }
        },
    },

    '温有余':{
                
        'imgSrc':'013-Warrior01',
        'spriteWidth':32,
        'spriteHeight':48,
        'npcName':'温有余',

        onRoleCloseTo:function(role, gs)
        {
            if(role.getAttr('zhengxie') == null)
                gs._showDialog('不错 年轻人，来加入我们邪派吧？', 
                function()
                {
                    role.setAttr('zhengxie', 'xie')
                    gs._addTextInfo('你已加入邪派')
                    gs._showDialog('恭喜，以后打败正派那些伪君子就看你的了！赠送你一个礼物。')
                    //gs.addBagItem(itemConfig['赤血刀'])
                },
                function()
                {
                    gs._closeDialog()
                },'行','算了')
            else
                gs._showDialog('你已经加入了门派 去做该做的事情去吧')
        },
    },

    '王二牛':{
                
        'imgSrc':'013-Warrior01',
        'spriteWidth':32,
        'spriteHeight':48,
        'npcName':'王二牛',
        onRoleCloseTo:function(role, gs)
        {
            gs._showDialog('最近很多小动物骚扰我们，你能帮助铲除吗？',
            function()
            {
                gs.node.getComponent('shuaguaiScript').createAFight(role.allAttrs, monsterConfig['野猫'])
            },
            function()
            {
                gs._closeDialog()
            },'好','算了')
        },
    },

    '平十指':{
                
        'imgSrc':'128-Noble03',
        'spriteWidth':32,
        'spriteHeight':48,
        'npcName':'平十指',
        onRoleCloseTo:function(role, gs)
        {
            gs._showDialog('走过路过不要错过！客观需要点什么嘛..',
            function()
            {
                gs._closeDialog()
                gs.openShopPanel(['重曲刀', '无名战袍'])
            },
            function()
            {
                gs._closeDialog()
            },'嗯','算了')
        },
    },
}
module.exports = npcConfig






/*








*/