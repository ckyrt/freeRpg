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
        var soldierAttrs = {
            'hp':10,
            'max_hp':10,
            'camp': 1,
            'speed':50,
            'imgSrc':'104-Civilian04',
            'spriteWidth':32,
            'spriteHeight':48,
            'eye_distance':10, 
            'attack_dis':1,
            'attackInterval':1000,
            'bulletFlySpeed':0,
            'endPosX':14,
            'endPosY':45,
            'attack':1,
            'defend':0,
        }

        var campAttrs = {
            'hp':10,
            'max_hp':10,
            'camp': 1,
            'speed':0,
            'imgSrc':'093-Monster07',
            'spriteWidth':32,
            'spriteHeight':48,
            'eye_distance':10, 
            'attack_dis':0,
            'attackInterval':9999,
            'bulletFlySpeed':0,
            'endPosX':14,
            'endPosY':45,
            'attack':0,
            'defend':0,
            'lifeTime':16000,  //生命 ms
        }

        //兵营自己也是一个单位 只有血 没有攻击力
        let campItem = this.gs_.add_item(x, y, campAttrs)

        //兵营 每 interval 秒刷一个兵 共allNum次
        //interval, repeat, delay
        var allNum = 10
        var interval = 1
        this.gs_.add_item(x, y+1, soldierAttrs)
        this.schedule(function() {
            
            if(campItem.getAttr('hp') < 1)
                return
            this.gs_.add_item(x, y+1, soldierAttrs)
        }, interval, allNum-1, 0)
    },

    // update (dt) {},
});
