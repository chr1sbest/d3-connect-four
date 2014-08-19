connectFour.testVertical = function() {
        /*
        Vertical Test
          Y
        R Y
        R Y
        R Y
        */

        this.reset();
        console.log("Yellow should win")
        this.drop(1); //yellow
        this.drop(0); //red
        this.drop(1); //yellow
        this.drop(0); //red
        this.drop(1); //yellow
        this.drop(0); //red
        this.drop(1); //yellow wins
};

connectFour.testHorizontal = function() {
        /*
        Horizontal Test
        Y Y Y
        R R R R Y
        */

        this.reset();
        console.log("Red should win")
        this.drop(5); //yellow
        this.drop(0); //red
        this.drop(0); //yellow
        this.drop(1); //red
        this.drop(1); //yellow
        this.drop(2); //red
        this.drop(2); //yellow
        this.drop(3); //Red Wins
};

connectFour.testDiagonal1 = function() {
        /*
        Diagonal Test
              Y
          R Y Y
        R Y Y R 
        Y R R R
        */

        this.reset();
        console.log("Yellow should win")
        this.drop(0); //yellow
        this.drop(1); //red
        this.drop(1); //yellow
        this.drop(2); //red
        this.drop(2); //yellow
        this.drop(3); //red
        this.drop(2); //yellow
        this.drop(3); //red
        this.drop(3); //yellow
        this.drop(1); //red
        this.drop(3); //Yellow Wins
};

connectFour.testDiagonal2 = function() {
        /*
        Diagonal Test
        R 
        Y R Y Y
        R R R Y 
        Y Y Y R
        */

        this.reset();
        console.log("Red should win")
        this.drop(0); //yellow
        this.drop(0); //red
        this.drop(0); //yellow
        this.drop(0); //red
        this.drop(1); //yellow
        this.drop(1); //red
        this.drop(2); //yellow
        this.drop(2); //red
        this.drop(2); //yellow
        this.drop(3); //red
        this.drop(3); //yellow
        this.drop(1); //Red Wins!
};

connectFour.testConnect5 = function() {
        /*
        Connect 5 Vertical Test
          Y
        R Y
        R Y
        R Y
        R Y
        R Y
        */

        this.reset({columns: 7, rows: 6, winCondition: 5})
        console.log("Yellow should win")
        this.drop(1); //yellow
        this.drop(0); //red
        this.drop(1); //yellow
        this.drop(0); //red
        this.drop(1); //yellow
        this.drop(0); //red
        this.drop(1); //yellow
        this.drop(0); //red
        this.drop(1); //yellow
        this.drop(0); //red
        this.drop(1); //yellow wins
};
