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
    },

    setAttr: function(att, v)
    {
        let v1 = this.getAttr(att)

        if(v == v1)
            return

        this.allAttrs[att] = v

        if(att == 'hp')
        {
            this.node.getChildByName('hp').getChildByName('cur_hp').getComponent( cc.Sprite ).fillRange = v / this.getAttr('max_hp')
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
    getAttrWithEquipWithQigong:function(att)
    {
        if(!this.getAttr('isRole'))
        {
            return this.getAttr(att)
        }
        
        //装备
        let roleEquip = cc.find("Canvas/back/ui/roleEquipInfo")
        let equipInfo = roleEquip.getComponent('RoleEquipScript')
        //气功
        let panel = cc.find("Canvas/back/ui/qigongPanel")
        let qigongPanel = panel.getComponent('qigongPanelScript')

        if(att == 'attack')
        {
            //攻击力 特殊 取区间
            let attack_min = equipInfo.getEquipAttr('attack-min')
            let attack_max = equipInfo.getEquipAttr('attack-max')
            return this.getAttr(att) + global.random(attack_min, attack_max)
        }
        else
        {
            return this.getAttr(att) + equipInfo.getEquipAttr(att) + qigongPanel.getQigongAttr(att)
        }
    },
});
