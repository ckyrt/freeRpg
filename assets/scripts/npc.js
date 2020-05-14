
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
        oldRole:null,
    },
    
    update:function(dt)
    {
        var roles = this.gs_.getRolesInRadius(this.x, this.y, this, 2)
        if(roles.length > 0)
        {
            if(this.oldRole == null)
            {
                //roles[0] enter
                this.onRoleCloseTo(roles[0])
                this.oldRole = roles[0]
            }
        }
        else
        {
            if(this.oldRole != null)
            {
                //oldRole leave
                this.onRoleLeave(this.oldRole)
                this.oldRole = null
            }
        }
    },

    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {

        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        npcFunc.gs_ = this.gs_
    },

    init(attrs)
    {
        this.allAttrs = attrs//JSON.parse(JSON.stringify(attrs)) //attrs//深拷贝

        this.node.getChildByName('npc_name').getComponent( cc.Label ).string = this.getAttr('npcName')

        //加载图片
        var url = 'textures/' + this.allAttrs['imgSrc']
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

            self.node.width = self.getAttr('spriteWidth')
            self.node.height = self.getAttr('spriteHeight')

            console.log('npc init load res')
　　　　})
    },

    setAttr: function(att, v)
    {
        let v1 = this.getAttr(att)

        if(v == v1)
            return

        this.allAttrs[att] = v

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

    onRoleCloseTo:function(role)
    {
        let onRoleCloseTo = this.getAttr('onRoleCloseTo') 
        onRoleCloseTo(role, this.gs_)

        // var attString = ""
        // for(var key in this.allAttrs){
        //     attString += key+":"
        //     attString += this.allAttrs[key]+","
        // }
        // console.log('attString '+ attString)
    },

    onRoleLeave:function(role)
    {
        console.log('onRoleLeave')
        this.gs_._closeDialog()
    }
});
