
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
        x:0,
        y:0,
        uid:0,

        //

        targetList:[],
        // resource_sprite:{
        //     default : null,
        //     type : cc.SpriteFrame,
        // },

        bullet_prefab:{
            type:cc.Prefab,
            default:null,
        },

        curState: global.STATE_PREPARE_MOVE, //状态机
        
        waitThinkTime:1, //静止状态后思考时间
        
        loadOver:false, //加载完成
    },

    changeState:function(state)
    {
        var testDate = new Date();
        this.setAttr('enterStateTime', testDate.getTime())
        this.curState = state
        //console.log('changeState:'+state)
    },

    //视野范围内找一个敌人
    _searchEnemy: function()
    {
        let ene = this.gs_.getMinDistanceOtherCampItem(this)
        if(!ene)
            return null
        if(this.gs_.getTwoItemDistance(this, ene) > this.getAttr('eye_distance'))
            return null
        if(ene.getAttr('mineRadius') > 0)
        {
            //说明它是一个地雷 应该看不到
            return null
        }
        this.setAttr('enemy', ene.uid)
        return ene
    },

    //得到当前敌人
    _getCurEnemy: function()
    {
        let enemyId = this.getAttr('enemy')
        return this.gs_._get_item(enemyId)
    },

    update:function(dt)
    {
        if(!this.loadOver)
            return

        this.mineUpdate()

        var testDate = new Date()
        let now = testDate.getTime()
        let curState = this.curState
        if(curState == global.STATE_EXECUTE_MOVE)
        {
            let x = this.getAttr('nextX')
            let y = this.getAttr('nextY')
            //检测到达
            if(global._checkArrived(x, y, this))
            {
                //到达 修正
                global.set_grid(x, y, this)
                this.changeState(global.STATE_SEARCH_ENEMY)
            }
            else
            {
                //实施移动
                global._execMove(dt, x, y, this)
            }
        }
        else if(curState == global.STATE_SEARCH_ENEMY)
        {
            //搜索敌人状态
            var enemy = this._getCurEnemy()
            if(enemy == null)
            {
                enemy = this._searchEnemy()
            }
            if(enemy == null)
            {
                //视野内没有敌人 尝试移动
                this.changeState(global.STATE_PREPARE_MOVE)
            }
            else
            {
                //锁定敌人 发起进攻
                this.changeState(global.STATE_ATTACK)
            }
        }
        else if(curState == global.STATE_PREPARE_MOVE)
        {
            if(this.getAttr('speed') < 1)
                return
            //决策移动
            var enemy = this._getCurEnemy()
            var node = null
            if(enemy != null)
            {
                //有敌人的移动
                node = global._findPathAndGetNextPoint(this, enemy.x, enemy.y)
            }
            else
            {
                //没敌人的移动
                node = global._findPathAndGetNextPoint(this, this.getAttr('endPosX'), this.getAttr('endPosY'))
            }

            if(node == null)
            {
                //无路可走
                this.changeState(global.STATE_SEARCH_ENEMY)
            }
            else
            {
                this.changeState(global.STATE_EXECUTE_MOVE)
            }
        }
        else if(curState == global.STATE_ATTACK)
        {
            var attack_dis = this.getAttr('attack_dis')
            var eye_dis = this.getAttr('eye_distance')
            var enemy = this._getCurEnemy()
            if(enemy == null)
            {
                //敌人没了 重新搜索吧
                this.changeState(global.STATE_SEARCH_ENEMY)
                return
            }

            if(this.gs_.getTwoItemDistance(this, enemy) > eye_dis)
            {
                //超过视野范围 忘掉它
                this.setAttr('enemy', 0)
                return
            }

            if(this.gs_.getTwoItemDistance(this, enemy) > attack_dis)
            {
                //超过攻击范围 决策移动
                this.changeState(global.STATE_PREPARE_MOVE)
                return
            }
            
            //攻击间隔
            if(now - this.getAttr('lastAttackTime') > this.getAttr('attackInterval') && this.getAttr('attackInterval') != 0)
            {
                console.log(this.uid+" attack")
                //播放攻击特效
                {
                    this.particle_.resetSystem()
                }

                if(attack_dis > 1 )
                {
                    //远程 则发射子弹
                    this.gs_.fireBullet(this, enemy)
                }
                else
                {
                    //近战 直接伤害
                    this.gs_.castHurtToEnemy(this, enemy)
                }

                this.setAttr('lastAttackTime', now)
            }
        }
        
    },

    //作为地雷的更新
    mineUpdate(){
        let mineR = this.getAttr('mineRadius')
        //不是地雷
        if(mineR == null)
            return
        
        let x = this.x
        let y = this.y
        let targetCamp = -1
        let ownCamp = this.getAttr('camp')
        let radius = 0
        
        let retItems = this.gs_.getOtherCampItemsInRadius(x, y, targetCamp, ownCamp, radius)

        //格子上面有其他阵营的人 那么就触发
        if(retItems.length > 0)
            this.gs_.effectBomb(x, y, this)
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled=true;
     //   cc.director.getCollisionManager().enabledDrawBoundingBox = true;
     //开启绘制区域
       //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    start () {

        let back = cc.find("Canvas/back");
        this.gs_ = back.getComponent('gameScript')
        global.gs_ = this.gs_

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

        //图片切换帧序号
        this.frameNumber_ = 0
        //图片切换时间间隔
        this.spriteChangeTime_ = 0

        var sp = this.node.getComponent(cc.Sprite);//获取组件
        sp.spriteFrame = global._getWalkSprite(global.DIR_D, this);//更改图片

        this.node.width = this.getAttr('spriteWidth')
        this.node.height = this.getAttr('spriteHeight')
        this.node.getChildByName('hp').y = this.node.height + 10
        
        this.particle_ = this.node.getChildByName("particle").getComponent(cc.ParticleSystem)
        this.particle_.stopSystem()
    },

    init(attrs)
    {
        this.allAttrs = JSON.parse(JSON.stringify(attrs)) //attrs//深拷贝

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
            self.loadOver = true
　　　　})
    },

    setEndXY: function(x,y)
    {
        //初始化目的地
        this.setAttr('endPosX', x)
        this.setAttr('endPosX', y)
    },

    get_info: function()
    {
        var attString = ""
        for(var key in this.allAttrs){
            attString += key+":"
            attString += array[key]+","
        }   
        return " uid: "+this.uid+";"+
                " pos: "+this.x+","+ this.y+";"+
                " atts: "+attString+";"

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

        //hp ui显示
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

    // update (dt) 
    // {
    //     if(this.curState == 0)
    //     {
    //         //静止状态 1秒后进入寻路

    //     }

    //     let sp = this.getAttr('speed')
    //     if(sp > 0)
    //         this._updateMove(dt)
    // },

    //移动更新
    _updateMove: function(dt)
    {
        // let grid = this._getNextGrid()
        // if(!grid)
        // {
        //     //没有目标了 就往终点走
        //     this.gs_.moveTo(this.uid, this.getAttr('endPosX'), this.getAttr('endPosY'))
        //     return
        // }

        // global._execMove(dt, grid.col, grid.row, this)
    },

    _update1000:function()
    {
    },

    _update500:function()
    {
        var bornTime = this.getAttr('bornTime')
        if(bornTime == null)
        {
            var testDate = new Date()
            let now = testDate.getTime()
            this.setAttr('bornTime', now)
            return
        }

        
        var lifeTime = this.getAttr('lifeTime')
        if(lifeTime != null)
        {
            var testDate = new Date()
            let now = testDate.getTime()
            if(now - bornTime > lifeTime)
            {
                //如果生命周期到了 那么就移除
                this.gs_.remove_item(this.uid)
            }
        }
    },

    //按照路徑 移动
    setMovePath:function(currentNode)
    {
        this.targetList = []
        while(currentNode)
        {
            this.targetList.push(currentNode)
            currentNode = currentNode.parent;
        }
        this.targetList.reverse()
        this.targetList.splice(0,1)
    },

    _getNextGrid: function()
    {
        // if(this.targetList.length > 0)
        // {
        //     let head = this.targetList[0]
        //     if(global._checkArrived(head.col, head.row, this))
        //     {
        //         //修正
        //         this.set_grid(head.col, head.row)
        //         this.targetList.shift()

        //         this._onArrivedNewGrid(head.col, head.row)
        //     }
        //     return head
        // }
        // return null
    },

    //新到达节点
    _onArrivedNewGrid: function(x, y)
    {
        console.log('_onArrivedNewGrid')
        this.node.getComponent('attackScript')._onArrivedNewGrid(x,y)
    },

    stopMove: function()
    {
        //到达格子中心 然后就不要动了
        let len = this.targetList.length
        if(len > 0)
            this.targetList.splice(1, len-1)
    },

    //是否有移动的目标
    // hasMoveTarget: function()
    // {
    //     let grid = this._getNextGrid()
    //     if(grid)
    //         return true
    //     return false
    // },
});
