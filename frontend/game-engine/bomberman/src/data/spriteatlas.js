export const SpriteAtlas = {
    maping: {
        // "World1": {
        //     // image:"./assets/image/atlas/world/world1-32x32.png",
        //     image: "../frontend/game-engine/bomberman/assets/image/atlas/world/world1.png",
        //     height: 48,
        //     width: 48,
        //     spriteSize: 16
        // },
        "World1":{
            image: "../frontend/game-engine/bomberman/assets/image/atlas/world/world1-64x64.png",
            height:128,
            width:192,
            spriteSize:64
        },
        // "World1":{
        //     image:"./assets/image/atlas/world/world1.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World2":{
        //     image:"./assets/image/atlas/world/world2.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World3":{
        //     image:"./assets/image/atlas/world/world3.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World4":{
        //     image:"./assets/image/atlas/world/world4.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World5":{
        //     image:"./assets/image/atlas/world/world5.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World6":{
        //     image:"./assets/image/atlas/world/world6.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World7":{
        //     image:"./assets/image/atlas/world/world7.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World8":{
        //     image:"./assets/image/atlas/world/world8.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World9":{
        //     image:"./assets/image/atlas/world/world9.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World10":{
        //     image:"./assets/image/atlas/world/world10.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        // "World11":{
        //     image:"./assets/image/atlas/world/world11.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
    },
    entity: {
        player: {
            // "player1": {
            //     image: "../frontend/game-engine/bomberman/assets/image/atlas/entity/bomberman/player1-64x64.png",
            //     height: 128,
            //     width: 192,
            //     spriteSize: 32,
            //     idle: [0],
            //     right: [3, 4, 5],
            //     left: [11, 10, 9],
            //     up: [6, 7, 8],
            //     down: [0, 1, 2],
            // },
            "player1": {
                image: "../frontend/game-engine/bomberman/assets/image/atlas/entity/bomberman/player1-64x64.png",
                height: 256,
                width: 384,
                spriteSize: 64,
                idle: [0],
                right: [3, 4, 5],
                left: [11, 10, 9],
                up: [6, 7, 8],
                down: [0, 1, 2],
            },
            "player2": {
                image: "../frontend/game-engine/bomberman/assets/image/atlas/entity/bomberman/player2.png",
                height: 128,
                width: 192,
                spriteSize: 32,
                idle: [0],
                right: [3, 4, 5],
                left: [11, 10, 9],
                up: [6, 7, 8],
                down: [0, 1, 2],
            },
            "player3": {
                image: "../frontend/game-engine/bomberman/assets/image/atlas/entity/bomberman/player3.png",
                height: 128,
                width: 192,
                spriteSize: 32,
                idle: [0],
                right: [3, 4, 5],
                left: [11, 10, 9],
                up: [6, 7, 8],
                down: [0, 1, 2],
            },
            "player4": {
                image: "../frontend/game-engine/bomberman/assets/image/atlas/entity/bomberman/player4.png",
                height: 128,
                width: 192,
                spriteSize: 32,
                idle: [0],
                right: [3, 4, 5],
                left: [11, 10, 9],
                up: [6, 7, 8],
                down: [0, 1, 2],
            }
        },
        props: {
            // "bomb":{
            //     image: "../frontend/game-engine/bomberman/assets/image/atlas/entity/bomb/bomb.png",
            //     height: 80,
            //     width: 48,
            //     spriteSize: 16,
            //     typeBomb:{
            //         normal:[0,1,2],
            //         pic:[3,4,5],
            //         p:[6,7,8],
            //         moyen:[9,10,11],
            //         hard:[12,13,14]
            //     }
            // },
            "bomb":{
                image: "../frontend/game-engine/bomberman/assets/image/atlas/entity/bomb/bomb-32x32.png",
                height: 160,
                width: 96,
                spriteSize: 32,
                typeBomb:{
                    normal:[0,1,2],
                    pic:[3,4,5],
                    p:[6,7,8],
                    moyen:[9,10,11],
                    hard:[12,13,14]
                }
            },
            "blast-jaune":{
                image: "../frontend/game-engine/bomberman/assets/image/atlas/entity/bomb/blast-jaune.png",
                height: 64,
                width: 144,
                spriteSize: 16,
                Level1:{
                    milieux: 0,
                    top:{
                        line:1,
                        tip:2,
                    },
                    left:{
                        line:3,
                        tip:4,
                    },
                    bottom:{
                        line:5,
                        tip:6,
                    },
                    right:{
                        line:7,
                        tip:8,
                    }
                }
            }
        },
        ennemy: {
            // "test":{
            //     image:"./assets/image/entity/ennemy/test/atlas-mario.png",
            //     height:16,
            //     width:16,
            //     spriteSize:16,
            // }
        }
    }
}
