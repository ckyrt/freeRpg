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
        //放一个地雷 地雷没有血 谁碰上就触发爆炸 然后地雷也移除

        //地雷
        var attrs = {
            'hp':1,
            'max_hp':1,
            'camp': 2,
            'speed':0,
            'imgSrc':'199-Support07',
            'spriteWidth':32,
            'spriteHeight':48,
            'eye_distance':0, 
            'attack_dis':0,
            'attackInterval':1000,
            'bulletFlySpeed':0,
            'endPosX':0,
            'endPosY':0,
            'attack':0,
            'defend':0,

            'mineRadius':5, //爆炸半径
            'mineHurt':5,   //地雷伤害
        }
        this.gs_.add_item(x, y, attrs)
        console.log("add a mine")
    },

    // update (dt) {},
});
