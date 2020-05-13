

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
        let bt1 = global.getChildByName(this.node, "bt1")
        let bt2 = global.getChildByName(this.node, "bt2")
        bt1.on(cc.Node.EventType.TOUCH_START,this.btFunc1,this)
        bt2.on(cc.Node.EventType.TOUCH_START,this.btFunc2,this)
    },

    // update (dt) {},

    closeDialog:function()
    {
        this.node.x = -1000

        let bt1 = global.getChildByName(this.node, "bt1")
        let bt2 = global.getChildByName(this.node, "bt2")

        bt1.active = false
        bt2.active = false
        this.func1 = null
        this.func2 = null
    },

    showDialog:function(content, func1=null, func2=null, tx1='好的', tx2='算了')
    {
        this.closeDialog()

        let contentNode = global.getChildByName(this.node, "content")
        contentNode.getComponent(cc.Label).string = content
        this.node.x = 0

        let bt1 = global.getChildByName(this.node, "bt1")
        let bt2 = global.getChildByName(this.node, "bt2")

        global.getChildByName(bt1, "tx1").getComponent(cc.Label).string = tx1
        global.getChildByName(bt2, "tx2").getComponent(cc.Label).string = tx2

        bt1.active = func1? true:false
        this.func1 = func1

        bt2.active = func2? true:false
        this.func2 = func2
    },

    btFunc1:function(t)
    {
        if(this.func1)
            this.func1()
    },
    
    btFunc2:function(t)
    {
        if(this.func2)
            this.func2()
    },
});
