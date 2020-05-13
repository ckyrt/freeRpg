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

        items:{
            default:[],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        {
            var attrs = {
                'imgSrc':'001-Weapon01',
                'attack':10,
                'name':'短剑',
                'part':'weapon',
                'descript':'一把可以用来对付小动物的武器，增加10点攻击力',
            }
            this.add_bag_item(attrs)
        }
        {
            var attrs = {
                'imgSrc':'009-Shield01',
                'defend':10,
                'name':'木盾',
                'part':'shield',
                'descript':'有了它 可以增加你的抗击打能力，增加防御力10点',
            }
            this.add_bag_item(attrs)
        }
        {
            var attrs = {
                'imgSrc':'003-Weapon03',
                'attack':15,
                'name':'短剑',
                'part':'weapon',
                'descript':'一把小斧头，用起来非常顺手，增加15点攻击力',
            }
            this.add_bag_item(attrs)
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
        for(j = 0,len=this.items.length; j < len; j++) {
            ele = this.items[j]
            //设定位置
            ele.node.setPosition(this.node.x - 200 + j*60, this.node.y + 80 - (Math.floor(j/6))*60)
        }
        console.log('refreshBag2 '+this.items.length)
    },
});
