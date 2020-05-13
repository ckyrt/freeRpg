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

        let back = cc.find("Canvas/back");
        this.gs_ = back.getComponent('gameScript')
        this.item_ = this.node.getComponent('item')

        var interval = 1;
        // 重复次数
        var repeat = 3000;
        // 开始延时
        var delay = 1;
        this.schedule(function() {
            this._update1000()
        }, 1, repeat, delay)

        this.schedule(function() {
            this._update500()
        }, 0.5, repeat, delay)
    },

    // update (dt) {},

    _update1000: function()
    { 
        // if(this.state_ == global.ATTACK_STATE)
        // {
            
        //     let enemy = this._getEnemy()
        //     if(enemy)
        //     {
                
        //         console.log(this.item_.uid+" attack "+ enemy.uid)

        //         var attack_dis = this.item_.getAttr('attack_dis')

        //         var enemy_dis = this.gs_.getTwoItemDistance(this.item_, enemy)
        //         if( enemy_dis > attack_dis)
        //         {
        //             return
        //         }

        //         if(attack_dis > 1 )
        //         {
        //             //远程 则发射子弹
        //             this.gs_.fireBullet(this.item_, enemy)
        //         }
        //         else
        //         {
        //             //近战 直接伤害
        //             this.gs_.castHurtToEnemy(this.item_, enemy)
        //         }
        //     }
        //     else
        //     {
        //         this.state_ = global.PEACE_STATE
        //     }
        // } 
    },

    _update500: function()
    {
        //console.log("_update500")        
        // let enemy = this._getEnemy()
        // if(!enemy)
        // {
        //     this._searchEnemyAndMove()
        // }
    },

    //新到达节点
    _onArrivedNewGrid: function(x, y)
    {
        //this._searchEnemyAndMove()
    },

    //寻找敌人 并向它移动攻击
    _searchEnemyAndMove: function()
    {
        // let enemy = this._searchEnemy()
        // if(!enemy)
        // {
        //     return
        // }
    
        // console.log('distance'+ this.gs_.getTwoItemDistance(this.item_, enemy))

        // var attack_dis = this.item_.getAttr('attack_dis')

        // //每到一个新格子 重新寻路
        // if(this.gs_.getTwoItemDistance(this.item_, enemy) > attack_dis)
        // {
        //     //超过攻击范围 前往
        //     this.gs_.moveTo(this.item_.uid, enemy.x, enemy.y)
        // }
        // else
        // {
        //     //停止
        //     this.item_.stopMove()
        //     this.state_ = global.ATTACK_STATE
        // }
    },

    

    //当前的敌人
    _getEnemy: function()
    {
        // let enemyId = this.item_.getAttr('enemy')
        // return this.gs_._get_item(enemyId)
    },

    _setEnemyId: function(uid)
    {
        // this.item_.setAttr('enemy', uid)
    },

});
