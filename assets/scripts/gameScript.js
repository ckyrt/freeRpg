// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var global = require('global')
global.gs_ = this
var npcFunc = require('npcFunc')
npcFunc.gs_ = this

var itemConfig = require('itemConfig')
var monsterConfig = require('monsterConfig')
var npcConfig = require('npcConfig')
var expConfig = require('expConfig')

var mapConfig = require('mapConfig')
var mapThingConfig = require('mapThingConfig')

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
        gm_bt:{
            default: null,
            type:cc.Button
        },

        gm_text:{
            default: null,
            type:cc.EditBox
        },

        //道具
        item_prefab:{
            type:cc.Prefab,
            default:null,
        },

        //role
        role_prefab:{
            type:cc.Prefab,
            default:null,
        },

        //npc
        npc_prefab:{
            type:cc.Prefab,
            default:null,
        },

        //商店界面
        shopPanel_prefab:{
            type:cc.Prefab,
            default:null,
        },

        //所有item
        items:{
            default:[],
        },

        //所有npc
        npcs:{
            default:[],
        },

        //所有role
        roles:{
            default:[],
        },
    },

    //选中按钮
    setCurItemScript:function(sc)
    {
        this.curItemScript_ = sc
    },

    onTouchEventEnd:function(t)
    {
        let RoleCamera = cc.find("Canvas/RoleCamera")

        console.log('map x:'+global.X_OFFSET)
        console.log('map y:'+global.Y_OFFSET)
        console.log('camera y:'+RoleCamera.x)
        console.log('camera y:'+RoleCamera.y)

        let worldPoint = t.getLocation()

        console.log('click x:'+worldPoint.y)
        console.log('click y:'+worldPoint.y)

        let mapX =  worldPoint.x  + RoleCamera.x- global.X_OFFSET //-359.892 - 16*22
        let mapY =  worldPoint.y  + RoleCamera.y- global.Y_OFFSET //-534.975 - 29*22

        let x = Math.floor(mapX / (global.GRID_WIDTH + global.spacing)) - 16
        let y = Math.floor(mapY / (global.GRID_HEIGHT + global.spacing)) - 38
        console.log("click: ("+x+","+y+")")

        if(this.curItemScript_ != null)
        {
            this.curItemScript_.addItemToPos(x, y)
            this.curItemScript_ = null
        }

        this.roles[0].moveTo(x,y)
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {

        this.curItemScript_ = null
        let mapBack = cc.find("Canvas/back/mapBack")

        mapBack.on(cc.Node.EventType.TOUCH_START,
            function(t){
                console.log("cc.Node.EventType.TOUCH_START ")
            
            },this)
        mapBack.on(cc.Node.EventType.TOUCH_MOVE,
            function(t){
                console.log("cc.Node.EventType.TOUCH_MOVE ")
            
            },this)
             
        mapBack.on(cc.Node.EventType.TOUCH_END,this.onTouchEventEnd, this)
             
        mapBack.on(cc.Node.EventType.TOUCH_CANCEL,
            function(t){
                console.log("cc.Node.EventType.TOUCH_CANCEL ")
            
            },this)

        //背包
        let bagBt = cc.find("Canvas/back/ui/bagBt")
        bagBt.on(cc.Node.EventType.TOUCH_START,
            function(t){
                let bag = cc.find("Canvas/back/ui/bag")
                bag.getComponent('bagScript').openBag()
            },this)

        //装备
        let roleEquipBt = cc.find("Canvas/back/ui/roleEquipBt")
        roleEquipBt.on(cc.Node.EventType.TOUCH_START,
            function(t){
                let roleEquip = cc.find("Canvas/back/ui/roleEquipInfo")
                roleEquip.getComponent('RoleEquipScript').openRoleEquip()
            },this)

        //角色
        let roleInfoBt = cc.find("Canvas/back/ui/roleInfoBt")
        roleInfoBt.on(cc.Node.EventType.TOUCH_START,
            function(t){
                let roleInfo = cc.find("Canvas/back/ui/roleInfo")
                roleInfo.getComponent('RoleInfoScript').openRoleInfo(this.roles[0])
            },this) 

        //刷怪
        let trainBt = cc.find("Canvas/back/ui/trainBt")
        trainBt.on(cc.Node.EventType.TOUCH_START,
            function(t){
                let panel = cc.find("Canvas/back/ui/trainPanel")
                panel.getComponent('trainPanelScript').openTrainPanel()
            },this)

        //气功
        let qigongBt = cc.find("Canvas/back/ui/qigongBt")
        qigongBt.on(cc.Node.EventType.TOUCH_START,
            function(t){
                let panel = cc.find("Canvas/back/ui/qigongPanel")
                panel.getComponent('qigongPanelScript').openQigongPanel()
            },this)

        let mapNode = cc.find("Canvas/back/Map")
        global.X_OFFSET = mapNode.x
        global.Y_OFFSET = mapNode.y

        this.gm_bt.node.on('click', function(e)
		{ 
            var str = this.gm_text.string;
            var cmds = str.split(" ");//分割
            var cmd0 = cmds[0]
            
            this._addTextInfo(str)

            if(cmd0 == "add_exp")
            {
                var count = Number(cmds[1]);
                //this.node.getComponent('role')._add_exp(count)
            }
            else if(cmd0 == "test")
            {
                //test
                this.schedule(function() {
                    var attrs = {
                        'hp':8,
                        'max_hp':8,
                        'camp':1,
                        'speed':50,
                        'imgSrc':'072-Bird02',
                        'eye_distance':20, 
                        'attack_dis':20,
                        'attackInterval':1000,
                        'bulletFlySpeed':4,
                        'endPosX':14,
                        'endPosY':45,
                        'attack':2,
                        'defend':0,
                    }
                    this.add_item(4,0, attrs)
                }, 1, 0, 0)
                // this.schedule(function() {
                //     var attrs = {
                //         'hp':10,
                //         'camp':1,
                //         'speed':50,
                //         'imgSrc':'003-Fighter03',
                //         'eye_distance':10, 
                //         'attack_dis':1,
                //         'attackInterval':1000,
                //         'bulletFlySpeed':2,
                //         'endPosX':14,
                //         'endPosY':45,
                //         'attack':2,
                //         'defend':0,
                //     }
                //     this.add_item(24,0, attrs)
                // }, 5, 999, 0)
        
                // this.schedule(function() {
                //     var attrs = {
                //         'hp':10,
                //         'camp':2,
                //         'speed':50,
                //         'imgSrc':'096-Monster10',
                //         'eye_distance':10, 
                //         'attack_dis':5,
                //         'attackInterval':1000,
                //         'bulletFlySpeed':2,
                //         'endPosX':14,
                //         'endPosY':0,
                //         'attack':2,
                //         'defend':0,
                //     }
                //     this.add_item(24,45, attrs)
                // }, 8, 999, 0)
                this.schedule(function() {
                    var attrs = {
                        'hp':40,
                        'max_hp':40,
                        'camp':2,
                        'speed':50,
                        'imgSrc':'104-Civilian04',
                        'eye_distance':10, 
                        'attack_dis':1,
                        'attackInterval':1000,
                        'bulletFlySpeed':2,
                        'endPosX':14,
                        'endPosY':0,
                        'attack':2,
                        'defend':0,
                    }
                    this.add_item(4,45, attrs)
                }, 1, 0, 0)
            
                // if(cmds[9] != null && cmds[10] != null)
                // {
                //     //定时器刷item
                //     var interval = Number(cmds[9])
                //     // 重复次数
                //     var repeat = Number(cmds[10])
                //     this.schedule(function() {
                //         this.add_item(x,y, attrs)
                //     }, interval, repeat, 0)
                // }
                // else
                // {
                //     this.add_item(x,y, attrs)
                // }
                
            }
            else if(cmd0 == "remove_item")
            {
                var uid = Number(cmds[1])
                this.remove_item(uid)
            }
            else if(cmd0 == "print_info")
            {
                var uid = Number(cmds[1])
                this.print_info(uid)
            }
            else if(cmd0 == "moveTo")
            {
                // var uid = Number(cmds[1])
                // var toX = Number(cmds[2])
                // var toY = Number(cmds[3])
                // this.moveTo(uid, toX, toY)
            }
            else if(cmd0 == "stopMove")
            {
                var uid = Number(cmds[1])
                this.stopMove(uid)
            }
            else if(cmd0 == "set_attr")
            {
                var uid = Number(cmds[1])
                var attr = cmds[2]
                var va = cmds[3]
                this.set_attr(uid, attr, va)
            }
            else if(cmd0 == "showDialog")
            {
                var str = cmds[1]
                this._showDialog(str)
            }
            else if(cmd0 == "closeDialog")
            {
                this._closeDialog()
            }


            else if(cmd0 == "del_monster")
            {
                var uid = Number(cmds[1]);
                //this.del_monster(uid);
            }
            else if(cmd0 == "set_hp")
            {
                var uid = Number(cmds[1]);
                var v = Number(cmds[2]);
                //this.set_hp(uid, v);
            }
            else if(cmd0 == "set_max_hp")
            {
                var uid = Number(cmds[1]);
                var v = Number(cmds[2]);
                //this.set_max_hp(uid, v);
            }
            else if(cmd0 == "set_at")
            {
                var uid = Number(cmds[1]);
                var v = Number(cmds[2]);
                //this.set_at(uid, v);
            }
            else if(cmd0 == "set_de")
            {
                var uid = Number(cmds[1]);
                var v = Number(cmds[2]);
                //this.set_de(uid, v);
            }
            else if(cmd0 == "move_monster")
            {
                var uid = Number(cmds[1]);
                var x = Number(cmds[2]);
                var y = Number(cmds[3]);

                //this.move_monster(uid, x, y);
            }
            else if(cmd0 == "attack")
            {
                var uid1 = Number(cmds[1]);
                var uid2 = Number(cmds[2]);

                //this.monster_attack(uid1, uid2);
            }

            this.gm_text.string = "";
            //this.node.getComponent('web_socket').send(str)

        }, this);
        
        this.node.on("AttrChangeSig", function (event) {
            let data = event.getUserData()
            data.uid
            data.attr
            data.old
            data.new
            let str = data.uid+"的"+data.attr+"属性从"+data.old+"变为"+data.new
            //this._addTextInfo(str)
        }, this);
    },

    start () {

        // var interval = 1;
        // // 重复次数
        // var repeat = 3000;
        // // 开始延时
        // var delay = 1;
        // this.schedule(function() {
            
        // }, interval, repeat, delay);

        //test
        {
            var attrs = {
                'hp':50,
                'max_hp':50,
                'camp':2,
                'speed':50,
                'imgSrc':'078-Devil04',
                'spriteWidth':32,
                'spriteHeight':48,
                'eye_distance':10, 
                'attack_dis':10,
                'attackInterval':300,
                'bulletFlySpeed':10,
                'endPosX':14,
                'endPosY':45,
                'attack':3,
                'defend':0,
            }
            //this.add_item(14, 46, attrs)
        }

        {
            var attrs = {
                'hp':20,
                'max_hp':20,
                'camp':2,
                'speed':50,
                'imgSrc':'056-Snake02',
                'spriteWidth':32,
                'spriteHeight':48,
                'eye_distance':10, 
                'attack_dis':10,
                'attackInterval':1000,
                'bulletFlySpeed':5,
                'endPosX':8,
                'endPosY':38,
                'attack':3,
                'defend':0,
            }
            //this.add_item(8, 39, attrs)
    
        }
        {
            var attrs = {
                'hp':20,
                'max_hp':20,
                'camp':2,
                'speed':50,
                'imgSrc':'066-Beast04',
                'spriteWidth':32,
                'spriteHeight':48,
                'eye_distance':10, 
                'attack_dis':1,
                'attackInterval':1000,
                'bulletFlySpeed':5,
                'endPosX':20,
                'endPosY':38,
                'attack':3,
                'defend':0,
            }
            //this.add_item(20, 39, attrs)
        }

        {
            var attrs = {               
                'imgSrc':'girl1',
                'spriteWidth':64,
                'spriteHeight':128,
                'speed':36,
                'isRole':1,
                'hp':50,
                'max_hp':50,
                'attack':5,
                'defend':0,
                'name':'碧瑶',
                'level':1,
                'exp':0,
            }
            let role = this.add_role(attrs)
            this.jumpMap(role, '地图1', 1, 1)
        }
        
    },

    _initMapThing:function(mapName)
    {
        let npcs = mapThingConfig[mapName].mapNpcs
        for(var i=0;i<npcs.length;i++)
        {
            let x = npcs[i][0]
            let y = npcs[i][1]
            let npcName = npcs[i][2]
            console.log(x)
            console.log(y)
            console.log(npcName)
            this.add_npc(mapName, x, y, npcConfig[npcName])
        }
    },

    jumpMap:function(role, mapName,x,y)
    {
        //清理npc
        this._clearNpcs()

        //跳到目标
        this.node.getComponent('AstarSearch').initMap(mapName)
        this._initMapThing(mapName)
        global.set_grid(x, y, role)
    },

    // update (dt) {},

    add_item:function(x, y, attrs)
    {
        var itemPreb = cc.instantiate(this.item_prefab)
        //console.log(itemPreb)
        this.node.addChild(itemPreb)
        var item  = itemPreb.getComponent("item")
        item.init(attrs)
        global.set_grid(x, y, item)

        this._add_item(item)
        return item
    },

    remove_item:function(uid)
    {
        var item = this._get_item(uid)
        if(item)
            this._remove_item(item)
    },

    add_npc:function(mapName, x, y, attrs)
    {
        var npcPreb = cc.instantiate(this.npc_prefab)
        //console.log(itemPreb)
        this.node.addChild(npcPreb)
        var npc  = npcPreb.getComponent("npc")
        npc.init(attrs)
        global.set_grid(x, y, npc)

        this._add_npc(npc)
        return npc
    },

    remove_npc:function(uid)
    {
        var item = this._get_npc(uid)
        if(item)
            this._remove_npc(item)
    },

    add_role:function(attrs)
    {
        var rolePreb = cc.instantiate(this.role_prefab)
        this.node.addChild(rolePreb)
        var role  = rolePreb.getComponent("role")
        role.init(attrs)
        
        this._add_role(role)
        return role
    },

    remove_role:function(uid)
    {
        var item = this._get_role(uid)
        if(item)
            this._remove_role(item)
    },

    move_to:function(uid, x,y)
    {

    },

    print_info: function(uid)
    {
        var ent = this._get_item(uid)
        if(!ent)
        {
            this._addTextInfo("未找到实体")
            return
        }
        var info = ent.get_info()
        this._addTextInfo(info)
    },

    moveTo: function(uid, toX, toY)
    {
        // var ent = this._get_item(uid)

        // var endNode = this.node.getComponent('AstarSearch').findPath(ent.x, ent.y, parseInt(toX), parseInt(toY))
        // if(!endNode)
        // {
        //     this._addTextInfo("can not find path")
        //     return    
        // }

        // //print
        // //this.node.getComponent('AstarSearch')._printPath(endNode)
        // //move path
        // ent.setMovePath(endNode)
    },

    stopMove: function(uid)
    {
        var ent = this._get_item(uid)
        if(!ent)
        {
            this._addTextInfo("未找到实体")
            return
        }
        ent.stopMove()
    },

    set_attr: function(uid, attr, va)
    {
        var ent = this._get_item(uid)
        if(!ent)
        {
            this._addTextInfo("未找到实体")
            return   
        }
        ent.setAttr(attr+"", va)
    },

    _showDialog: function(str, func1=null, func2=null, tx1='好的', tx2='算了')
    {
        console.log('showDialog '+str)
        var dialogNode = global.getChildByName(this.node, "dialog")
        dialogNode.getComponent('dialogScript').showDialog(str, func1, func2, tx1, tx2)
    },

    _closeDialog: function()
    {
        var dialogNode = global.getChildByName(this.node, "dialog")
        dialogNode.getComponent('dialogScript').closeDialog()
    },

    _addTextInfo: function(str)
    {
        this.node.getComponent('info_control').add_tip_item(">"+str)
    },
    
    _add_item:function(item)
    {
        item.uid = global.getUid()
        this.items.push(item)
        this._addTextInfo("实体id "+item.uid)
    },

    _remove_item:function(item)
    {
        var index = this.items.indexOf(item)
        this.items.splice(index,1)
        item.node.destroy()
    },

    _get_item:function(uid)
    {
        var item = this.items.find(function(ele){ 
            return ele.uid == uid
         }, uid)
         return item
    },

    /**npc */
    _add_npc:function(npc)
    {
        npc.uid = global.getUid()
        this.npcs.push(npc)
        this._addTextInfo("实体id "+npc.uid)
    },

    _remove_npc:function(npc)
    {
        var index = this.npcs.indexOf(npc)
        this.npcs.splice(index,1)
        npc.node.destroy()
    },

    _get_npc:function(uid)
    {
        var npc = this.npcs.find(function(ele){ 
            return ele.uid == uid
         }, uid)
         return npc
    },
    _clearNpcs:function()
    {
        for(var i=0;i<this.npcs.length;i++)
        {
            let npc = this.npcs[i]
            npc.node.destroy()
        }
        this.npcs=[]
    },
    /**npc */

    /**role */
    _add_role:function(role)
    {
        role.uid = global.getUid()
        this.roles.push(role)
        this._addTextInfo("实体id "+role.uid)
    },

    _remove_role:function(role)
    {
        var index = this.roles.indexOf(role)
        this.roles.splice(index,1)
        role.node.destroy()
    },

    _get_role:function(uid)
    {
        var role = this.roles.find(function(ele){ 
            return ele.uid == uid
         }, uid)
         return role
    },
    /**role */

    getTwoItemDistance: function(item1, item2)
    {
        if(item1 && item2)
        {
            return this.getPosDistance(item1.x, item1.y, item2.x, item2.y)
        }
        return 99999
    },

    getPosDistance: function(x1, y1, x2, y2)
    {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2)
    },

    getItemPosDistance: function(item, x, y)
    {
        return Math.abs(item.x - x) + Math.abs(item.y - y)
    },

    //得到距离最近的敌方阵营单位
    getMinDistanceOtherCampItem: function(item)
    {
        if(!item)
            return null

        let minDistance = 99999
        let nearestOtherCampItem = null

        let j=0
        let len = 0
        let ele = null
        let distance = 0
        for(j = 0,len=this.items.length; j < len; j++) {
            ele = this.items[j]

            if(item.uid == ele.uid)
                continue
            
            distance = this.getTwoItemDistance(ele, item)
            if(distance < minDistance && item.getAttr('camp') != ele.getAttr('camp'))
            {
                minDistance = distance
                nearestOtherCampItem = ele
            }
        }
        return nearestOtherCampItem
    },

    //得到R半径范围内的所有敌方单位
    getOtherCampItemsInRadius: function(x, y, targetCamp, ownCamp, radius)
    {
        let retItems = []

        let j=0
        let len = 0
        let ele = null
        let distance = 0
        for(j = 0,len=this.items.length; j < len; j++) {
            ele = this.items[j]

            if(targetCamp > 0)
            {
                //取目标camp
                if(ele.getAttr('camp') != targetCamp)
                    continue
            }

            if(ownCamp > 0)
            {
                //取非 ownCamp camp
                if(ele.getAttr('camp') == ownCamp)
                    continue
            }
            
            distance = this.getItemPosDistance(ele, x, y)
            if(distance <= radius)
            {
                retItems.push(ele)
            }
        }

        return retItems
    },

    //得到R半径所有非自己单位
    getRolesInRadius: function(x, y, exceptItem, radius)
    {
        let retItems = []

        let j=0
        let len = 0
        let ele = null
        let distance = 0
        for(j = 0,len=this.roles.length; j < len; j++) {
            ele = this.roles[j]

            if(exceptItem.uid == ele.uid)
                continue
            
            distance = this.getItemPosDistance(ele, x, y)
            if(distance <= radius)
            {
                retItems.push(ele)
            }
        }

        return retItems
    },

    //发射子弹
    fireBullet: function(fromItem, targetItem)
    {
        var bulletPreb = cc.instantiate(fromItem.bullet_prefab)
        this.node.addChild(bulletPreb)
        var bulletScript  = bulletPreb.getComponent("bulletScript")
        let bulletSpeed = fromItem.getAttr('bulletFlySpeed')

        bulletScript.init(fromItem, targetItem, bulletSpeed)
    },

    //释放伤害
    castHurtToEnemy: function(ele1, ele2)
    {
        if(ele1 == null)
        {
            return
        }
        let hurt = ele1.getAttr('attack') - ele2.getAttr('defend')
        this.castHurtNumberToEnemy(ele2, hurt)
    },

    //圆形范围伤害
    castHurtNumberToCircle: function(radius, targetCamp, ownCamp, hurtNumber, x, y)
    {
        //范围内所有单位造成一下伤害
        let retItems = this.getOtherCampItemsInRadius(x, y, targetCamp, ownCamp, radius)

        console.log("bomb: retItems"+retItems)

        let j=0
        let len = 0
        let ele = null
        for(j = 0,len=retItems.length; j < len; j++) {
            ele = retItems[j]
            this.castHurtNumberToEnemy(ele, hurtNumber)
        }
    },

    //释放直接数字伤害
    castHurtNumberToEnemy: function(ele2, hurt)
    {
        if(ele2 == null)
        {
            return
        }

        if(hurt < 1)
            hurt = 1

        let curHp = ele2.getAttr('hp')
        if(hurt > curHp)
            curHp = 0
        else
            curHp -= hurt
        ele2.setAttr('hp', curHp)
        //死亡
        if(curHp == 0)
        {
            this._unitDie(ele2)
        }
    },

    //单位死亡
    _unitDie: function(ele)
    {
        //从地图消失
        this.remove_item(ele.uid)
    },

    //敌方踩上炸弹
    effectBomb:function(x, y, mineItem)
    {
        let radius = mineItem.getAttr('mineRadius')
        let mineHurt = mineItem.getAttr('mineHurt')

        //非自己阵营
        let targetCamp = 1
        let ownCamp = -1//mineItem.getAttr('camp')
        //触发爆炸
        this.castHurtNumberToCircle(radius, targetCamp, ownCamp, mineHurt, x, y)

        //删掉地雷
        this.remove_item(mineItem.uid)
    },



    //背包添加道具
    addBagItem:function(itemAttrs)
    {
        let bag = cc.find("Canvas/back/ui/bag")
        let bagScript = bag.getComponent('bagScript')
        bagScript.add_bag_item(itemAttrs)

        this._addTextInfo('获得 '+ itemAttrs.name)
    },
    //添加铜钱
    addBagCoin:function(num)
    {
        let bag = cc.find("Canvas/back/ui/bag")
        let bagScript = bag.getComponent('bagScript')
        let ret = bagScript.addCoin(num)
        if(ret == 'success')
        {
            let str = num>0?'获得':'扣除'
            this._addTextInfo( str+' 铜钱 '+ num)
        }
        else
        {
            this._addTextInfo('铜钱不足')
        }
        return ret
    },
    //添加经验
    addRoleExp:function(num)
    {
        let role = this.roles[0]
        let curExp = role.getAttr('exp')
        curExp += num
        let curLevel = role.getAttr('level')

        let ret = expConfig.updateExp(curExp, curLevel)

        role.setAttr('exp', ret.exp)
        role.setAttr('level', ret.level)
        this._addTextInfo('获得 经验 '+ num)

        if(curLevel != ret.level)
        {
            this._addTextInfo('恭喜升级！到达 '+ ret.level + ' 级')
        }
    },

    //打开商店界面
    openShopPanel:function(itemNames)
    {
        var prefab = cc.instantiate(this.shopPanel_prefab)
        this.node.addChild(prefab)
        prefab.setPosition(0,0)
        this.shopPanel_  = prefab.getComponent("shopPanelScript")
        this.shopPanel_.showShopItems(itemNames)
    },

    //关闭商店界面
    closeShopPanel:function()
    {
        this.shopPanel_.closeShopPanel()
        this.shopPanel_ = null
    }
});
