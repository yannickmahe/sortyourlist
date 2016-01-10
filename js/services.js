sortListApp.service('listService', function() {
  var list = [];

  var setList = function(myList){
    list = myList;
  }

  var getList = function(){
      return list;
  };

  return {
    setList: setList,
    getList: getList
  };

});

sortListApp.service('comparedService', function(){

    var compared = [];

    var setCompared = function(higher, lower){
      if(!(higher in compared)){
        compared[higher] = []
      }
      if(!(lower in compared)){
        compared[lower] = []
      }

      compared[higher][lower] = true;
      compared[lower][higher] = false;
    }

    var checkCompared = function(element1, element2){

      if(element1 in compared && element2 in compared[element1]){
        return compared[element1][element2];
      }

      return undefined;
    }

    return {
      setCompared: setCompared,
      checkCompared: checkCompared
    }
});