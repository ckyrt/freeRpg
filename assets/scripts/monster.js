
// var global = require('global');
// var monster_configs = require('monster_config');

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // foo: {
//         //     // ATTRIBUTES:
//         //     default: null,        // The default value will be used only when the component attaching
//         //                           // to a node for the first time
//         //     type: cc.SpriteFrame, // optional, default is typeof default
//         //     serializable: true,   // optional, default is true
//         // },
//         // bar: {
//         //     get () {
//         //         return this._bar;
//         //     },
//         //     set (value) {
//         //         this._bar = value;
//         //     }
//         // },

//         monster_id:0,
//         uid:0,

//         attack:0,
//         defend:0,

//         hp:0,
//         max_hp:0,
//         cfg_name:"",
//         monster_:{
// 			default: null,
//             type: cc.Node,
// 		},

//         x:0,
//         y:0,

//         target_x:0,
//         target_y:0,
//         next_x:0,
//         mext_y:0,

//         move_path_:[],

//         last_attack_time_:0,    //上次攻击时间
//         attack_interval_:1000,  //攻击时间

//         main_node_:null,
//     },

//     // LIFE-CYCLE CALLBACKS:

//     // onLoad () {},

//     start () {
        
//     },

//     init(main_node, new_monster, uid, id, x, y, max_hp, hp, attack, defend, m_name, model)
//     {
//         console.log('monster init')
//         this.main_node_ = main_node
//         this.monster_ = new_monster
//         this.uid = uid

//         this.monster_id = id
//         this.attack = attack;
//         this.defend = defend;
//         this.max_hp = max_hp;
//         this.hp = hp;
//         this.cfg_name = m_name//monster_configs[id].monster_name;

//         var img = 'resources/img/monster/' + model;
//         //显示
//         this.monster_.getComponent( cc.Sprite ).spriteFrame = new cc.SpriteFrame(cc.url.raw(img));
//         this.monster_.getChildByName('name_label').getComponent(cc.Label).string = this.cfg_name

//         this.set_pos(x, y)
//         this.set_hp(hp)
//     },

//     set_pos(x,y){
//         this.x = x
//         this.y = y
//         //改变位置
//         this.monster_.setPosition(global.X_OFFSET + global.GRID_WIDTH*this.x, global.Y_OFFSET + global.GRID_HEIGHT*this.y)
//     },

//     set_target_pos(target_x,target_y){
        
//     },

//     set_hp(v){
//         this.hp = v
//         if(this.monster_)
//         {
//             this.monster_.getChildByName('hp_bg').getChildByName('hp').getComponent( cc.Sprite ).fillRange = this.hp / this.max_hp
//         }
//     },

//     set_max_hp(v){
//         this.max_hp = v
//     },

//     set_attack(v){
//         this.attack = v
//     },

//     set_defend(v){
//         this.defend = v
//     },

    

//     update (dt) 
//     {
//         if(this.move_path_.length > 0)
//         {
            
//         }
//     },
// });
