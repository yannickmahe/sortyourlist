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

    var resetComparisons = function(){
      compared = [];
    }

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
      checkCompared: checkCompared,
      resetComparisons: resetComparisons
    }
});

sortListApp.service('sortService', function(comparedService){
  var recursiveBubble = function(list, startIndex, endIndex, compare, finalCallback) {
      if(startIndex > endIndex){
          finalCallback(list);
      }

      if (startIndex == endIndex - 1) {
          recursiveBubble(list, 0, endIndex - 1, compare, finalCallback);
      } else {
        var callbackIfFirst = function(){

          comparedService.setCompared(list[startIndex], list[startIndex + 1]);

            var currentValue = list[startIndex];
            list[startIndex] = list[startIndex + 1];
            list[startIndex + 1] = currentValue;
            recursiveBubble(list, startIndex + 1, endIndex, compare, finalCallback);
        }

        var callbackIfSecond = function(){

          comparedService.setCompared(list[startIndex + 1], list[startIndex]);

            recursiveBubble(list, startIndex + 1, endIndex, compare, finalCallback);
        }

        var higher = comparedService.checkCompared(list[startIndex], list[startIndex+1]);
        if(higher === true){
          callbackIfFirst();
        } else if (higher === false){
          callbackIfSecond();
        } else {
          compare(list[startIndex], list[startIndex+1], callbackIfFirst, callbackIfSecond);
        }

      }
  }

  return {
      recursiveBubble: recursiveBubble
  }
});