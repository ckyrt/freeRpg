// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

        grid: cc.Node,

        w_:0,
        h_:0,

        // grids_:{
        //     default:[],
        // },
        grids_:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        this.grids_ = new Map()
        let lastPos

        let root = cc.find("Canvas/root")
        let map = cc.find("Canvas/root/map")
        map.on(cc.Node.EventType.TOUCH_MOVE,
            function(t){
                console.log("map move ")
            
                let worldPoint = t.getLocation()

                let deltX = worldPoint.x - lastPos.x
                let deltY = worldPoint.y - lastPos.y

                lastPos = worldPoint

                let rootPos = root.getPosition()
                root.setPosition(rootPos.x + deltX,rootPos.y + deltY)
            },this)

        
        map.on(cc.Node.EventType.TOUCH_START,
            function(t){
                console.log("cc.Node.EventType.TOUCH_START ")
                lastPos = t.getLocation()
            },this)

        map.on(cc.Node.EventType.TOUCH_END,
            function(t){
                console.log("cc.Node.EventType.TOUCH_END ")
            
            }, this)

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, 
            function (event) {
                switch(event.keyCode) {
                    case cc.macro.KEY.a:
                        this.a_down_ = true
                        break;
                    case cc.macro.KEY.s:
                        this.s_down_ = true
                        break;
                }
            }, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, 
            function (event) {
                switch(event.keyCode) {
                    case cc.macro.KEY.a:
                        this.a_down_ = false
                        break;
                    case cc.macro.KEY.s:
                        this.s_down_ = false
                        break;
                }
            }, this);

        //布局grid
        let mapW = map.width
        let mapH = map.height
        let w = this.grid.width
        let h = this.grid.height
        console.log(mapW)
        console.log(mapH)
        console.log(w)
        console.log(h)
        let startX = 0
        let startY = 0
        let color
        map.setPosition(-mapW/2,-mapH/2)
        for(var i =0;i<this.w_;++i)
        {
            for(var j =0;j<this.h_;++j)
            {
                let g = cc.instantiate(this.grid)
                g.parent = map
                g.setPosition(i * (w + 2), j * (h + 2)) 
                color = new cc.Color(255, 0, 0)
                g.opacity = 90
                g.color = color;
                g.getComponent('gridScript').setIJ(i, j)

                g.on(cc.Node.EventType.MOUSE_ENTER , function (event) {

                    if(this.s_down_)
                    {
                        console.log('1')
                        //刷地图
                        g.color = new cc.Color(255, 0, 0)
                        g.opacity = 90
                        g.getComponent('gridScript').setData(1)
                        return
                    }
                    if(this.a_down_)
                    {
                        console.log('0')
                        //刷地图
                        g.color = new cc.Color(255, 255, 0)
                        g.opacity = 90
                        g.getComponent('gridScript').setData(0)
                        return
                    }
                }, this)

                //this.grids_.push(g)
                this.grids_.set(i*1000+j,g)
            }
        }

        //保存
        let saveBt = cc.find("Canvas/root/save")
        saveBt.on(cc.Node.EventType.TOUCH_START,
            function(t){
                console.log('save')
                this.saveData()
            },this)
    },

    saveData:function()
    {
        var a = new Array();

            for(var i=0;i<this.w_;i++){

                a[i] = new Array()

                for(var j=0;j<this.h_;j++){

                    a[i][j] = this.getGrid(i,j).getComponent('gridScript').getData()
                }
            }   

        this.saveForBrowser(this.arrayToStr(a), 'data.txt')
    },

    arrayToStr:function(a)
    {
        let str = '[\n'

        for(var i=0;i<this.w_;i++){

            str +='['

            for(var j=0;j<this.h_;j++){

                str += a[i][j]
                if(j != this.h_-1)
                {
                    str += ','
                }
            }

            str += '],\n'
        }
        str += ']\n'

        return str
    },

    getGrid:function(i,j)
    {
        return this.grids_.get(i*1000+j)
        // var g = this.grids_.find(function(ele){ 
        //     return ele.i_ == i && ele.j_ == j
        //  }, uid)
        //  return g
    },

    loadData:function()
    {

    },

    // 保存字符串内容到文件。
    // 效果相当于从浏览器下载了一个文件到本地。
    // textToWrite - 要保存的文件内容
    // fileNameToSaveAs - 要保存的文件名
    saveForBrowser(textToWrite, fileNameToSaveAs) {
        if (cc.sys.isBrowser) {
            console.log("浏览器");
            let textFileAsBlob = new Blob([textToWrite], {type:'application/json'});
            let downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null)
            {
                // Chrome allows the link to be clicked
                // without actually adding it to the DOM.
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            else
            {
                // Firefox requires the link to be added to the DOM
                // before it can be clicked.
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
            downloadLink.click();
        }
    },

    // update (dt) {},
});
