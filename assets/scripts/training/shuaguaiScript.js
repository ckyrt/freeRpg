var monsterConfig = require('monsterConfig')
var dropConfig = require('dropConfig')

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

        role:null,
        monster:null,

        //monster
        monster_prefab:{
            type:cc.Prefab,
            default:null,
        },

        //fight ground
        fight_ground_prefab:{
            type:cc.Prefab,
            default:null,
        },

        //一场 战斗 包括以下要素
        //玩家 和 怪物，各有各自的属性
        //5秒一回合，轮番攻击对方，直到一方血量为0 结束。
        //玩家死 损失一些
        //怪物死 掉落一些东西（概率），增加经验 增加金钱 等等
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let back = cc.find("Canvas/back")
        this.gs_ = back.getComponent('gameScript')
    },

    // update (dt) {},

    //开启一场战斗
    createAFight: function(roleAttrs, monsterAttrs)
    {
        this.initFightGround()
        this.role = this._createMonster(roleAttrs, 0, -100)
        this.monster = this._createMonster(monsterAttrs, 0, 100)
        this.yourTurn = false


        var interval = 1 
        this.schedule(this._fightRound, interval);
    },

    _fightRound:function()
    {
        let attacker = this.yourTurn?this.role:this.monster
        let defender = this.yourTurn?this.monster:this.role

        this.playAttackAnim_(attacker, defender)

        let damage = this._computeDamage(attacker, defender)
        this._executeDamage(defender, damage, 'normal attack')

        console.log('round')
        if(attacker.getAttr('hp') == 0 || defender.getAttr('hp') == 0)
        {
            console.log('finish')
            this._finishFight(this.role, this.monster, this.role.getAttr('hp')>0)
        }
        this.yourTurn = !this.yourTurn
    },

    //计算 attacker 对 defender造成的伤害（最终扣血的多少）
    _computeDamage: function(attacker, defender)
    {
        //使用带装备的总属性
        let damage = attacker.getAttrWithEquip('attack') - defender.getAttrWithEquip('defend')
        
        if(damage < 1)
            damage = 1
        this.gs_._addTextInfo(attacker.getAttr('name')+' 对 '+defender.getAttr('name')+' 造成 '+damage+' 点伤害')
        return damage
    },

    //执行伤害
    _executeDamage:function(unit, damage, reason)
    {
        let curHp = unit.getAttr('hp')
        curHp -= damage
        if(curHp < 1)
            curHp = 0
        unit.setAttr('hp', curHp)
    },

    //攻击动画
    playAttackAnim_:function(attacker, defender)
    {

    },

    //创建一个怪物  
    _createMonster:function(attrs, x, y)
    {
        var monsterPreb = cc.instantiate(this.monster_prefab)
        this.node.addChild(monsterPreb)
        var monster  = monsterPreb.getComponent("monsterScript")
        monster.initMonsterAttrs(attrs)

        monsterPreb.setPosition(x, y)
        return monster
    },

    //初始化战场
    initFightGround:function()
    {
        var ground = cc.instantiate(this.fight_ground_prefab)
        this.node.addChild(ground)

        ground.setPosition(0, 0)
        this.groundNode = ground
    },

    //结束战斗
    _finishFight:function(role, monster, success)
    {
        if(success)
        {
            this.gs_._addTextInfo('战斗胜利')
            //执行 掉落 经验 铜钱
            let exp = monster.getAttr('exp')
            let coin = monster.getAttr('coin')
            let dropstr = monster.getAttr('drop')
            dropConfig.dropToRole(this.gs_, dropstr)
            this.gs_.addBagCoin(coin)
            this.gs_.addRoleExp(exp)
        }
        else
        {
            this.gs_._addTextInfo('战斗失败')
        }
        this.unschedule(this._fightRound)

        //清除战场
        this.groundNode.destroy()
        this.role.node.destroy()
        this.monster.node.destroy()
    },
});
