var qigongConfig = require('qigongConfig')
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

        //气功项
        qigongAdd_prefab:{
            type:cc.Prefab,
            default:null,
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START,this.closeQigongPanel, this)

        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

        this.qigongItems_ = {}
    },

    // update (dt) {},

    openQigongPanel:function()
    {
        this.node.x = 0

        let i = 0
        for(var k in qigongConfig)
        {
            let qinggong = qigongConfig[k]

            var prefab = cc.instantiate(this.qigongAdd_prefab)
            this.node.addChild(prefab)
            prefab.setPosition( -180+110*(i%4), 100 - 80*(Math.floor(i/4)))
            i++

            let qigongItem = prefab.getComponent('qigongItemScript')

            qigongItem.setQinggongKey(qinggong.att)
            qigongItem.setImg(qinggong.imgSrc)
            qigongItem.setLevel(0)

            this.qigongItems_[qinggong.att] = qigongItem
        } 
    },

    closeQigongPanel:function(t)
    {
        this.node.x = -1000
    },

    getQigongAttr:function(att)
    {
        if(qigongConfig[att] == null)
            return
        let item = this.qigongItems_[att] 
        let attLevel = item.getCurLevel()
        return qigongConfig[att].nums[attLevel]
    },
});
