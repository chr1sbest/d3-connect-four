var connectFour = {
    init: function(options) {
        this.options = options || {};
        this.options.diameter = this.options.diameter || 50;
        this.options.columns = this.options.columns || 7;
        this.options.rows = this.options.rows || 6;
        this.options.colors = this.options.colors || ['red', 'yellow'];
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
,   reset: function() {
        this.engine.reset(this.options);
        this.board.reset(this.options);
    }
}

var engine = {
    init: function(options) {
        this.options = options;
        this.columns = this.options.columns;
        this.rows = this.options.rows;
        this.colors = this.options.colors
        this.matrix = this.buildMatrix()
    }
,   buildMatrix: function(){
        var matrix = [null, null, null, null, null, null, null];
        for (var i = 0; i <= this.columns; i++) {
            matrix[i] = 0;
        }
        return matrix
    }
,   checkDrop: function(column){
        this.matrix[column] += 1
        return 6 - this.matrix[column];
    }
,   drop: function(row, column, color){
        //Execute Drop
        this.checkWin()
    }
,   checkWin: function(){
        //Check the board for a win
    }
,   reset: function(options) {
        this.matrix = this.buildMatrix();
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
        //Draw invisible rectangles as clickable buttons for the user.
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
        //Clicking a rectangle initiates drop logic for that column.
        d3.selectAll("rect").on("click", function(){
            var column = +this.getAttribute("column");
            connectFour.drop(column);
        });
        d3.selectAll("#reset").on("click", function(){
            connectFour.reset();
        });
    }
,   reset: function(options) {
        var self = this;
        //Drop circles from the bottom to emulate real Connect Four!
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
