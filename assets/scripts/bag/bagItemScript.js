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
        uid:0,
        //iteminfo
        itemInfoDialog_prefab:{
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
        
        this.node.on(cc.Node.EventType.TOUCH_START,this.clickFunc,this)
    },

    // update (dt) {},

    initBagItem(attrs, bagOrBody)
    {
        this.bagOrBody_ = bagOrBody
        this.allAttrs = attrs//JSON.parse(JSON.stringify(attrs)) //attrs//深拷贝
        //加载图片
        var url = 'textures/Icons/' + this.allAttrs['imgSrc']
        console.log('url:'+url)
        var self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function(err,spriteFrame)
　　　　{
            if (err) {
                cc.error(err.message || err);
                return;
            }
            
            var sp = global.getChildByName(self.node, "icon").getComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame//更改图片

            console.log('bagItem init load res')
　　　　})
    },

    clickFunc:function(t)
    {
        var itemPreb = cc.instantiate(this.itemInfoDialog_prefab)
        this.gs_.node.addChild(itemPreb)
        itemPreb.setPosition(this.node.x, this.node.y)
        itemPreb.getComponent("itemInfoScript").openItemInfo(this)

        console.log(this.node.x+','+this.node.y)
    },

    setAttr: function(att, v)
    {
        let v1 = this.getAttr(att)

        if(v == v1)
            return

        this.allAttrs[att] = v
    },

    getAttr: function(att)
    {
        if(!this.allAttrs)
            return null
        if(!this.allAttrs.hasOwnProperty(att))
            return null
        return this.allAttrs[att]
    },
});
