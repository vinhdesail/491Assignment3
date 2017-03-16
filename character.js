function Background(game, spritesheet) {
    this.spritesheet = spritesheet;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0);

    this.ani = new Animation(this.spritesheet, undefined, undefined, undefined, undefined, undefined, undefined, .75);

};

Background.prototype = Object.create(Entity.prototype);
Background.prototype.constructor = Background;

Background.prototype.draw = function () {
    // this.ctx.drawImage(this.spritesheet,
    //                this.x, this.y);
    this.ani.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y);
};

Background.prototype.update = function () {
};



function Panda(game, spritesheetLeft, spritesheetRight, spritesheetLove) {
    this.MOVELEFT = 0;
    this.MOVERIGHT = 1;
    this.LOVE = 2;
    this.status = this.MOVELEFT;
    this.moveleft = new Animation(spritesheetLeft, 47, undefined, 141, 0.10, 3, true, 1);
    this.moveright = new Animation(spritesheetRight, 47, undefined, 141, 0.10, 3, true, 1);
    this.love = new Animation(spritesheetLove, 42, undefined, 1722, 0.10, 41, true, 1);
    this.ani = this.moveleft;
    this.speed = -100;
    Entity.call(this, game, 500, 500);
}

Panda.prototype = Object.create(Entity.prototype);
Panda.prototype.constructor = Panda;

Panda.prototype.draw = function () {
    this.ani.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y);
}

Panda.prototype.update = function () {

    if(this.game.right.press){
        this.status = this.MOVERIGHT;

    } else if(this.game.left.press){
        this.status = this.MOVELEFT;

    } else if(this.game.up.press){
        this.status = this.LOVE;
    }

    if(this.status === this.MOVELEFT){
        this.ani = this.moveleft;
        if (this.ani.elapsedTime < this.ani.totalTime * 3)
            this.x += this.game.clockTick * this.speed;
    } else if(this.status === this.MOVERIGHT){
        this.ani = this.moveright;
        if (this.ani.elapsedTime < this.ani.totalTime * 3)
            this.x -= this.game.clockTick * this.speed;
    } else if(this.status === this.LOVE){
        this.ani = this.love;
    }

 
    if (this.x >= 1000) this.x = -99;
    if (this.x <= -100) this.x = 999;

}


function DumbFish(game, spritesheet) {
    this.animation = new Animation(spritesheet, 324, 256, 11, 0.15, 11, true, 1);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 700, 0);
}

DumbFish.prototype = Object.create(Entity.prototype);
DumbFish.prototype.constructor = DumbFish;

DumbFish.prototype.update = function () {
    // Doesnt move
    Entity.prototype.update.call(this);
}

DumbFish.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

// inheritance 
function Display(game, x = 0, y = 0, phrase = "update me", size = 1) {
    Entity.call(this, game, x, y);
    this.phrase = phrase;
    this.size = size;
}

Display.prototype = Object.create(Entity.prototype);
Display.prototype.constructor = Display;

Display.prototype.update = function () {
    // Doesnt move
    Entity.prototype.update.call(this);
}

Display.prototype.draw = function () {
    this.game.ctx.save();
    this.game.ctx.fillStyle = "black";
    this.game.ctx.font = this.size + "px Arial";
    this.game.ctx.fillText(this.phrase, this.x, this.y + this.size);
    this.game.ctx.restore();
    Entity.prototype.draw.call(this);
}

//////////////////////////////////////////////////////------------////////////////////////////////////////////////////////////////
// Main Automata
function CellularAutomata(game){
    Entity.call(this, game, 0, 0);

    this.ruleSize = 20;
    this.rulePaddingX = 50;
    this.rulePaddingY = 50;
    this.rules = [];
    // RULE in the pattern
    this.patternRule = [
        [true, true, true],
        [true, true, false],
        [true, false, true],
        [true, false, false],
        [false, true, true],
        [false, true, false],
        [false, false, true],
        [false, false, false]
    ];
    for(var i = 0; i < this.patternRule.length; i++){
        this.rules.push(new Rules(this.game, 
                            this.rulePaddingX + this.ruleSize * 4 * i, 
                            this.rulePaddingY, this.ruleSize, 
                        this.patternRule[i][0], this.patternRule[i][1], this.patternRule[i][2]));
    }
    // INITIAL RULE
    this.initialRule();

    this.ruleTotal = 0;
    this.cells = [];

    this.paddingX = 50;
    this.paddingY = 150;
    this.cellspacing = 5;
    ////////////////////////////////////////////////////////////// AMOUNT /////////////////////////////////////////////
    this.cellAmount = 30; 
    this.cellSize = 22;
    this.cellRow = 13;
    for(var i = 0; i < this.cellRow; i++){
        this.cells.push([]);
    }

    for(var i = 0; i < this.cells.length; i++){
        for(var j = 0; j < this.cellAmount; j++){
            this.cells[i].push(new Cell(this.game, 
            this.paddingX + j * (this.cellSize + this.cellspacing), 
            this.paddingY + i * (this.cellSize + this.cellspacing), 
            this.cellSize));
        }
    }
    this.nextUpdate = 1;
    this.elapsedTime = 0;
    this.totalTime = 1;

    var playbuttonY = 530;
    this.playButton = new Cell(this.game,
                                this.paddingX,
                                playbuttonY,
                                50 * 1,
                                "Play");

}

