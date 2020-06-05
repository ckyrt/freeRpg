// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

    },

    // update (dt) {},

    setIJ(i,j){
        this.i_ = i
        this.j_ = j
    },
    setData:function(d)
    {
        this.d_ = d
        if(d == 1)
        {
            this.node.color = new cc.Color(255, 0, 0)
            this.node.opacity = 90
        }
        if(d == 0)
        {
            this.node.color = new cc.Color(255, 255, 0)
            this.node.opacity = 90
        }
        if(d == 2)
        {
            this.node.color = new cc.Color(0, 0, 255)
            this.node.opacity = 90
        }
    },
    getData:function()
    {
        return this.d_
    }
});
