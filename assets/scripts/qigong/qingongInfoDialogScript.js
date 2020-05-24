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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START,this.closeQinggongInfo, this)
    },

    // update (dt) {},

    closeQinggongInfo:function(t)
    {
        this.node.destroy()
    },

    openQinggongInfo:function(k, level)
    {
        let qinggong = qigongConfig[k]

        let name = global.getChildByName(this.node, "name")
        let descript = global.getChildByName(this.node, "descript")
        

        let descStr = qinggong.descript + '\n('+ qinggong.descript+')'
        let qigongName = qinggong.name
        let curNum = qinggong.nums[level]
        let nextNum = qinggong.nums[level+1]

        descStr = descStr.replace('$', curNum)
        descStr = descStr.replace('$', nextNum)
        
        name.getComponent(cc.Label).string = qigongName
        descript.getComponent(cc.Label).string = descStr
    },
});