CellularAutomata.prototype = Object.create(Entity.prototype);
CellularAutomata.prototype.constructor = CellularAutomata;

CellularAutomata.prototype.update = function () {
    // UPDATE BUTTONS
    this.playButton.update();

    if(this.playButton.alive){
        this.elapsedTime += this.game.clockTick;
        if(this.elapsedTime >= this.totalTime){
            this.elapsedTime = 0;
            this.updateNextRow();
        }
    }

    // UPDATE RULES
    var startPower = Math.pow(2, 7);
    this.ruleTotal = 0;
    for(var i = 0; i < this.rules.length; i++){
        this.rules[i].update();
        if(this.rules[i].offSpring.alive){
            this.ruleTotal += startPower;
        }
        startPower = startPower / 2;
    }
    // UPDATE CELL SELECTS
    for(var i = 0; i < this.cells.length; i++){
        for(var j = 0; j < this.cellAmount; j++){
            this.cells[i][j].update();
        }
    }
    Entity.prototype.update.call(this);
}

CellularAutomata.prototype.draw = function () {
    // DRAW BUTTONS
    this.playButton.draw();

    // DRAW NEXT UPDATE LOCATION
    var tempY = (this.nextUpdate - 1) * (this.cellSize + this.cellspacing);
    this.game.ctx.save();
    this.game.ctx.fillStyle = "red";
    this.game.ctx.beginPath();
    this.game.ctx.fillRect(this.x + this.paddingX - this.cellSize / 2, 
                            tempY + this.paddingY + this.cellSize / 3, 
                            this.cellSize / 2, 
                            this.cellSize / 3);
    this.game.ctx.stroke();
    this.game.ctx.restore();

    // DRAW RULES
    for(var i = 0; i < this.rules.length; i++){
        this.rules[i].draw();
    }
    this.game.ctx.save();
    this.game.ctx.fillStyle = "black";
    this.game.ctx.font = this.ruleSize + "px Arial";
    this.game.ctx.fillText("RULE", 
                        this.x + this.rulePaddingX + this.ruleSize * 4 * 9 - this.ruleSize, 
                        this.y + this.rulePaddingY + this.ruleSize * 1);
    this.game.ctx.fillText("" + this.ruleTotal, 
                        this.x + this.rulePaddingX + this.ruleSize * 4 * 9, 
                        this.y + this.rulePaddingY + this.ruleSize * 3);
    this.game.ctx.restore();
    // DRAW CELLS
    for(var i = 0; i < this.cells.length; i++){
        for(var j = 0; j < this.cellAmount; j++){
            this.cells[i][j].draw();
        }
    }
    Entity.prototype.draw.call(this);
}

CellularAutomata.prototype.updateNextRow = function(){
    // SHIFT UP
    if(this.nextUpdate >= this.cells.length){
        for(var i = 0; i < this.cellAmount; i++){
            this.cells[0][i].alive = this.cells[this.cells.length - 1][i].alive;
        }
        for(var i = 1; i < this.cells.length; i++){
            for(var j = 0; j < this.cellAmount; j++){
                this.cells[i][j].alive = false;
            }
        }
        this.nextUpdate = 1;
    // DO CALCULATION
    } else {
        for(var i = 0; i < this.cellAmount; i++){
            // CHECK ABOVE
            var tempArr = [];
            //first
            if(i - 1 >= 0){
                tempArr.push(this.cells[this.nextUpdate - 1][i - 1].alive);
            } else {
                tempArr.push(false);
            }
            //middle
            tempArr.push(this.cells[this.nextUpdate - 1][i].alive);
            //back
            if(i + 1 < this.cellAmount){
                tempArr.push(this.cells[this.nextUpdate - 1][i + 1].alive);
            } else {
                tempArr.push(false);
            }
            // Get index
            var tempIndex = this.getRule(tempArr);
            // console.log(tempIndex);
            this.cells[this.nextUpdate][i].alive = this.rules[tempIndex].offSpring.alive;
        }
        this.nextUpdate++;
    }
}

