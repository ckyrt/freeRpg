// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

    onLoad () {

        let back = cc.find("Canvas/back");
        this.gs_ = back.getComponent('gameScript')

        this.node.on(cc.Node.EventType.TOUCH_START,
            function(t){
                console.log("cc.Node.EventType.TOUCH_START ")
            
            },this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE,
            function(t){
                console.log("cc.Node.EventType.TOUCH_MOVE ")
            
            },this)
             
        this.node.on(cc.Node.EventType.TOUCH_END,
            function(t){
                console.log("cc.Node.EventType.TOUCH_END ")
                this.gs_.setCurItemScript(this)
            },this)
             
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,
            function(t){
                console.log("cc.Node.EventType.TOUCH_CANCEL ")

            },this)
    },

    start () {

    },

    addItemToPos:function(x, y)
    {
        var attrs = {
            'hp':30,
            'max_hp':30,
            'camp': 1,
            'speed':20,
            'imgSrc':'078-Devil04',
            'spriteWidth':96,
            'spriteHeight':96,
            'eye_distance':5, 
            'attack_dis':1,
            'attackInterval':2000,
            'bulletFlySpeed':2,
            'endPosX':14,
            'endPosY':45,
            'attack':5,
            'defend':3,
        }
        this.gs_.add_item(x, y, attrs)
    },

    // update (dt) {},
});
