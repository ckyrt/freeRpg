var monsterConfig = require('monsterConfig')
var global = require('global')

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        
        //挑战按钮
        challengeMonsterBt_prefab:{
            type:cc.Prefab,
            default:null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START,this.closeTrainPanel, this)

        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_
    },

    // update (dt) {},

    openTrainPanel:function()
    {
        this.node.x = 0

        let i = 0
        for(var k in monsterConfig)
        {
            let monsterAttr = monsterConfig[k]

            var prefab = cc.instantiate(this.challengeMonsterBt_prefab)
            this.node.addChild(prefab)
            prefab.setPosition( -180+110*(i%4), 100 - 50*(Math.floor(i/4)))

            let nameNode = global.getChildByName(prefab, 'monsterName')
            nameNode.getComponent(cc.Label).string = k

            prefab.on(cc.Node.EventType.TOUCH_START, function(){
                this.gs_.node.getComponent('shuaguaiScript').createAFight(this.gs_.roles[0].allAttrs, monsterAttr)
            }, this)
            i++
        }
        
    },

    closeTrainPanel:function(t)
    {
        this.node.x = -2000
    },
});
