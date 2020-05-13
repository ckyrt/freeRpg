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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START,this.closeItemInfo, this)

        let handleBt = global.getChildByName(this.node, "handleBt")
        handleBt.on(cc.Node.EventType.TOUCH_START,this.handleItem, this)
    },

    // update (dt) {},

    closeItemInfo:function(t)
    {
        this.node.x = -1000
    },

    openItemInfo:function(bagItem)
    {
        this.item_ = bagItem
        this.node.x = 0

        let itemName = global.getChildByName(this.node, "itemName")
        let itemDescript = global.getChildByName(this.node, "itemDescript")
        itemName.getComponent(cc.Label).string = bagItem.getAttr('name')
        itemDescript.getComponent(cc.Label).string = bagItem.getAttr('descript')


        let handleBt = global.getChildByName(this.node, "handleBt")
        let btStr = global.getChildByName(handleBt, "str")
        if(this.item_.bagOrBody_ == 'inBag')
        {
            btStr.getComponent(cc.Label).string = '穿上'
        }
        else if(this.item_.bagOrBody_ == 'onBody')
        {
            btStr.getComponent(cc.Label).string = '卸下'
        }
    },

    handleItem:function(t)
    {
        let roleEquip = cc.find("Canvas/back/ui/roleEquipInfo")
        let equipScript = roleEquip.getComponent('RoleEquipScript')

        let part = this.item_.getAttr('part')
        if(this.item_.bagOrBody_ == 'inBag')
        {
            //背包里的 穿到身上
            let ret = equipScript.wearEquipItemFromBag(part, this.item_)
        }
        else if(this.item_.bagOrBody_ == 'onBody')
        {
            //身上的 卸下到背包
            let ret = equipScript.takeoffEquipItemToBag(part)
        }
        this.closeItemInfo()
    },
});
