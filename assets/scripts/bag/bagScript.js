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

        items:{
            default:[],
        },

        coin_:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        {
            this.add_bag_item(itemConfig['直刀'])
            this.add_bag_item(itemConfig['铁刀'])
            this.add_bag_item(itemConfig['钢刀'])
            this.add_bag_item(itemConfig['半月刀'])

            this.add_bag_item(itemConfig['精钢刀'])
            this.add_bag_item(itemConfig['雁月刀'])
            this.add_bag_item(itemConfig['赤血刀'])
            this.add_bag_item(itemConfig['重曲刀'])

            this.add_bag_item(itemConfig['无名战袍'])
            this.add_bag_item(itemConfig['金丝战袍'])
            this.add_bag_item(itemConfig['乌蚕战袍'])
        }
    },

    start () {

        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START,this.closeBag, this)
    },

    // update (dt) {},

    _add_item:function(item)
    {
        item.uid = global.getUid()
        this.items.push(item)
    },

    _remove_item:function(item)
    {
        var index = this.items.indexOf(item)
        this.items.splice(index,1)
    },

    _get_item:function(uid)
    {
        var item = this.items.find(function(ele){ 
            return ele.uid == uid
         }, uid)
         return item
    },

    add_bag_item:function(attrs)
    {
        var itemPreb = cc.instantiate(this.bag_item_prefab)
        this.node.addChild(itemPreb)
        var item  = itemPreb.getComponent("bagItemScript")
        item.initBagItem(attrs, 'inBag')

        this._add_item(item)

        this.refreshBag()

        return item
    },

    remove_item:function(uid)
    {
        var item = this._get_item(uid)
        if(item)
        {
            this._remove_item(item)
            item.node.destroy()
        }

        this.refreshBag()
    },

    openBag:function()
    {
        this.node.x = 0
        this.refreshBag()
    },

    closeBag:function(t)
    {
        this.node.x = -1000
        console.log('closeBag')
    },

    refreshBag:function()
    {
        console.log('refreshBag '+this.items.length)
        let j = 0
        let len = 0
        for(j = 0,len=this.items.length; j < len; j++) {
            let ele = this.items[j]
            //设定位置
            ele.node.setPosition(-175 + (j%7)*60, 80 - (Math.floor(j/7))*60)
        }
        console.log('refreshBag2 '+this.items.length)
    },

    addCoin:function(num)
    {
        this.coin_ += num
        let coinNode = global.getChildByName(this.node, "coin")
        coinNode.getComponent(cc.Label).string = this.coin_
    },
});
