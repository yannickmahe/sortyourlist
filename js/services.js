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

    var resetComparisons = function(){
      compared = {};
    }

    var setCompared = function(higher, lower){
      if(!(higher in compared)){
        compared[higher] = {}
      }
      if(!(lower in compared)){
        compared[lower] = {}
      }

      compared[higher][lower] = true;
      compared[lower][higher] = false;
    }

    var getCompared = function(element){
      if(element in compared){
        return compared[element];
      }
      return {};
    }

    var checkCompared = function(element1, element2){

      if(element1 in compared && element2 in compared[element1]){
        return compared[element1][element2];
      }

      return undefined;
    }

    resetComparisons();

    return {
      setCompared:      setCompared,
      checkCompared:    checkCompared,
      getCompared:      getCompared,
      resetComparisons: resetComparisons
    }
});

sortListApp.service('sortService', function(comparedService){

  var bubbleSort = function(list, startIndex, endIndex, compareFunction, finalCallback) {
      if(startIndex > endIndex){
          finalCallback(list);
      }

      if (startIndex == endIndex - 1) {
          bubbleSort(list, 0, endIndex - 1, compareFunction, finalCallback);
      } else {
        var callbackIfFirst = function(){
          comparedService.setCompared(list[startIndex], list[startIndex + 1]);
          var currentValue = list[startIndex];
          list[startIndex] = list[startIndex + 1];
          list[startIndex + 1] = currentValue;
          bubbleSort(list, startIndex + 1, endIndex, compareFunction, finalCallback);
        }

        var callbackIfSecond = function(){
          comparedService.setCompared(list[startIndex + 1], list[startIndex]);
          bubbleSort(list, startIndex + 1, endIndex, compareFunction, finalCallback);
        }

        var higher = comparedService.checkCompared(list[startIndex], list[startIndex+1]);
        if(higher === true){
          callbackIfFirst();
        } else if (higher === false){
          callbackIfSecond();
        } else {
          compareFunction(list[startIndex], list[startIndex+1], callbackIfFirst, callbackIfSecond);
        }

      }
  }



  return {
      bubbleSort: bubbleSort
  }
});