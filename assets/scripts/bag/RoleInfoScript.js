var global = require('global')
var expConfig = require('expConfig')

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
        this.level_v = global.getChildByName(this.node, "level_v").getComponent(cc.Label)
        this.exp_v = global.getChildByName(this.node, "exp_v").getComponent(cc.Label)
        
        this.attack_v = global.getChildByName(this.node, "attack_v").getComponent(cc.Label)
        this.defend_v = global.getChildByName(this.node, "defend_v").getComponent(cc.Label)
        this.maxhp_v = global.getChildByName(this.node, "maxhp_v").getComponent(cc.Label)

        this.crit_r_v = global.getChildByName(this.node, "crit_r_v").getComponent(cc.Label)
        this.crit_m_v = global.getChildByName(this.node, "crit_m_v").getComponent(cc.Label)
        this.fanshang_v = global.getChildByName(this.node, "fanshang_v").getComponent(cc.Label)
        this.avoid_v = global.getChildByName(this.node, "avoid_v").getComponent(cc.Label)
        this.accurate_v = global.getChildByName(this.node, "accurate_v").getComponent(cc.Label)
        this.suck_r_v = global.getChildByName(this.node, "suck_r_v").getComponent(cc.Label)
        this.suck_p_v = global.getChildByName(this.node, "suck_p_v").getComponent(cc.Label)

        this.allItems = {}

        this.equip = cc.find("Canvas/back/ui/roleEquipInfo").getComponent('RoleEquipScript')
        this.qigong = cc.find("Canvas/back/ui/qigongPanel").getComponent('qigongPanelScript')
    },

    // update (dt) {},

    openRoleInfo:function(role)
    {
        this.node.x = 0
        this.role = role

        this.refreshInfo()
    },

    closeRoleInfo:function(t)
    {
        this.node.x = -1000
    },

    refreshInfo:function()
    {
        this.camp_v.string = this.role.getAttr('zhengxie')
        this.level_v.string = this.role.getAttr('level')
        this.exp_v.string = this.role.getAttr('exp') + '/' + expConfig.getLevelExp(this.role.getAttr('level'))


        let min_attack = this.role.getAttr('attack') + this.equip.getEquipAttr('attack-min') + this.qigong.getQigongAttr('attack')
        let max_attack = this.role.getAttr('attack') + this.equip.getEquipAttr('attack-max') + this.qigong.getQigongAttr('attack')

        this.attack_v.string = min_attack + '-'+ max_attack
        this.defend_v.string = this.getFightAttr('defend')
        this.maxhp_v.string = this.getFightAttr('max_hp')
        

        this.crit_r_v.string = this.getFightAttr('crit_rate')
        this.crit_m_v.string = this.getFightAttr('crit_multi')
        this.fanshang_v.string = this.getFightAttr('fanshang_rate')
        this.avoid_v.string = this.getFightAttr('avoid_rate')
        this.accurate_v.string = this.getFightAttr('accurate_rate')
        this.suck_r_v.string = this.getFightAttr('suck_rate')
        this.suck_p_v.string = this.getFightAttr('suck_percent')
    },

    getFightAttr:function(att)
    {
        let v = 0
        if(att == 'attack')
        {
            //攻击力 特殊 取区间
            let attack_min = this.equip.getEquipAttr('attack-min')
            let attack_max = this.equip.getEquipAttr('attack-max')
            v = this.role.getAttr(att) + global.random(attack_min, attack_max) + this.qigong.getQigongAttr(att)
        }
        else
        {
            v = this.role.getAttr(att) + this.equip.getEquipAttr(att) + this.qigong.getQigongAttr(att)
        }
        console.log('att:'+att+',value:'+v)
        return v
    }
});
