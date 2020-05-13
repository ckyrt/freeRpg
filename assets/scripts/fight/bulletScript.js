// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

    onLoad () {
        cc.director.getCollisionManager().enabled=true;
     //   cc.director.getCollisionManager().enabledDrawBoundingBox = true;
     //开启绘制区域
       //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    init(fromItem, targetItem, speed){
        //目标
        this.target = targetItem
        //速度
        this.speed = speed
        //初始子弹位置
        //console.log(fromItem.node.x+","+fromItem.node.y)
        //cc.log(fromItem.node)
        this.node.setPosition(fromItem.node.x, fromItem.node.y+fromItem.node.height)

        let back = cc.find("Canvas/back");
        this.gs_ = back.getComponent('gameScript')
        this.ownerItem_ = fromItem
    },

    start () {

    },

    update (dt) {
        if(this.target.node != null)
        {
            this.Genzong(cc.v2(this.target.node.x, this.target.node.y+this.target.node.height/2));
        }
        else
        {
            //敌人没了 清掉
            this.node.destroy()
        }
    },

    Genzong(targetPoint){
        var point = cc.v2(this.node.x, this.node.y);
        var delta = targetPoint.sub(point);
        var distance = point.sub(targetPoint).mag();
        var x2 = point.x + this.speed * delta.x / distance;
        var y2 = point.y + this.speed * delta.y / distance;
        var newPosition = cc.v2(x2, y2);
        var x1 = point.x;
        var y1 = point.y;
        var deltaRotation = 90 -Math.atan2(y2 - y1, x2 - x1) * 180 /Math.PI;
        this.node.rotation=deltaRotation;
        if(distance<=10){
            return true;
        }
        
        this.node.setPosition(newPosition);//设置跟踪导弹的位置
    },

    onCollisionEnter:function(other,self){              //碰撞则播放爆炸动画
        
        if(other.node.group == 'item') //检测碰撞组
        {   
            if(other.node.getComponent('item').uid == this.target.uid)
            {
                //被攻击者特效
                this.gs_.castHurtToEnemy(this.ownerItem_, this.target)
                this.node.destroy()
            }
            //other.node.removeFromParent();
            // this.hp -= 1;
            // if(this.hp == 0 )
            // {
            //   //  enemyReq.add_Score();
            //      this.node.group = 'default'; //防止播放爆炸动画时继续检测导致神奇的事情发生
            //      var en = this.node.getComponent(cc.Animation);
            //      var na = this.node.name;
            //     en.play(na+"_des"); //播放动画
            //      en.on('finished',function(e){
            //             this.node.removeFromParent();
            //            // var score = this.node.getComponent(cc.Label);   
            //      },this); 
            // }
        }
    },
});
