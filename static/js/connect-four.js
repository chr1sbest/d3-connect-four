var connectFour = {
    init: function(options) {
        this.options = options || {};
        this.options.columns = this.options.columns || 7;
        this.options.rows = this.options.rows || 6;
        this.options.diameter = this.options.diameter || 500 / this.options.columns;
        this.options.winCondition = this.options.winCondition || 4;
        this.options.colors = this.options.colors || ['Red', 'Yellow'];
        this.colorSwitch = 0;

        //Initialize Separate Board UI
        this.board = board;
        this.board.init(this.options);

        //Initialize Separate Logic Engine
        this.engine = engine;
        this.engine.init(this.options)
    }
,   drop: function(column){
        //Find the depth of the drop using the drop engine.
        if (!this.finished){
            var row = this.engine.checkDrop(column);
            if (row >= 0) { //Ensure column is not full!
                this.colorSwitch += 1;
                var color = this.options.colors[this.colorSwitch % this.options.colors.length];
                //Execute move on both the board and the engine.
                this.board.drop(row, column, color);
                this.engine.drop(row, column, color);
            }
            else {alert("Column is full!");}
        }
    }
,   win: function(color) {
        setTimeout(function () {
            alert(color + " has won!");
        }, 400);
        this.finished = true;
    }
,   reset: function(options) {
        var options = options || this.options;
        console.log(options);
        this.engine.reset(options);
        this.board.reset(options);
        this.finished = false;
    }
}

var engine = {
    init: function(options) {
        this.options = options;
        this.columns = this.options.columns;
        this.rows = this.options.rows;
        this.colors = this.options.colors;
        this.winCondition = this.options.winCondition;
        this.matrix = this.buildMatrix();
        this.directions = 
        {   up: [0, 1]
        ,   upright: [1, 1]
        ,   right: [1, 0]
        ,   downright: [1, -1]
        ,   down: [0,-1]
        ,   downleft: [-1, -1]
        ,   left: [-1, 0]
        ,   upleft: [-1, 1]
        }
    }
,   buildMatrix: function(){
        //Build [Column] x [Row] matrix
        var self = this;
        var matrix = _.map(_.range(this.columns), function(val) {
            return _.map(_.range(self.rows), function(val) {
                return null;});
        });
        return matrix
    }
,   checkDrop: function(column){
        //Determine the lowest available row
        var column = this.matrix[column];
        for (var i = 0; i < this.rows; i++) {
            if (column[i] !== null) {
                break;
            }
        };
        return i - 1;
    }
,   drop: function(row, column, color){
        //Execute Drop
        this.matrix[column][row] = color;
        if (this.checkWin(column, row, color)) {alert(color + " wins!");}
    }
,   checkWin: function(column, row, color){
        //Check if any adjacent tokens are the same color
        var color = color
        ,   column = column
        ,   row = row
        ,   self = this
        ;
        _.each(this.directions, function(steps, direction) {
            //Iterate through each direction in the matrix
            var nextCol = column + steps[0] 
            ,   nextRow = row + steps[1]
            ,   adjacent = null
            ;
            if (self.matrix[nextCol]) {
                adjacent = self.matrix[nextCol][nextRow] || null
            }
            if (adjacent == color) {
                var total = self.checkPaths(steps, color, column, row);
                if (total >= self.winCondition) {
                    console.log('winner');
                    connectFour.win(color);
                }
            }
        });
        
    }
,   checkPaths: function(direction, color, column, row) {
        var pathTotal = 0
        ,   nextCol = column + direction[0]
        ,   nextRow = row + direction[1]
        ,   oppDir = _.map(direction, function(val) {return -val})
        ,   oppCol = column + oppDir[0]
        ,   oppRow = row + oppDir[1]
        ,   opp = this.matrix[oppCol] || null 
        ;
        //Add pathtotal from initial direction
        pathTotal += this.pathTotal(direction, color, nextCol, nextRow);
        //Add pathtotal from opposite direction if same color
        if (opp) {opp = this.matrix[oppCol][oppRow] || null};
        if (opp == color) {
            pathTotal += this.pathTotal(oppDir, color, oppCol, oppRow)
        }
        return pathTotal;
    }
,   pathTotal: function(direction, color, column, row){
        var adjacent = this.matrix[column] || null;
        if (adjacent) {adjacent = this.matrix[column][row] || null}
        if (adjacent == color) {
            var nextCol = column + direction[0]
            ,   nextRow = row + direction[1]
            ;
            return 1 + this.pathTotal(direction, color, nextCol, nextRow);
        }
        else {
            return 1;
        }

    }
,   reset: function(options) {
        this.init(options);
    }
}

