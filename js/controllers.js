"use strict";

sortListApp.controller("homeController", function ($scope, $location, listService, comparedService, $timeout) {

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

	var list = listService.getList();
	if(list.length == 0){
		$scope.rawText = 
			"Everest\n"+
			"Mont Blanc\n"+
			"Anapurna\n"+
			"Kilimanjaro";
	} else {
		$scope.rawText = list.join("\n");
	}
	comparedService.resetComparisons();
	$scope.updateList();
	$timeout(function(){
		angular.element('#listcontent').trigger('autoresize');
	})

});

sortListApp.controller("sortController", function ($scope, $location, listService, comparedService, $timeout) {
	var list = listService.getList();
	var maxNumberOfComparisons = ((list.length)*(list.length-1))/2;
	var comparisons = 0;
	$scope.progressPercentage = 0;

	if(list.length == 0){
    	$location.path('/home');
	}

	$scope.sortAdjective = 'higher';

	$scope.compare = function(term1, term2, callbackIfFirst, callbackIfSecond){
		$scope.term1 = term1;
		$scope.term2 = term2;

		angular.element('#selectFirst').unbind().click(function(){
    		comparisons++;
    		$scope.progressPercentage = Math.round((comparisons/maxNumberOfComparisons)*100);
			callbackIfFirst();
		});
		angular.element('#selectSecond').unbind().click(function(){
    		comparisons++;
    		$scope.progressPercentage = Math.round((comparisons/maxNumberOfComparisons)*100);
			callbackIfSecond();
		});

		$timeout(function(){
			$scope.$apply();
		})
	}

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

	var finalCallback = function(list){
		listService.setList(list);
		$scope.progressPercentage = 100;
    	$location.path('/results');
	}

	recursiveBubble(list, 0, list.length, $scope.compare, finalCallback);

});


sortListApp.controller("resultsController", function ($scope, $location, listService) {

	$scope.list = listService.getList().reverse();
	if($scope.list.length == 0){
    	$location.path('/home');
	}

	$scope.restartSort = function(){
    	$location.path('/home');
	}
});