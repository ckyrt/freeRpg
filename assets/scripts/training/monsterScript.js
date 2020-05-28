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
    },

    // update (dt) {},

    initMonsterAttrs(attrs)
    {
        this.allAttrs = JSON.parse(JSON.stringify(attrs)) //attrs//深拷贝

        this.node.getChildByName('monster_name').getComponent( cc.Label ).string = this.getAttr('name')

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

            console.log('npc init load res')
　　　　})

        //战斗 装备气功等最大血量添加到身上
        if(this.getAttr('isRole'))
        {
            this.setAttr('hp', this.getFightAttr('max_hp'))
        }
    },

    setAttr: function(att, v)
    {
        let v1 = this.getAttr(att)
        if(v == v1)
            return
        
        if(att == 'hp')
        {
            //血量不大于最大血量
            if(v > this.getFightAttr('max_hp'))
                v = this.getFightAttr('max_hp')
            //最小为0
            if(v < 1)
                v = 0
        }

        this.allAttrs[att] = v

        if(att == 'hp')
        {
            this.node.getChildByName('hp').getChildByName('cur_hp').getComponent( cc.Sprite ).fillRange = v / this.getFightAttr('max_hp')
        }
    },

    getAttr: function(att)
    {
        if(!this.allAttrs)
            return null
        if(!this.allAttrs.hasOwnProperty(att))
            return null
        return this.allAttrs[att]
    },

    //得到总属性
    getFightAttr:function(att)
    {
        if(!this.getAttr('isRole'))
        {
            return this.getAttr(att)
        }

        let roleInfo = cc.find("Canvas/back/ui/roleInfo").getComponent('RoleInfoScript')
        return roleInfo.getFightAttr(att)
    },
});
