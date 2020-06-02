var global = {
    gs_:null,

    X_OFFSET:0,
    Y_OFFSET:0,
    GRID_WIDTH:20,
    GRID_HEIGHT:15,
    spacing:2,

    UID: 0,
    getUid:function()
    {
        this.UID+=1
        return this.UID
    },

    getChildByName: function(ele, name) {
        if (ele.name === name) {
            // 先访问根节点, 若找到则返回该节点
            return ele;
        }
 
        // 否则按从左到右的顺序遍历根节点的每一棵子树
        for (let i = 0; i < ele.children.length; i++) {
            if(this.getChildByName(ele.children[i], name)) {
                // 若找到则返回该节点
                return this.getChildByName(ele.children[i], name);
            };
        }
 
        // 找不到返回 null
        return null;
    },

    gameMgr: function(ele)
    {
        return null
    },

    DIR_NONE:0,
    DIR_L:1,
    DIR_LU:2,
    DIR_U:3,
    DIR_RU:4,
    DIR_R:5,
    DIR_RD:6,
    DIR_D:7,
    DIR_LD:8,


    
    STATE_EXECUTE_MOVE:1,       //实施移动
    STATE_ATTACK:2,             //战斗
    STATE_SEARCH_ENEMY:3,       //搜索敌人状态
    STATE_PREPARE_MOVE:5,       //决策移动
    
    
    //A* 寻路，得到前往目标的 下一个位置
    _findPathAndGetNextPoint:function(item, targetX, targetY)
    {
        //a* 寻路
        var endNode = this.gs_.getComponent('AstarSearch').findPath(item.x, item.y, targetX, targetY)
        if(!endNode)
        {
            this.gs_._addTextInfo("can not find path")
            return null
        }
        //找接下来的位置
        var nextNode =  this._getNextPoint(endNode,item)
        if(nextNode != null)
        { 
            //下一步位置
            item.setAttr('nextX',nextNode.x)
            item.setAttr('nextY',nextNode.y)

            //console.log('nextX: '+nextNode.x)
            //console.log('nextY: '+nextNode.y)
        }

        return nextNode
    },

    //得到A*寻路的下一格
    _getNextPoint:function(endNode,item)
    {
        while(endNode)
        {
            if(endNode.parent != null)
            {
                let x = endNode.parent.col
                let y = endNode.parent.row
                if(x == item.x && y == item.y)
                {
                    //说明endNode 就是下一步
                    return {x:endNode.col, y:endNode.row};
                }
            }
            endNode = endNode.parent;
        }
        return null
    },
    
    _checkArrivedX:function(x, item)
    {
        var pixX = global.X_OFFSET + (global.GRID_WIDTH+global.spacing) * x - this.gs_.node.x
        if(Math.abs(item.node.x-pixX )<3)
        {
            return true
        }
        return false
    },

    _checkArrivedY:function(y, item)
    {
        var pixY = global.Y_OFFSET + (global.GRID_HEIGHT+global.spacing) * y - this.gs_.node.y
        if(Math.abs(item.node.y-pixY )<3)
        {
            return true
        }
        return false
    },

    _checkArrived: function(x, y, item)
    {

        //console.log('gs node xy '+this.gs_.node.x+','+this.gs_.node.y)

        if(item.x != x)
            return this._checkArrivedX(x, item)
        if(item.y != y)
            return this._checkArrivedY(y, item)
        return true
    },

    set_grid(x,y, item){
        if(x == item.x && y == item.y)
            return
        item.x = x
        item.y = y
        item.node.setPosition(global.X_OFFSET + (global.GRID_WIDTH+global.spacing) *item.x, global.Y_OFFSET + (global.GRID_HEIGHT+global.spacing)*item.y)

        //role更新坐标文字
        if(item.getAttr('isRole') != null)
        {
            let posText = cc.find("Canvas/back/ui/posInfo/pos")
            posText.getComponent(cc.Label).string = '['+x+' , '+y+']'

            let mapNameText = cc.find("Canvas/back/ui/posInfo/mapName")
            if(this.gs_)
                mapNameText.getComponent(cc.Label).string = this.gs_.node.getComponent('AstarSearch').curMapName
        }

        item.setAttr('nextX', x)
        item.setAttr('nextY', y)
    },

    //实施移动
    _execMove:function(dt, targetX, targetY, item)
    {
        var dir = global._getDir(targetX, targetY, item)
        
        //console.log('item.spriteChangeTime_:'+item.spriteChangeTime_)
        item.spriteChangeTime_ += dt
        if(item.spriteChangeTime_ > 0.3)
        {
            var sp = item.node.getComponent(cc.Sprite);//获取组件
            var ws = global._getWalkSprite(dir, item)
            if(ws != null)
                sp.spriteFrame = ws;//更改图片
                item.spriteChangeTime_ = 0
        }

        var dist = item.getAttr('speed')*dt

        let isRole = false
        // if(item.getAttr('isRole') != null)
        // {
        //     isRole = true
        // }
        let moveNode = isRole? this.gs_.node: item.node
        //dist = isRole? dist*-1: dist
        switch(dir) {
            case global.DIR_L:
                moveNode.x -= dist
               break;
            case global.DIR_LU:
                moveNode.x -= dist
                moveNode.y += dist
               break;
            case global.DIR_U:
                moveNode.y += dist
               break;
            case global.DIR_RU:
                moveNode.x += dist
                moveNode.y += dist
               break;
            case global.DIR_R:
                moveNode.x += dist
               break;
            case global.DIR_RD:
                moveNode.x += dist
                moveNode.y -= dist
               break;
            case global.DIR_D:
                moveNode.y -= dist
               break;
            case global.DIR_LD:
                moveNode.x -= dist
                moveNode.y -= dist
               break;
            default:
       } 
        
    },

    _getDir: function(targetX, targetY, item)
    {
        if(targetX > item.x)
        {
            if(targetY > item.y)
            {
                return this.DIR_RU
            }
            else if(targetY == item.y)
            {
                return this.DIR_R
            }
            else if(targetY < item.y)
            {
                return this.DIR_RD
            }
        }
        else if(targetX == item.x)
        {
            if(targetY > item.y)
            {
                return this.DIR_U
            }
            else if(targetY == item.y)
            {
                return this.DIR_NONE
            }
            else if(targetY < item.y)
            {
                return this.DIR_D
            }
        }
        else if(targetX < item.x)
        {
            if(targetY > item.y)
            {
                return this.DIR_LU
            }
            else if(targetY == item.y)
            {
                return this.DIR_L
            }
            else if(targetY < item.y)
            {
                return this.DIR_LD
            }
        }
    },

    _getWalkSprite: function(dir, item)
    {
        console.log('dir:'+dir)
        item.frameNumber_ += 1
        if(item.frameNumber_ > 7)
            item.frameNumber_ = 0

        var sprite
        if(dir == global.DIR_L)
        {
            sprite = this._getSprite(item.frameNumber_, 0, item)
        }
        else if(dir == global.DIR_LU)
        {
            sprite = this._getSprite(item.frameNumber_, 1, item)
        }
        else if(dir == global.DIR_U)
        {
            sprite = this._getSprite(item.frameNumber_, 2, item)
        }
        else if(dir == global.DIR_RU)
        {
            sprite = this._getSprite(item.frameNumber_, 3, item)
        }
        else if(dir == global.DIR_R)
        {
            sprite = this._getSprite(item.frameNumber_, 4, item)
        }
        else if(dir == global.DIR_RD)
        {
            sprite = this._getSprite(item.frameNumber_, 5, item)
        }
        else if(dir == global.DIR_D)
        {
            sprite = this._getSprite(item.frameNumber_, 6, item)
        }
        else if(dir == global.DIR_LD)
        {
            sprite = this._getSprite(item.frameNumber_, 7, item)
        }
        return sprite
    },

    //获取移动贴图
    _getSprite: function(i, j, item)
    {
        if(item.resource_sprite == null)
           return
        var sprite = item.resource_sprite.clone(); // 克隆一张图片
        var width = sprite.getRect().width/8;
        var height = sprite.getRect().height/8;
        var x = sprite.getRect().x + i * width;
        var y = sprite.getRect().y + j * height;

        sprite.setRect(new cc.Rect(x,y,width,height));
        sprite.setRect(new cc.Rect(x+i*10,y+j*5,40,90))
        return sprite
    },

    //获取默认贴图
    getDefaultSprit: function(item)
    {
        if(item.resource_sprite == null)
           return
        var sprite = item.resource_sprite.clone(); // 克隆一张图片
        var width = sprite.getRect().width/4;
        var height = sprite.getRect().height/4;
        var x = sprite.getRect().x
        var y = sprite.getRect().y
        var tmpRect = new cc.Rect(x,y,width,height);
        sprite.setRect(tmpRect);
        return sprite
    },

    //随机数
    random:function(lower, upper) 
    {
        return Math.round(Math.random()*(upper-lower)+lower)         
    },
}

module.exports = global;



/*








*/