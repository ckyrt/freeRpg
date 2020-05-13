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

        //道具
        bag_item_prefab:{
            type:cc.Prefab,
            default:null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START,this.closeRoleEquip, this)

        let head = global.getChildByName(this.node, "head")
        let l_hand = global.getChildByName(this.node, "l_hand")
        let r_hand = global.getChildByName(this.node, "r_hand")
        let cloth = global.getChildByName(this.node, "cloth")
        let shoes = global.getChildByName(this.node, "shoes")
        let weapon = global.getChildByName(this.node, "weapon")
        let shield = global.getChildByName(this.node, "shield")

        this.allItems = {}
    },

    // update (dt) {},

    openRoleEquip:function()
    {
        this.node.x = 0
        this.refreshEquip()
    },

    closeRoleEquip:function(t)
    {
        this.node.x = -1000
    },

    wearEquipItemFromBag: function(part, bagItem)
    {
        console.log('wearEquipItemFromBag rolequip')       
        
        //如果已存在那麽先卸下
        if(this.allItems[part] != null)
        {
            this.takeoffItem(part)
        }

        //穿上新的
        var itemPreb = cc.instantiate(this.bag_item_prefab)
        this.node.addChild(itemPreb)
        var item  = itemPreb.getComponent("bagItemScript")
        item.initBagItem(bagItem.allAttrs, 'onBody')

        //从背包移除
        let bag = cc.find("Canvas/back/ui/bag")
        let bagScript = bag.getComponent('bagScript')
        bagScript.remove_item(bagItem.uid)

        this.allItems[part] = item
        return 1
    },

    takeoffEquipItemToBag:function(part)
    {
        let equipItem = this.allItems[part]
        //放回背包
        if(equipItem == null)
        {
            //不存在
            return 0
        }

        //背包创建一个
        let bag = cc.find("Canvas/back/ui/bag")
        let bagScript = bag.getComponent('bagScript')
        bagScript.add_bag_item(equipItem.allAttrs)

        //身上把它移除
        equipItem.node.destroy()
        this.allItems[part] = null
        return 1
    },

    refreshEquip:function()
    {
        console.log('refreshEquip '+this.allItems.length)
        for(var part in this.allItems)
        {
            console.log("key: " + part + " ,value: " + this.allItems[part])
            let ele = this.allItems[part]
            if(ele == null)
                continue
            
            let partNode = global.getChildByName(this.node, part)
            //设定位置
            ele.node.setPosition(partNode.x, partNode.y)
        }
        
        console.log('refreshEquip2 '+this.allItems.length)
    },
});
