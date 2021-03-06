var centerX = 600/2, centerY = 300/2, turn = true, nextFire = 0, arrowRate = 1000, revolverRate = 500, charWeapon = "Bow", midClimb = false, char1, bullet, arrow, land, platform, chest, charHP = 100, rockRate = 2000, rollerRate = 3000, nextOrb2 = 0, nextRock1 = 0, nextRock2 = 0, nextRock3 = 0, nextRock4 = 0, last_dir, peasant1Player, peasant1Text, p1_text_val, peasant1, cave_sounds, nextSlash = 0, nextBow = 0, nextShot = 0;

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.image("background", "pix/sunrise.jpg");
        game.load.image("back_wall", "pix/back-walls.png");
        game.load.tilemap("cave_map", "pix/larger_map_json.json", null, Phaser.Tilemap.TILED_JSON); //'cave_map' does NOT need to be in json
        game.load.image("larger_tiles", "pix/cave_tiles_png.png"); // Base Cave Tiles
        game.load.image("rad_sign", "pix/rad_sign.png"); // radiation sign tile
        game.load.image("rope", "pix/rope.png"); // rope tile
        game.load.image("vines_w_light_green", "pix/vines_w_light_green.png"); // vines tile
        game.load.image("x_sign", "pix/x_sign.png"); // X sign tile
        //game.load.image("purple", "pix/purple3.jpg");
        game.load.image("peasant", "pix/peasant.png");
        game.load.image("E_icon", "pix/E_icon.png")
        game.load.image('door', 'pix/old_door.png');
        game.load.image("chipped_blade", "pix/chipped_blade.png");
        game.load.spritesheet('walk_rev', "pix/walkRevolver.png", 128, 128);

        //game.load.spritesheet('walk', "pix/walkBowArrow.png", 128, 128);
        game.load.spritesheet('walk', "pix/RevolverPlusClumb.png", 128, 128);
        game.load.spritesheet('rocker', "pix/rocker.png", 128, 128);
        game.load.spritesheet('heart', "pix/heart.png", 1024, 1024);
        game.load.spritesheet('rocker_backwards', "pix/rocker.png", 128, 128);
        game.load.spritesheet('water_drip', 'pix/water_drip.png', 32, 96);
        game.load.spritesheet('wizard', "pix/redWizard.png", 128, 128);
        game.load.image('anArrow', 'pix/arrow.png');
        game.load.image("grass", "pix/grass.png"); // grass tile
        game.load.image('bullet', 'pix/bullet.png');
        game.load.image('rock', 'pix/thrown_rock.png');
        game.load.image('rolledStone', 'pix/blueFire.png');
        game.load.image('blackSquare', 'pix/blackBack.jpg');
        game.load.image('redSquare', 'pix/redBack.jfif');
        game.load.image('chestClosed', 'pix/chest_closed.png');
        game.load.image('chestOpen', 'pix/chest_open.png');
        //game.load.image('empty_sprite', 'pix/empty_sprite.png');
        game.load.spritesheet('slash_L_2', 'pix/slash_L_2.png', 32, 32);
        game.load.spritesheet('slash_R_2', 'pix/slash_R_2.png', 32, 32);

        game.load.audio('cave_sounds', 'pix/cave_sounds.wav');
        game.load.audio('slash', 'pix/slash.wav');
        game.load.audio('arrow_sound', 'pix/arrow_sound.wav');
        game.load.audio('gunshot', 'pix/gunshot.wav');

    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        sunrise = game.add.sprite(0,0,"background");
        sunrise.height = 416;
        sunrise.width = 2048;

        back_wall = game.add.sprite(0, 0, "back_wall"); // NEW CAVE BACKGROUND
        back_wall.height = 416;
        back_wall.width = 2048;

        back_wall_2 = game.add.sprite(1024, 0);
        back_wall_2.height = 416;
        back_wall_2.width = 1024;

        // VVVVV SOUNDS
        cave_sounds = game.add.audio('cave_sounds');
        cave_sounds.loop = true
        cave_sounds.play();

        slash = game.add.audio('slash');

        arrow_sound = game.add.audio('arrow_sound');

        gunshot = game.add.audio('gunshot');
        // ^^^^^ SOUNDS
        

        var map = game.add.tilemap('cave_map');
        map.addTilesetImage('larger_tiles');
        map.addTilesetImage('x_sign');
        map.addTilesetImage('rad_sign');
        map.addTilesetImage('vines_w_light_green');
        map.addTilesetImage('rope');
        map.addTilesetImage('grass');
        cave_layer = map.createLayer('Tile Layer 1');
        cave_layer2 = map.createLayer('Tile Layer 2');

        map.setCollisionBetween(2, 128, true, 'Tile Layer 1');
    

        
        // create land group
        land = game.add.group()
        game.physics.enable(land);
        land.enableBody = true;        

        //create health bar
        blackHP = land.create(25,275, "blackSquare")
        blackHP.height = 15
        blackHP.width = 205
        redHP = land.create(27,278, "redSquare")
        redHP.height = 9
        redHP.width = 200
        blackHP.fixedToCamera = true;
        redHP.fixedToCamera = true;

        // create slash/hurtbox
        slash_L_2 = game.add.sprite(50, 50, 'slash_L_2');
        slash_L_2.animations.add('slash_L_2', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        slash_L_2.frame = 0;
        game.physics.arcade.enable(slash_L_2);
        

        slash_R_2 = game.add.sprite(50, 50, 'slash_R_2');
        slash_R_2.animations.add('slash_R_2', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        slash_R_2.frame = 0;
        game.physics.arcade.enable(slash_R_2);
        //empty_sprite_L = game.add.sprite(50, 50, 'empty_sprite');
        //empty_sprite_R = game.add.sprite(50, 50, 'empty_sprite');

        // create sword (placeholder, kind of)
        chipped_blade = game.add.sprite(50, 50, 'chipped_blade');

        //create character 
        char1 = game.add.sprite(50,50, 'walk'); 
        char1.scale.setTo(.25,.25);
        char1.frame = 0;
        char1.anchor.x = .5
        char1.animations.add('walk', [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15]);
        char1.animations.add('climb', [16,17,18,19,20,19,18,17]);
        charWeapon = "Bow"

        //add gravity and physics
        game.physics.arcade.enable(char1);
        char1.body.gravity.y = 700;
        char1.body.collideWorldBounds = true;

        //add controls
        cursors = game.input.keyboard.createCursorKeys()

        //create game camera
        game.world.setBounds(0, 0, 2048, 416);
        game.camera.follow(char1);        

        //add bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(200, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);

        //add arrows
        arrows = game.add.group();
        arrows.enableBody = true;
        arrows.physicsBodyType = Phaser.Physics.ARCADE;
        arrows.createMultiple(200, 'anArrow');
        arrows.setAll('checkWorldBounds', true);
        arrows.setAll('outOfBoundsKill', true);
        

        // add environmental elements
        drip1 = game.add.sprite(550, 160, "water_drip");
        drip1.animations.add("dripping", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        drip1.animations.play("dripping", 24, true);

        drip2 = game.add.sprite(190, 224, "water_drip");
        drip2.animations.add("dripping", [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        drip2.animations.play("dripping", 24, true);

        drip3 = game.add.sprite(1800, 288, "water_drip");
        drip3.animations.add("dripping", [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        drip3.animations.play("dripping", 24, true);

        drip4 = game.add.sprite(120, 32, "water_drip");
        drip4.animations.add("dripping", [0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        drip4.animations.play("dripping", 24, true);

        drip5 = game.add.sprite(1200, 288, "water_drip");
        drip5.animations.add("dripping", [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        drip5.animations.play("dripping", 24, true);

        // add Peasant speaker
        speakers = game.add.group();
        speakers.enableBody = true;
        speakers.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.enable(speakers);

        peasant1 = speakers.create(150, 100, 'peasant');
        peasant1.scale.setTo(1, 1);
        peasant1.anchor.x = .5;
        peasant1.anchor.y = .5;
        peasant1.body.gravity.y = 400;
        peasant1.body.collideWorldBounds = true;

        // peasant1 Text
        p1_text_val = '...'
        peasant1Text = game.add.text(0, 0, 'Hello there sir', {font: "20px Arial", fill: "#ff9200", align: "center"});

        peasant1E = game.add.sprite(0, 0, "E_icon")

        //add rockers
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.enable(enemies);

        rWizard1 = enemies.create(700, 50, 'wizard');
        rWizard1.scale.setTo(-.30, .30)
        rWizard1.anchor.x = .5
        rWizard1.anchor.y = .5
        rWizard1.body.gravity.y = 400;
        rWizard1.body.collideWorldBounds = true;
        rWizard1.life = 2;
        rWizard1.animations.add("rocker",[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5]); // added zeros for better pace
        rWizard1.animations.add("rocker_backwards", [5, 4, 3, 2, 1, 0]);

        rWizard2 = enemies.create(1910, 50, 'wizard');
        rWizard2.scale.setTo(-.30, .30)
        rWizard2.anchor.x = .5
        rWizard2.anchor.y = .5
        rWizard2.body.gravity.y = 400;
        rWizard2.body.collideWorldBounds = true;
        rWizard2.life = 2;
        rWizard2.animations.add("rocker",[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5]); // added zeros for better pace
        rWizard2.animations.add("rocker_backwards", [5, 4, 3, 2, 1, 0]);

        rocker2 = enemies.create(600, 225, 'rocker');
        rocker2.scale.setTo(-.40,.40)
        rocker2.anchor.x = .5
        rocker2.anchor.y = .5
        rocker2.body.gravity.y = 400;
        rocker2.body.collideWorldBounds = true;
        rocker2.life = 2;
        rocker2.animations.add("rocker1",[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5]); // added zeros for better pace
        rocker2.animations.add("rocker_backwards1", [5, 4, 3, 2, 1, 0]);

        rocker3 = enemies.create(1150, 114, 'rocker');
        rocker3.scale.setTo(.40,.40)
        rocker3.anchor.x = .5
        rocker3.anchor.y = .5
        rocker3.body.gravity.y = 400;
        rocker3.body.collideWorldBounds = true;
        rocker3.life = 2;
        rocker3.animations.add("rocker",[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5]); // added zeros for better pace

        rocker4 = enemies.create(1250, 350, 'rocker');
        rocker4.scale.setTo(-.40,.40)
        rocker4.anchor.x = .5
        rocker4.anchor.y = .5
        rocker4.body.gravity.y = 400;
        rocker4.body.collideWorldBounds = true;
        rocker4.life = 2;
        rocker4.animations.add("rocker",[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5]); // added zeros for better pace
        
        //add rocks
        rocks = game.add.group()
        rocks.enableBody = true;
        rocks.physicsBodyType = Phaser.Physics.ARCADE;
        rocks.createMultiple(200, 'rock');
        rocks.setAll('checkWorldBounds', true);
        rocks.setAll('outOfBoundsKill', true);

        //add blue fire
        fireball = game.add.group()
        fireball.enableBody = true;
        fireball.physicsBodyType = Phaser.Physics.ARCADE;
        fireball.createMultiple(200, 'rolledStone');
        fireball.setAll('checkWorldBounds', true);
        fireball.setAll('outOfBoundsKill', true);

        //add chest
        chest = game.add.sprite(850, 272, 'chestClosed');
        chest.scale.setTo(.1, .1);
        game.physics.arcade.enable(chest);
        chest.body.gravity.y = 400;
        chest.body.collideWorldBounds = true;
        chest.body.immovable = true;
        chest.anchor.x = .5
        chest.anchor.y = .5

        // add door
        door = game.add.sprite(2016, 32, 'door');
        game.physics.arcade.enable(door);

        use_key = game.input.keyboard.addKey(Phaser.Keyboard.E);
        use_key.onDown.add(peasant1_dialogue, globalThis);

        //add health pickup class
        healthHeart = game.add.group()
        game.physics.arcade.enable(healthHeart);
        healthHeart.enableBody = true;
        healthHeart.physicsBodyType = Phaser.Physics.ARCADE;

        // add health pickups
        heart1 = healthHeart.create(100,350, 'heart');
        heart1.scale.setTo(-.025,.025)
        heart1.anchor.x = .5
        heart1.anchor.y = .5
        heart1.body.gravity.y = 100;
        heart1.body.collideWorldBounds = true;
        heart1.animations.add("bounce",[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);

        heart2 = healthHeart.create(1500,50, 'heart');
        heart2.scale.setTo(-.025,.025)
        heart2.anchor.x = .5
        heart2.anchor.y = .5
        heart2.body.gravity.y = 100;
        heart2.body.collideWorldBounds = true;
        heart2.animations.add("bounce",[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);

        heart3 = healthHeart.create(1900,250, 'heart');
        heart3.scale.setTo(-.025,.025)
        heart3.anchor.x = .5
        heart3.anchor.y = .5
        heart3.body.gravity.y = 100;
        heart3.body.collideWorldBounds = true;
        heart3.animations.add("bounce",[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);

    },
    update: function(){

        var stand = game.physics.arcade.collide(char1, cave_layer); // land -> cave_layer
        var enemystand = game.physics.arcade.collide(enemies, cave_layer); // land -> cave_layer
        var heartStand = game.physics.arcade.collide(healthHeart, cave_layer); // land -> cave_layer
        var fireballStand = game.physics.arcade.collide(fireball, cave_layer); // land -> cave_layer
        var speakersStand = game.physics.arcade.collide(speakers, cave_layer); // speakers collide with ground
        char1.body.velocity.x = 0;
        //check for overlap between bullets and walls, call function to kill bullet sprite
        game.physics.arcade.collide(bullets, cave_layer, this.hitWall); // land -> cave_layer // overlap -> collide
        game.physics.arcade.collide(arrows, cave_layer, this.hitWall);
        game.physics.arcade.overlap(rocks, char1, this.hitPlayer);
        game.physics.arcade.overlap(fireball, char1, this.hitPlayer);
        game.physics.arcade.collide(rocks, cave_layer, this.rockLand); // land -> cave_layer // overlap -> collide
        game.physics.arcade.overlap(bullets, enemies, this.killEnemy);
        game.physics.arcade.overlap(arrows, enemies, this.killEnemy);
        game.physics.arcade.overlap(slash_L_2, enemies, this.meleeEnemyL); // MELEE
        game.physics.arcade.overlap(slash_R_2, enemies, this.meleeEnemyR);
        game.physics.arcade.overlap(healthHeart, char1, this.collectHeart); // collect health 
        game.physics.arcade.collide(chest, cave_layer);
        var chestPlayer = game.physics.arcade.collide(char1, chest);
        var peasant1Player = game.physics.arcade.overlap(char1, peasant1);
        var doorPlayer = game.physics.arcade.overlap(char1, door);
        heart1.animations.play('bounce', 20, true);
        heart2.animations.play('bounce', 20, true);
        heart3.animations.play('bounce', 20, true);

        // ALIGN slash/hurtboxes to player sides
        slash_L_2.alignTo(char1, Phaser.TOP_CENTER, -15, -35);
        slash_R_2.alignTo(char1, Phaser.TOP_CENTER, 15, -35);

        // ALIGN sword to player back
        chipped_blade.alignTo(char1, Phaser.TOP_CENTER, 0, -30);

        // ALIGN text to peasant1
        peasant1Text.alignTo(peasant1, Phaser.BOTTOM_CENTER, 0, 0);

        // ALIGN E to peasant1
        peasant1E.alignTo(peasant1, Phaser.TOP_CENTER, 0, 0);
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)){
            char1.body.velocity.x = -200;
            if (midClimb == false) {
                char1.animations.play('walk', 20, true);
            }
            char1.scale.setTo(-.25,.25)
            turn = false;
            last_dir = 'left'
            }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D)){
            char1.body.velocity.x = 200;
            if (midClimb == false) {
                char1.animations.play('walk', 20, true);
            }
            char1.scale.setTo(.25,.25)
            turn = true;
            last_dir = 'right'
            }
    else{
        char1.animations.stop('walk');
        char1.frame = 0;
    }      
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        if (charWeapon == "Bow") {
            shootBow();
            if (nextBow == 0){
                arrow_sound.play();
                nextBow = game.time.now + 1000;
            }
            else if (game.time.now >= nextBow){
                arrow_sound.play();
                nextBow = game.time.now + 1000;
            }
            
        } else {
            fire();
            if (nextShot == 0){
                gunshot.play();
                nextShot = game.time.now + 500;
            }
            else if (game.time.now >= nextShot){
                gunshot.play();
                nextShot = game.time.now + 500;
            }
        }
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.F)){
        animateMelee();
        if (nextSlash == 0){
            slash.play();
            nextSlash = game.time.now + 500;
        }
        //if game.time.now >= game.time.now + 800
        else if (game.time.now >= nextSlash){
            slash.play();
            nextSlash = game.time.now + 500;
        }
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.W) && stand)
    {  
        if(char1.body.blocked.down) {   // touching -> blocked
            char1.body.velocity.y = -250;
        } else if(char1.body.blocked.up) { // if you hit your head, start falling down.
            midClimb = false               // (touching -> blocked  --- FIXED head climbing)
            char1.body.velocity.y = 10
        } else {
            char1.body.velocity.y = -75
            midClimb = true
            char1.animations.play('climb', 20, true);
        } 
    } else {
        midClimb = false
    }
    
    // rocker throw rocks
    if(rWizard1.life > 0){
        if (game.time.now > nextRock1){
            nextRock1 = game.time.now + rollerRate;
            rWizard1.animations.play("rocker",10,false);
            this.roll(rWizard1);

        }

    }
    if(rWizard2.life > 0){
        if (game.time.now > nextOrb2){
            nextOrb2 = game.time.now + rollerRate;
            rWizard2.animations.play("rocker",10,false);
            this.roll(rWizard2);

        }
    }
    if(rocker2.life > 0){
        if (game.time.now > nextRock2){
            nextRock2 = game.time.now + rockRate;
            rocker2.animations.play("rocker1",10,false);
            this.throw(rocker2,"left");
    }
    }
    if(rocker3.life > 0){
        if (game.time.now > nextRock3){
            nextRock3 = game.time.now + rockRate;
            rocker3.animations.play("rocker",10,false);
            this.throw(rocker3,"right");
    }
    }
    if(rocker4.life > 0){
        if (game.time.now > nextRock4){
            nextRock4 = game.time.now + rockRate;
            rocker4.animations.play("rocker",10,false);
            this.throw(rocker4, "left");
    }
    }
    if(chestPlayer){
        if (game.input.keyboard.isDown(Phaser.Keyboard.E)){
            chest.loadTexture('chestOpen');
            chest.reset(chest.x, chest.y);
            charWeapon = "revolver"
        }
    }
    if (doorPlayer){
        game.state.start('state2');
    }
    if (peasant1Player){
        peasant1Text.visible = true
        if(peasant1Text.text != 'Please sir, fight the boss') {
            peasant1E.visible = true
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.E)){
            peasant1Text.text = 'Please sir, fight the boss'
            peasant1E.visible = false
        }
    } else {
        peasant1E.visible = false
        peasant1Text.visible = false
    }

    },
    throw: function(m,side){
        //console.log('rocker');
        rock = rocks.getFirstDead();
        rock.reset(m.x, m.y - 20);
        rock.body.gravity.y = 400;
        if(side == "right") {
            rock.body.velocity.x = Math.random() * (400 - 200) + 200;
        } else {
            rock.body.velocity.x = (Math.random() * (400 - 200) + 200)*-1;
        }
        rock.body.velocity.y = Math.random() * -(200 - 50) - 50;
    },
    roll: function(m){
        console.log('rocker');
        fball = fireball.getFirstDead();
        if(m.scale.x > 0) {
            fball.reset(m.x+7, m.y - 25);
        } else {
            fball.reset(m.x-7, m.y - 25);
        }
        
        fball.scale.setTo(.1,.1)
        fball.body.gravity.y = 900;
        if(m.scale.x > 0) {
            fball.body.velocity.x = 130;
        } else {
            fball.body.velocity.x = -130
        }
        fball.body.velocity.y = -100;
        fball.body.bounce.set(.85)
        fball.lifespan = (10000)
    },
    hitWall: function(b){
        //console.log('Hit wall');
        b.kill();
    },
    hitPlayer: function(c, r){
        r.kill();
        charHP = charHP - 20
        redHP.width = charHP*2
        if (charHP == 0) {
            char1.kill()
            chipped_blade.kill()
            charHP = 100
            game.state.start('state3');
        }
    },
    rockLand: function(r, l){
        r.kill();
    },
    killEnemy: function(b, e){
        b.kill();
        e.life = e.life - 1;
        if (e.life < 1) {
            e.kill();
        }
    },
    meleeEnemyL: function(s, e){
        if (game.input.keyboard.isDown(Phaser.Keyboard.F)){
            if (s.frame == 2) {
                e.life = e.life - 1;
                if (e.life < 1) {
                    e.kill();
                }
            }
        }
    },
    meleeEnemyR: function(s, e){
        if (game.input.keyboard.isDown(Phaser.Keyboard.F)){
            if (s.frame == 2) {
                e.life = e.life - 1;
                if (e.life < 1) {
                    e.kill();
                }
            }
        }
    },
    collectHeart: function(c, h){
        if (charHP != 100) {
            charHP = charHP + 20 
            h.kill()
            redHP.width = charHP*2
        } 

    }


}
    function fire(){
        if(game.time.now > nextFire) {
            nextFire = game.time.now + revolverRate;
            //console.log('firing');
            bullet = bullets.getFirstDead();
            bullet.reset(char1.x, char1.y);
            if (turn == true){
                //console.log(game.time.now)
                bullet.reset(char1.x, char1.y+10);
                bullet.scale.setTo(.5,.5);
                bullet.body.velocity.x = 1000;
            }
            else{
                console.log(game.time.now)
                bullet.reset(char1.x, char1.y+10);
                bullet.scale.setTo(-.5,.5);
                bullet.body.velocity.x = -1000;
            }
    

        }
    } 

    function shootBow(){
        if(game.time.now > nextFire) {
            nextFire = game.time.now + arrowRate;
            console.log('firing');
            arrow = arrows.getFirstDead();
            arrow.reset(char1.x, char1.y);
            arrow.body.gravity.y = 200;
            if (turn == true){
                console.log(game.time.now)
                arrow.reset(char1.x, char1.y+10);
                arrow.scale.setTo(.2,.2);
                arrow.body.velocity.x = 400;
                arrow.body.velocity.y = -60;

            }
            else{
                console.log(game.time.now)
                arrow.reset(char1.x, char1.y+10);
                arrow.scale.setTo(-.2,.2);
                arrow.body.velocity.x = -400;
                arrow.body.velocity.y = -60;
            }
    

        }
    }
    function animateMelee(){
        if (last_dir == 'left') {
            slash_L_2.animations.play('slash_L_2', 30, false);
        }
        else if (last_dir == 'right') {
            slash_R_2.animations.play('slash_R_2', 30, false);
        }
    }

    
    function peasant1_dialogue(){
        //peasant1Player = peasant1Player
        if (peasant1Player) { // collision detected globally?
            peasant1Text.text = 'Child: Hey!'
            
        }
    }
    

