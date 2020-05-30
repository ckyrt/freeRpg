var monsterConfig = require('monsterConfig')
var dropConfig = require('dropConfig')
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

        
        numberJump_prefab:{
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

        console.log('round')
        if(attacker.getAttr('hp') == 0 || defender.getAttr('hp') == 0)
        {
            console.log('finish')
            this._finishFight(this.role, this.monster, this.role.getAttr('hp') > 0)
            return
        }

        this.playAttackAnim_(attacker, defender)

        this._computeDamage(attacker, defender)
        this.yourTurn = !this.yourTurn
    },

    //计算 attacker 对 defender造成的伤害（最终扣血的多少）
    _computeDamage: function(attacker, defender)
    {
        let damage = 0
        let damageType = 'normal'
        //闪避 命中
        let avoid = defender.getFightAttr('avoid_rate') - attacker.getFightAttr('accurate_rate')
        if(avoid > 0 && avoid >= global.random(0, 100))
        {
            //闪避
            damage = 0
            damageType = 'avoid'
        }
        else
        {
            //使用带装备的总属性
            damage = attacker.getFightAttr('attack') - defender.getFightAttr('defend')        
            if(damage < 1)
            {
                damage = 1
            }
        
            let critRate = attacker.getFightAttr('crit_rate')
            let critMulti = attacker.getFightAttr('crit_multi')
            //是否暴击
            if(critRate > 0 && critRate >= global.random(0, 100))
            {
                //暴击
                damage = Math.ceil(damage * (100+critMulti) / 100)
                damageType = 'crit'
            }

            //吸血计算
            let suck_rate = attacker.getFightAttr('suck_rate')
            let suck_percent = attacker.getFightAttr('suck_percent')
            if(suck_rate > 0 && suck_rate >= global.random(0, 100))
            {
                //吸血
                let blood = Math.ceil(damage * suck_percent / 100)
                if(blood < 1)
                    blood = 1
                this._executeDamage(attacker, defender, blood, 'suck')
                this.gs_._addTextInfo(attacker.getAttr('name') + ' 吸血 '+blood+' 点')
            }

            //反伤计算
            let fanshang_rate = defender.getFightAttr('fanshang_rate')
            if(fanshang_rate > 0 && fanshang_rate >= global.random(0, 100))
            {
                //反伤
                damageType = 'fanshang'
            }
        }

        this._executeDamage(attacker, defender, damage, damageType)
        this.gs_._addTextInfo(attacker.getAttr('name')+' 对 '+ defender.getAttr('name') + ' 造成 '+damage+' 点伤害')
    },

    _addUnitHp:function(unit, hp)
    {
        let curHp = unit.getAttr('hp')
        curHp += hp
        unit.setAttr('hp', curHp)
    },

    //执行伤害
    _executeDamage:function(attacker, unit, damage, reason)
    {
        let x = unit.node.x
        let y = unit.node.y + unit.node.height
        let attackX = attacker.node.x
        let attackY = attacker.node.y + attacker.node.height
        if(reason == 'normal')
        {
            this._addUnitHp(unit, -damage)
            this._playNumberJump(-damage, x,y, new cc.color(255,0,0))
        }
        if(reason == 'crit')
        {
            this._addUnitHp(unit, -damage)
            this._playNumberJump(-damage, x,y, new cc.color(255,0,0))
            this._playNumberJump('暴击', attackX,attackY, new cc.color(255,255,0))
        }
        if(reason == 'avoid')
        {
            this._playNumberJump('闪避', x,y, new cc.color(0,255,255))
        }
        if(reason == 'suck')
        {
            this._addUnitHp(attacker, damage)
            this._playNumberJump('吸血 '+damage, attackX, attackY, new cc.color(0,100,0))
        }
        if(reason == 'fanshang')
        {
            this._addUnitHp(unit, -damage)
            this._playNumberJump('反伤', x, y, new cc.color(255,0,100))

            this._addUnitHp(attacker, -damage)
            this._playNumberJump(-damage, attackX, attackY, new cc.color(255,0,0))
        }
    },

    //攻击动画
    playAttackAnim_:function(attacker, defender)
    {
        //冲过去 停留 然后再退回来

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

    //跳数字
    _playNumberJump:function(txt, x, y, color)
    {
        var numberJump = cc.instantiate(this.numberJump_prefab)
        this.node.addChild(numberJump)
        numberJump.setPosition(x, y)
        numberJump.getComponent('numberJumpScript').playJump(txt, color)
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
            this.gs_.addRoleExp(exp)

            let coin = monster.getAttr('coin')
            if(coin)
                this.gs_.addBagCoin(coin)

            let dropstr = monster.getAttr('drop')
            if(dropstr)
                dropConfig.dropToRole(this.gs_, dropstr)  
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
