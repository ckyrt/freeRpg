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

        //道具
        bag_item_prefab:{
            type:cc.Prefab,
            default:null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

        let closeBt = global.getChildByName(this.node, "closeBt")
        closeBt.on(cc.Node.EventType.TOUCH_START,this.closeRoleInfo, this)

        this.camp_v = global.getChildByName(this.node, "camp_v").getComponent(cc.Label)
        this.attack_v = global.getChildByName(this.node, "attack_v").getComponent(cc.Label)
        this.defend_v = global.getChildByName(this.node, "defend_v").getComponent(cc.Label)
        this.maxhp_v = global.getChildByName(this.node, "maxhp_v").getComponent(cc.Label)
        this.level_v = global.getChildByName(this.node, "level_v").getComponent(cc.Label)
        this.exp_v = global.getChildByName(this.node, "exp_v").getComponent(cc.Label)

        this.attack_equip_v = global.getChildByName(this.node, "attack_equip_v").getComponent(cc.Label)
        this.defend_equip_v = global.getChildByName(this.node, "defend_equip_v").getComponent(cc.Label)
        this.maxhp_equip_v = global.getChildByName(this.node, "maxhp_equip_v").getComponent(cc.Label)

        this.allItems = {}
    },

    // update (dt) {},

    openRoleInfo:function(role, equip)
    {
        this.node.x = 0
        this.refreshInfo(role, equip)
    },

    closeRoleInfo:function(t)
    {
        this.node.x = -1000
    },

    refreshInfo:function(role, equip)
    {
        this.camp_v.string = role.getAttr('zhengxie')
        this.attack_v.string = role.getAttr('attack')
        this.defend_v.string = role.getAttr('defend')
        this.maxhp_v.string = role.getAttr('max_hp')
        this.level_v.string = role.getAttr('level')
        this.exp_v.string = role.getAttr('exp')

        let equip_attack = equip.getEquipAttr('attack')
        let equip_defend = equip.getEquipAttr('defend')
        let equip_max_hp = equip.getEquipAttr('max_hp')
        this.attack_equip_v.string = equip_attack > 0 ?'+ '+equip_attack:''
        this.defend_equip_v.string = equip_defend > 0 ?'+ '+equip_defend:''
        this.maxhp_equip_v.string = equip_max_hp > 0 ?'+ '+equip_max_hp:''
    },
});
