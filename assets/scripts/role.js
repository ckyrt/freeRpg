
var global = require('global')
var npcFunc = require('npcFunc')

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
        x:0,
        y:0,
    },
    
    update:function(dt)
    {
        let x = this.getAttr('nextX')
        let y = this.getAttr('nextY')

        let backX = this.gs_.node.x
        let backY = this.gs_.node.y

        if(x == null || y == null)
            return
        if(this.x == x && this.y == y)
            return

        // console.log('next '+x+","+y) 
        // console.log('cur '+this.x+","+this.y) 
        //检测到达
        if(global._checkArrived(x, y, this))
        {
            //到达 修正
            global.set_grid(x, y, this)          
            global._findPathAndGetNextPoint(this, this.getAttr('endPosX'), this.getAttr('endPosY'))

            //如果当前为遮挡 则改变透明度
            let gridData = this.gs_.node.getComponent('AstarSearch').getGridDataByXY(x,y)
            console.log('gridData:'+gridData)
            if( gridData == 2)
            {
                this.node.opacity = 90
            }
            else
            {
                this.node.opacity = 999
            }
        }
        else
        {
            //实施移动
            global._execMove(dt, x, y, this)
        }
    },

    moveTo:function(x,y)
    {
        //console.log('moveTo: '+x+','+y)

        this.setAttr('endPosX', x)
        this.setAttr('endPosY', y)

        global._findPathAndGetNextPoint(this, this.getAttr('endPosX'), this.getAttr('endPosY'))
    },



    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {

        let back = cc.find("Canvas/back");
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

        //图片切换时间间隔
        this.spriteChangeTime_ = 0
    },

    init(attrs)
    {
        this.allAttrs = JSON.parse(JSON.stringify(attrs)) //attrs//深拷贝

        //加载图片
        var url = 'textures/role/' + this.allAttrs['imgSrc']
        var self = this
        cc.loader.loadRes(url, cc.SpriteFrame, function(err,spriteFrame)
　　　　{
            if (err) {
                cc.error(err.message || err);
                return;
            }
            self.resource_sprite = spriteFrame

            //图片切换帧序号
            self.frameNumber_ = 0

            var sp = self.node.getComponent(cc.Sprite);//获取组件
            sp.spriteFrame = global._getWalkSprite(global.DIR_D, self);//更改图片

            //self.node.width = self.getAttr('spriteWidth')
            //self.node.height = self.getAttr('spriteHeight')

            console.log('role init load res')
　　　　})
    },

    setAttr: function(att, v)
    {
        let v1 = this.getAttr(att)

        if(v == v1)
            return

        this.allAttrs[att] = v

        this.node.getChildByName('role_name').getComponent( cc.Label ).string = this.getAttr('name')

        let attrEvent = new cc.Event.EventCustom("AttrChangeSig", true)
        attrEvent.setUserData({uid:this.uid, attr:att, old:v1, new:v,})
        let back = cc.find("Canvas/back");
        back.dispatchEvent(attrEvent)
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
