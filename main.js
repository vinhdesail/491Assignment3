var AM = new AssetManager();

function Animation(spriteSheet, frameWidth = spriteSheet.width, frameHeight = spriteSheet.height, sheetWidth = spriteSheet.width, frameDuration = 1, frames = 1, loop = true, scale = 1.0) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


AM.queueDownload("./img/dumbFish.png");
AM.queueDownload("./img/panda/moveLeft.png");
AM.queueDownload("./img/panda/moveRight.png");
AM.queueDownload("./img/panda/pandaLove.png");
AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    // gameEngine.addEntity(new Panda(gameEngine, AM.getAsset("./img/panda/moveLeft.png"), 
    //                                     AM.getAsset("./img/panda/moveRight.png"), 
    //                                     AM.getAsset("./img/panda/pandaLove.png")));
    // gameEngine.addEntity(new DumbFish(gameEngine, AM.getAsset("./img/dumbFish.png")));
    gameEngine.addEntity(new Display(gameEngine, 0, 0, "Click the center of rule to change it! Click cell to change life state!", 24));
    gameEngine.addEntity(new CellularAutomata(gameEngine));

    console.log("All Done!");
});