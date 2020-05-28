var global = require('global')
var itemConfig = require('itemConfig')

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

        //道具
        bag_item_prefab:{
            type:cc.Prefab,
            default:null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START,this.closeShopPanel, this)
    },

    // update (dt) {},

    showShopItems:function(itemNames)
    {
        let j = 0
        for (var n of itemNames)
        {
            let config = itemConfig[n]
            var prefab = cc.instantiate(this.bag_item_prefab)
            this.node.addChild(prefab)
            prefab.setPosition(-175 + (j%7)*60, 80 - (Math.floor(j/7))*60)

            var item  = prefab.getComponent("bagItemScript")
            item.initBagItem(config, 'inShop')

            j++
        }
    },

    closeShopPanel:function()
    {
        this.node.destroy()
    },

    buyShopItemToBag: function(item)
    {
        //扣除金钱 添加道具到背包
        let cost = item.getAttr('coin')

        let ret = this.gs_.addBagCoin(-cost)
        if(ret == 'success')
            this.gs_.addBagItem(item.allAttrs)
    },
});
