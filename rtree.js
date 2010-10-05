/**
  Internal node structure: [nodeID] = {leafCheck=false, topLeft[], bottomRight[], entries[]}
  Leaf node structure: [entryID] = {leafCheck=true, topLeft[], bottomRight[], entries[]}
  
  Entry structure for internal node: [entryID] = {topRight, bottomLeft, childID, parentID, object=false}
  Entry structure for leaf: [entryID] = {topRight, bottomLeft, objectID, parentID, object=true}
*/

function RTree(){

  if(!this instanceof arguments.callee)
    return (new arguments.callee(arguments));

  var self = this;
  
  self.minRootEntries = 2; //min entries for root
  self.M = maxEntries || 4; //max entries in a node

  //TODO do check for re-setting this
  self.rootNodeID = null; // root nodeID
  
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


RTree.prototype.addLeafEntry = function(parentNode, topLeft, bottomRight, objectID){
  
  self.entries[objectID] = {
                              topLeft: topLeft
                            , bottomRight: bottomRight
                            , objectID: objectID
                            , parentID: parentNode
                            , object: true
                           };
  self.nodes[parentNode].entries.push(objectID);
  return objectID;
};


RTree.prototype.addEntry = function(parentNode, topLeft, bottomRight, nodeID){
  
  self.entries[objectID] = {
                              topLeft: topLeft
                            , bottomRight: bottomRight
                            , objectID: objectID
                            , parentID: parentNode
                            , object: false
                           };
  self.nodes[parentNode].entries.push(objectID);
  return objectID;
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
      if(children[i]!=undefined)
      {
        var nodeID = self.doesIntersect(quertRect, children[i]);
        if(nodeID!=false)
        {
          var tempResult = self.rangeSearch(nodeID, queryRect);
          resultSet = resultSet.concat(tempResult);
        }
      }
    }
  }
  else
  {
    for(var i in children) {
      if(children[i]!=undefined)
      {
        var objectID = self.doesIntersect(quertRect, children[i]);
        if(objectID!=false)
          resultSet[ self.getObjectID(children[i]) ] = children[i];
      }
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
      if(entry.object==true)
        return entry.objectID;
      else
        return entry.childID;
    }
  else
    return false;
};

RTree.prototype.getObjectID = function(entryID){
  //this is only meant for leaf node entries
  return self.entries[entryID].objectID;
}

RTree.prototype.getEntry = function(entryID){
  return self.entries[entryID];
};

RTree.prototype.insert = function(entry, node){
  
};

RTree.prototype.condenseTree = function(leafNode){
  
};

RTree.prototype.deleteEntry = function(objectID){
  /*
    a small variation to the usual delete operation in R-Trees
    since objectID == entryID for leaf entries
    take advantage of the data structure used here
    traversing can be omitted => increases speed
  */
  
  var leafNodeID = self.entries[objectID].parentID;
  delete(self.entries[objectID]);
  
  //clean up beigns
  self.condenseTree(leafNodeID);
  
  if(self.rootNodeID!=null 
    && self.nodes[rootNodeID].entries.length==1 
    && self.nodes[rootNodeID].leaf==false
  )
  {
    var childID = self.getEntry(self.nodes[rootNodeID].entries[0]).childID;
    delete(self.nodes[rootNodeID]);
    self.rootNodeID = childID;
  }
};
