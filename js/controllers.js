"use strict";

sortListApp.controller("homeController", function ($scope, $location, listService) {

	$scope.rawText = 
		"Everest\n"+
		"Mont Blanc\n"+
		"Kilimanjaro";

	$scope.updateList = function(){
		$scope.list = $scope.rawText.split("\n");

		for(var i = 0; i < $scope.list.length; i++){
			if($scope.list[i] === ''){
				$scope.list.splice(i,1);
				i--;
			}
		}

		if($scope.list.length == 1 && $scope.list[0] == ''){
			$scope.list = [];
		}
	}

	$scope.startSort = function(){
		listService.setList($scope.list);
    	$location.path('/sort');
	}

	$scope.updateList();

});

sortListApp.controller("sortController", function ($scope, $location, listService, comparedService, $timeout) {
	var list = listService.getList();
	var comparisons = 0;

	if(list.length == 0){
    	$location.path('/home');
	}

	$scope.sortAdjective = 'higher';
	$scope.buttonsDisabled = true;

	$scope.compare = function(term1, term2, callbackIfFirst, callbackIfSecond){
		$scope.buttonsDisabled = false;
		$scope.term1 = term1;
		$scope.term2 = term2;
		$timeout(function(){
			$scope.$apply();
		})

		angular.element('#selectFirst').unbind().click(function(){
			$scope.buttonsDisabled = true;
			callbackIfFirst();
		});
		angular.element('#selectSecond').unbind().click(function(){
			$scope.buttonsDisabled = true;
			callbackIfSecond();
		});
	}

	var recursiveBubble = function(list, startIndex, endIndex, finalCallback) {
	    if(startIndex > endIndex){
	        finalCallback(list);
	    }

	    if (startIndex == endIndex - 1) {
	        recursiveBubble(list, 0, endIndex - 1, finalCallback);
	    } else {
	    	var callbackIfFirst = function(){

	    		comparedService.setCompared(list[startIndex], list[startIndex + 1]);

		        var currentValue = list[startIndex];
		        list[startIndex] = list[startIndex + 1];
		        list[startIndex + 1] = currentValue;
	        	recursiveBubble(list, startIndex + 1, endIndex, finalCallback);
	    	}

	    	var callbackIfSecond = function(){

	    		comparedService.setCompared(list[startIndex + 1], list[startIndex]);

	        	recursiveBubble(list, startIndex + 1, endIndex, finalCallback);
	    	}

	    	var higher = comparedService.checkCompared(list[startIndex], list[startIndex+1]);
	    	if(higher === true){
	    		callbackIfFirst();
	    	} else if (higher === false){
	    		callbackIfSecond();
	    	} else {
	    		$scope.compare(list[startIndex], list[startIndex+1], callbackIfFirst, callbackIfSecond);
	    		console.log(++comparisons);
	    	}

	    }
	}

	var finalCallback = function(list){
		listService.setList(list);
    	$location.path('/results');
	}

	recursiveBubble(list, 0, list.length, finalCallback);

});


sortListApp.controller("resultsController", function ($scope, $location, listService) {

	$scope.list = listService.getList().reverse();
	if($scope.length == 0){
    	$location.path('/home');
	}
});