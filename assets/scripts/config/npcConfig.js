
var itemConfig = require('itemConfig')
var monsterConfig = require('monsterConfig')

var npcConfig = {

    '新手指导员':{
                
        'imgSrc':'066-Beast04',
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
                    '不错 年轻人，你确定需要加入正派吗？',
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
}
module.exports = npcConfig






/*








*/