// this is your opponent in the real-time player to use for debugging 

var SimpleBot = {
    makeMove: function() {
      return (function(){
           var board = get_board();
           var myx = get_opponent_x();
           var myy = get_opponent_y();
           var fruits = [];

           board.forEach(function(row, x) {
              row.forEach(function(i, y) {
                 if (has_item(board[x][y])) {
                    fruits.push({'x':x,'y':y});
                 }
              })
           })

           // we found an item! take it!
           if (board[myx][myy] > 0) {
               return TAKE;
           }

           coords = fruits.shift();
           var x = coords['x'];
           var y = coords['y'];
           
           if (myx < x){
            console.log('xx', myx, x)
              return EAST;   
           }
           if (myx > x){
              return WEST;
           }
           if (myy < y){
              return SOUTH;
           }
           if (myy > y){
              return NORTH;
           }

           return PASS;
      })();
       //var e=get_board(),t=get_my_x(),n=get_my_y(),r=[];e.forEach(function(t,n){t.forEach(function(t,i){has_item(e[n][i])&&r.push({x:n,y:i})})});if(e[t][n]>0)return TAKE;coords=r.shift();var i=coords.x,s=coords.y;return t<i?EAST:t>i?WEST:n<s?SOUTH:n>s?NORTH:PASS
       // to disable to opponent, uncomment the next line
       //return PASS;

       SimpleBot.board = get_board();

       // we found an item! take it!
       if (has_item(SimpleBot.board[get_opponent_x()][get_opponent_y()])) {
           return TAKE;
       }

       // looks like we'll have to keep track of what moves we've looked at
       SimpleBot.toConsider = new Array();
       SimpleBot.considered = new Array(HEIGHT);
       for (var i = 0; i < WIDTH; i++) {
           SimpleBot.considered[i] = new Array(HEIGHT);
           for (var j = 0; j < HEIGHT; j++) {
               SimpleBot.considered[i][j] = 0;
           }
       }

       // let's find the move that will start leading us to the closest item
       return SimpleBot.findMove(new node(get_opponent_x(), get_opponent_y(), -1));
    },

    findMove: function(n) {
       // closest item! we will go to it
       if (has_item(SimpleBot.board[n.x][n.y]))
           return n.move;

       var possibleMove = n.move;

       // NORTH
       if (SimpleBot.considerMove(n.x, n.y-1)) {
           if (n.move == -1) {
               possibleMove = NORTH;
           } 
           SimpleBot.toConsider.push(new node(n.x, n.y-1, possibleMove));
       } 

       // SOUTH
       if (SimpleBot.considerMove(n.x, n.y+1)) {
           if (n.move == -1) {
               possibleMove = SOUTH;
           } 
           SimpleBot.toConsider.push(new node(n.x, n.y+1, possibleMove));
       } 

       // WEST
       if (SimpleBot.considerMove(n.x-1, n.y)) {
           if (n.move == -1) {
               possibleMove = WEST;
           } 
           SimpleBot.toConsider.push(new node(n.x-1, n.y, possibleMove));
       } 

       // EAST 
       if (SimpleBot.considerMove(n.x+1, n.y)) {
           if (n.move == -1) {
               possibleMove = EAST;
           } 
           SimpleBot.toConsider.push(new node(n.x+1, n.y, possibleMove));
       } 

       // take next node to bloom out from
       if (SimpleBot.toConsider.length > 0) {
           var next = SimpleBot.toConsider.shift();
           return SimpleBot.findMove(next);
       }

       // no move found
       return -1;
    },

    considerMove: function(x, y) {
       if (!SimpleBot.isValidMove(x, y)) return false;
       if (SimpleBot.considered[x][y] > 0) return false;
       SimpleBot.considered[x][y] = 1;
       return true;
    },

    isValidMove: function(x, y) {
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
            return false;
        return true;
    }
}

function node(x, y, move) {
    this.x = x;
    this.y = y;
    this.move = move;
}