CellularAutomata.prototype.getRule = function(arr){
    for(var i = 0; i < this.patternRule.length; i++){
        if(arr[0] === this.patternRule[i][0] &&
            arr[1] === this.patternRule[i][1] &&
            arr[2] === this.patternRule[i][2]){
            return i;
        }
    }
    return -1;
}

CellularAutomata.prototype.initialRule = function(){
    this.rules[0].offSpring.alive = false;
    this.rules[1].offSpring.alive = false;
    this.rules[2].offSpring.alive = false;
    this.rules[3].offSpring.alive = true;
    this.rules[4].offSpring.alive = true;
    this.rules[5].offSpring.alive = true;
    this.rules[6].offSpring.alive = true;
    this.rules[7].offSpring.alive = false;
}


// CELL
function Cell(game, x, y, size, phrase = undefined){
    Entity.call(this, game, x, y);

    this.alive = false;
    this.width = size;
    this.height = size;
    this.size = size;
    this.clickable = true;
    this.colliseBox = {x: x, y: y, width: this.width, height: this.height};

    this.phrase = phrase;

}

Cell.prototype = Object.create(Entity.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.update = function () {
    
    if (collise(this.colliseBox, this.game.mouse) && this.clickable) {
        if (this.game.mouse.click) { 
            this.game.mouse.click = false;
            this.alive = !this.alive;
        }
    }

    Entity.prototype.update.call(this);
}

Cell.prototype.draw = function () {

    this.game.ctx.save();
    
    if(this.alive){
        this.game.ctx.fillStyle = "blue";
        
    } else {
        this.game.ctx.fillStyle = "white";
    }
    this.game.ctx.beginPath();
    this.game.ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
    this.game.ctx.stroke();

    this.game.ctx.beginPath();
    this.game.ctx.lineWidth="2";
    this.game.ctx.strokeStyle = "black"
    this.game.ctx.rect(this.x, this.y, this.width, this.height);
    this.game.ctx.stroke();

    if(this.phrase !== undefined){
        this.game.ctx.fillStyle = "black";
        this.game.ctx.font = this.size / 2 + "px Arial";
        this.game.ctx.fillText(this.phrase, this.x, this.y + this.size / 1.5);
    }

    this.game.ctx.restore();
    Entity.prototype.draw.call(this);
}

// RULES
function Rules(game, x, y, size, oneOn = false, twoOn = false, threeOn = false) {
    Entity.call(this, game, x, y);

    this.size = size;

    this.one = new Cell(this.game, x, y, size);
    this.one.clickable = false;
    this.two = new Cell(this.game, x + size, y, size);
    this.two.clickable = false;
    this.three = new Cell(this.game, x + size + size, y, size);
    this.three.clickable = false;

    if(oneOn){
        this.one.alive = true;
    }
    if(twoOn){
        this.two.alive = true;
    }
    if(threeOn){
        this.three.alive = true;
    }

    this.offSpring = new Cell(this.game, x + size, y + size, size);

}

Rules.prototype = Object.create(Entity.prototype);
Rules.prototype.constructor = Rules;

Rules.prototype.update = function () {
    
    this.offSpring.update();
    Entity.prototype.update.call(this);
}

Rules.prototype.draw = function () {
    
    this.one.draw();
    this.two.draw();
    this.three.draw();
    this.offSpring.draw();

    this.game.ctx.save();
    this.game.ctx.fillStyle = "black";
    this.game.ctx.font = (this.size) + "px Arial";
    if(this.offSpring.alive){
        this.game.ctx.fillText("1", this.x + this.size, this.y + this.size * 3);
    } else {
        this.game.ctx.fillText("0", this.x + this.size, this.y + this.size * 3);
    }
    this.game.ctx.restore();
    Entity.prototype.draw.call(this);
}