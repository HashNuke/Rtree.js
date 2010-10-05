/**
  Internal node structure: [nodeID] = {leafCheck=false, topLeft[], bottomRight[], entries[]}
  Leaf node structure: [entryID] = {leafCheck=true, topLeft[], bottomRight[], entries[]}
  
  Entry structure: [entryID] = {topRight, bottomLeft, objectID, childID}
*/

function RTree(){

  if(!this instanceof arguments.callee)
    return (new arguments.callee(arguments));

  var self = this;

  var minRootEntries = 2; //min entries for root
  var M = maxEntries || 4; //max entries in a node
  var m;

  // constructor
  function init(){
    self.nodes = [];  //have entryID
    self.entries = [];  //point to other nodes by nodeID
    m = minNodeEntries(); //calculate minimum number of entries for nodes
  };

  // calculate minimum entries for nodes
  function minNodeEntries () {
    return M/2;
  };
  
  function maxHeight () {
    // TODO Should return the number of data objects
    //return logN (minNodeEntries(), )
  };
  
  function logN (base, x) {
    if (base == 2)
      return Math.LOG2E * Math.log(x);
    else if (base == 10)
      return Math.LOG10E * Math.log(x);
    return ( Math.log(x) / Math.log(base) );
  };
  
  self.init();
};

RTree.prototype.addEntry = function(parentNode, topLeft, bottomRight, objectID){
  var entryID = self.entries.push({
                                    topLeft: topLeft
                                  , bottomRight: bottomRight
                                  , objectID: objectID
                                 });
  self.nodes[parentNode].entries.push(entryID);
  return entryID;
};

RTree.prototype.formatQuery = function(topLeft, bottomRight){
  return {topLeft: topLeft, bottomRight: bottomRight};
};

RTree.prototype.rangeSearch = function(rootNode, queryRect){

  var resultSet = [];
  var children = self.nodes[rootNode].entries;
  
  if (self.nodes[rootNode].leaf == false) {
    for(var i in children) {
      // check if the entry's MBR fits. if yes then search the child node      
      var nodeID = self.doesIntersect(quertRect, children[i]);
      if(nodeID!=false)
      {
        var tempResult = self.rangeSearch(nodeID, queryRect);
        resultSet = resultSet.concat(tempResult);
      }
    }
  }
  else
  {
    for(var i in children) {
      var objectID = self.doesIntersect(quertRect, children[i]);
      if(objectID!=false)
        resultSet[ self.getObjectID(children[i]) ] = children[i];
    }
    // the returned result is always matching entries from leaf nodes
    return resultSet.unique();
  }
};

RTree.prototype.doesIntersect = function(queryRect, entryID){
  //returns objectID if the entry is an object else return pointer to childNode
  var entry = self.entries[entryID];
  
  if(
      queryRect.topLeft[0]>=entry.topLeft[0]
      && queryRect.bottomRight[0]<=entry.bottomRight[0]
      && queryRect.topLeft[1]>=entry.topLeft[1]
      && queryRect.bottomRight[1]<=entry.bottomRight[1]
    )
    {
      if(entry.length==3)
        return entry.objectID;
      else
        return entry.childID;
    }
  else
    return false;
};


RTree.prototype.getObjectID = function(entryID){
  return self.entries[entryID].objectID;
};

RTree.prototype.insert = function(entry, node){
  
};
