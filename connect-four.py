"""
Model of Connect Four using a graph representation.

Why did I choose a graph representation?
    1) Check-for-win runs in CONSTANT TIME with
        *Every single move
        *Increases in # of players/colors
        *Increases in size of the board
    2) Check-for-win scales LINEARLY with 
        *Win-condition-rules (Connect-6, Connect-50)
    3) Initial building of the board scales linearly with space and time.
    4) Can dynamically add new nodes to the board at any time in constant 
        time and space without ruining constant-time check-for-win.

Why is a graph representation the wrong solution?
    1) The question did not ask to build a scalable Connect-4
        game. A graph representation is overkill for the problem.
    2) Time, space, and complexity overhead to set up the board.
"""

class Node(object):
    opposites = {
        'N':'S', 'S':'N', 'E':'W', 'W':'E',
        'NW':'SE', 'SE':'NW', 'NE':'SW', 'SW':'NE'
    }
    defaultAdjacent = {
        'N': None, 'E': None, 'W': None, 'S': 'Edge',
        'NE': None, 'NW': None, 'SE': None, 'SW': None
    }

    def __init__(self, color=None, adjacent=defaultAdjacent):
        self.color = color
        self.adjacent = adjacent.copy()

    def check_for_win(self):
        """
        Check adjacents for similar color every time a new move is played.

        Iterate through each of the adjacent nodes. If an adjacent node 
        is of the same color, then find the total length of the chain of
        same-color nodes.
        """
        for direction, node in self.adjacent.iteritems():
            if node and node.color == self.color:
                path_total = self.check_paths(direction, node)
                if path_total >= self.win_condition:
                    print "{0} wins with {1} in a row!".format(self.color, path_total)
                    break

    def check_paths(self, direction, node):
        """
        Find length of chain of same-color nodes in given direction
        AND the opposite direction. Return the total length of the
        chain.
        """
    #The initial node counts as 1.
        path_total = 1
    #First direction
        path_total += self.path_total(direction, node)
    #Opposite direction
        opposite_dir = self.opposites[direction]
        opposite_node = self.adjacent[opposite_dir]
        if opposite_node and opposite_node.color == self.color:
            path_total += self.path_total(opposite_dir, opposite_node)
        return path_total

    def path_total(self, direction, node):
        """
        Recursively determine length of chain of similarly colored nodes.
        """
        nextNode = node.adjacent[direction]
        if nextNode and nextNode.color == node.color:
            return 1 + self.path_total(direction, nextNode)
        else:
            return 1

class EntryPoint(object):
    """
    This is the entry point that can accept a new token and drop 
    it to the lowest empty node in its column.
    """
    def __init__(self, top):
        self.top = top      #Reference to highest node in this column.

    def new_move(self, color):
        if self.top.color is None:
            new_move = self.drop_to_bottom(self.top, color)
            return new_move
        else:               #If highest node is already colored.
            print "Column is Full"
            return False

    def drop_to_bottom(self, node, color):
        """
        Drop this colored token to the lowest node without color.
        """
        if node.adjacent['S'].color == None:
            self.drop_to_bottom(node.adjacent['S'], color)
        else:
            node.color == color
            return node

class Board(object):
    def __init__(self, win_condition=4):
        self.win_condition = win_condition
        self.node = Node()
        self.entries = [EntryPoint(self.node)]
    
    def move(self, entry_point, color):
        assert entry_point.new_move(color) is not False, 
        new_move = entry_point.new_move(color)
        self.check_for_win(new_move, self.win_condition)
        



if __name__ == "__main__":
    #Red Nodes
    n1, n2, n3 = Node(color='Red'), Node(color='Red'), Node(color='Red')
    n4, n5, n6 = Node(color='Red'), Node(color='Red'), Node(color='Red')
    #Yellow Nodes
    n7, n8, n9 = Node(color='Yellow'), Node(color='Yellow'), Node(color='Yellow') 
    n10, n11, n12 = Node(color='Yellow'), Node(color='Yellow'), Node(color='Yellow') 

    n1.adjacent['E'] = n2 
    n1.adjacent['W'] = n4
