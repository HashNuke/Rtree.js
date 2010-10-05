/**
  Internal node structure: [nodeID] = {leafCheck=false, topLeft[], bottomRight[], entries[]}
  Leaf node structure: [entryID] = {leafCheck=true, topLeft[], bottomRight[], entries[]}
  
  Entry structure: [entryID] {topRight, bottomLeft, objectID}
*/

function RTree(){

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
}

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
}

RTree.prototype.rangeSearch = function(rootNode, queryRect){

  var resultSet = [];
  var children = self.nodes[rootNode].entries;
  
  if (self.nodes[rootNode].leaf == false) {
    for(var i in children) {
      var tempResult = self.rangeSearch(children[i], queryRect);
      resultSet = resultSet.concat(tempResult).unique();
    }
  }
  else
  {
    for(var i in children) {
      var check = self.doesIntersect(quertRect, children[i]);
      if(check!=false)
        resultSet[ self.getObjectID(children[i]) ] = children[i];
      else
        return false;
    }
  }
  return resultSet;
};


RTree.prototype.doesIntersect = function(queryRect, entryID){
  //returns objectID if intersects
  var entry = self.entries[entryID];
  
  if(
      queryRect.topLeft[0]>=entry.topLeft[0]
      && queryRect.bottomRight[0]<=entry.bottomRight[0]
      && queryRect.topLeft[1]>=entry.topLeft[1]
      && queryRect.bottomRight[1]<=entry.bottomRight[1]
    )
    return entry.objectID;
  else
    return false;
};


RTree.prototype.getObjectID = function(entryID){
  // don't handle exception here
  return self.entries[entryID].objectID;
};

RTree.prototype.someFunc = function(){
  //TODO
};
