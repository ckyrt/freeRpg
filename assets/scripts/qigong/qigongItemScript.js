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
        //iteminfo
        qigongInfoDialog_prefab:{
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

        let addNode = global.getChildByName(this.node, 'add')
        let imgNode = global.getChildByName(this.node, 'img')
        addNode.on(cc.Node.EventType.TOUCH_START, this.levelUp, this)
        imgNode.on(cc.Node.EventType.TOUCH_START,this.lookInfo,this)
    },

    lookInfo:function(t)
    {
        var itemPreb = cc.instantiate(this.qigongInfoDialog_prefab)
        this.gs_.node.addChild(itemPreb)
        itemPreb.setPosition(this.node.x, this.node.y)
        itemPreb.getComponent("qingongInfoDialogScript").openQinggongInfo(this.qinggongKey, this.getCurLevel())

        console.log(this.node.x+','+this.node.y)
    },

    setQinggongKey:function(k)
    {
        this.qinggongKey = k
    },

    setImg:function(img)
    {
        var url = 'textures/' + img
        let self = this
        console.log('url:'+url)
        cc.loader.loadRes(url, cc.SpriteFrame, function(err,spriteFrame)
　　　　{
            if (err) {
                cc.error(err.message || err);
                return;
            }
            cc.log('set img:'+spriteFrame)

            let imgNode = global.getChildByName(self.node, 'img')
            imgNode.spriteFrame = spriteFrame
　　　　})
    },

    setLevel:function(l)
    {
        //l > max lv
        let len = qigongConfig[this.qinggongKey].nums.length
        if(l > len - 1)
        {
            return
        }
        let lvNode = global.getChildByName(this.node, 'lv')
        lvNode.getComponent(cc.Label).string = l
    },

    levelUp:function()
    {
        this.setLevel(this.getCurLevel() + 1)
    },

    getCurLevel:function()
    {
        let lvNode = global.getChildByName(this.node, 'lv')
        let curLevel = lvNode.getComponent(cc.Label).string
        return Number(curLevel)
    },
    // update (dt) {},
});