var board = {
    init: function(options) {
        this.options = options;
        this.diameter = this.options.diameter;
        this.columns = this.options.columns;
        this.rows = this.options.rows;
        this.width = this.columns * this.diameter;
        this.height = this.rows * this.diameter;
        this.colors = this.options.colors || ['red', 'yellow'];
        this.circles = [];

        this.canvas = d3.select("#board")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height + 5);
        this.drawGrid();
        this.drawButtons();
        this.events();
    }
,   drawGrid: function(){
        for (var i = 0; i <= this.rows; i++) {
            this.canvas.append("line")
                .attr("x1", 0)
                .attr("y1", i * this.diameter)
                .attr("x2", this.width)
                .attr("y2", i * this.diameter)
                .attr("stroke", "black")
                .attr("stroke-width", 0.5)
        }
        for (var j = 0; j <= this.columns; j++) {
            this.canvas.append("line")
                .attr("x1", j * this.diameter)
                .attr("y1", 0)
                .attr("x2", j * this.diameter)
                .attr("y2", this.height)
                .attr("stroke", "black")
                .attr("stroke-width", 0.5);
        }
    }
,   drawButtons: function(){
        //Draw invisible, clickable rectangles over the columns.
        for (var i = 0; i <= this.columns; i++) {
            this.canvas.append("rect")
                .attr("column", i)
                .attr("x", i * this.diameter)
                .attr("y", 0)
                .attr("width", this.diameter)
                .attr("height", this.height)
                .style("fill-opacity", 0);
        }
    }
,   drop: function(row, column, color){
        //Animate a colored piece drop to appropriate row.
        var cx = column * this.diameter
        ,   cy = row * this.diameter
        ,   circle = this.canvas.append("circle")
            .attr("cx", cx + this.diameter/ 2)
            .attr("cy", 0)
            .attr("r", (this.diameter / 2) - 1)
            .style("stroke", "black")
            .style("z-index", -1)
            .style("fill", color);

        circle.transition()
            .duration(350)
            .attr("cy", cy + this.diameter / 2)
            .ease("bounce")

        this.circles.push(circle);
    }
,   events: function() {
        var self = this;
        //Clicking a rectangle initiates drop logic for that column
        d3.selectAll("rect").on("click", function(){
            var column = +this.getAttribute("column");
            connectFour.drop(column);
        });
        //Reset the board and the engine
        d3.selectAll("#reset").on("click", function(){
            var cols = +document.querySelector("#cols").value || 7
            ,   rows = +document.querySelector("#rows").value || 6
            ,   winCond = +document.querySelector("#wincond").value || 4
            ,   diameter = cols > rows ? 500 / cols : 500 / rows
            ,   options = 
                {   columns: cols
                ,   rows: rows
                ,   winCondition: winCond
                ,   diameter: diameter
                }
            ;
            connectFour.reset(options);
        });
    }
,   reset: function(options) {
        //Drop circles from the bottom to emulate real Connect Four!
        var self = this
        ,   options = options
        ;
        this.circles.map(function(circle){
            var cy = +circle[0][0].getAttribute("cy");
            circle.transition()
                .duration(250)
                .attr("cy", cy + self.height + 10);
        });
        setTimeout(function () {
            self.canvas.remove();
            self.init(options)
        }, 250);
    }
}

connectFour.init();
