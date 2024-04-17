export const Tablevel = {
    Monde1:{
        Level1:{
            property:{
                solide:[1],
                bonus:[],
                brick:[4],
                background:{
                    color:"rgb(35, 35, 35)",
                    width: "240px",
                    height: "208px"
                }
            },
            map:{
                0:{
                    matris:
                        [
                            [ 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 ],
                            [ 1 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 ],
                        ],
                    type:"World1",
                }
            },
        },
        Level2:{
            property:{
                solide:[1],
                bonus:[],
                brick:[4],
                background:{
                    color:"rgb(35, 35, 35)",
                    width: "240px",
                    height: "208px"
                }
            },
            map:{
                0:{
                    matris:
                        [
                            [ 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 ],
                            [ 1 , 2 , 4 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 2 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 4 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 , 3 , 1 ],
                            [ 1 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 2 , 3 , 1 ],
                            [ 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 ],
                        ],
                    type:"World2",
                }
            },
        }
    }
}


export const SpriteAtlas = {
    maping:{
        "World1":{
            image:"./assets/image/atlas/world/world1-32x32.png",
            height:96,
            width:96,
            spriteSize:32
        },
        // "World1":{
        //     image:"./assets/image/atlas/world/world1.png",
        //     height:48,
        //     width:48,
        //     spriteSize:16
        // },
        "World2":{
            image:"./assets/image/atlas/world/world2.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World3":{
            image:"./assets/image/atlas/world/world3.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World4":{
            image:"./assets/image/atlas/world/world4.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World5":{
            image:"./assets/image/atlas/world/world5.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World6":{
            image:"./assets/image/atlas/world/world6.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World7":{
            image:"./assets/image/atlas/world/world7.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World8":{
            image:"./assets/image/atlas/world/world8.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World9":{
            image:"./assets/image/atlas/world/world9.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World10":{
            image:"./assets/image/atlas/world/world10.png",
            height:48,
            width:48,
            spriteSize:16
        },
        "World11":{
            image:"./assets/image/atlas/world/world11.png",
            height:48,
            width:48,
            spriteSize:16
        },
    },
    entity:{
        "player1":{
            image:"./assets/image/atlas/entity/bomberman/player1.png",
            height:96,
            width:192,
            spriteSize:32,
        },
        ennemy:{
            // "test":{
            //     image:"./assets/image/entity/ennemy/test/atlas-mario.png",
            //     height:16,
            //     width:16,
            //     spriteSize:16,
            // }
        }
    }
}

// console.log(Tablevel)