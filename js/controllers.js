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

sortListApp.controller("sortController", function ($scope, $location, listService, sortService, $timeout) {
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

	var finalCallback = function(list){
		listService.setList(list);
		$scope.progressPercentage = 100;
    	$location.path('/results');
	}

	sortService.recursiveBubble(list, 0, list.length, $scope.compare, finalCallback);

});


sortListApp.controller("resultsController", function ($scope, $location, listService, comparedService, $timeout) {

	var list = listService.getList().reverse();
	if(list.length == 0){
    	$location.path('/home');
	}

	var detailedList = {};
	for(var index in list){
		var element = list[index];
		detailedList[element] = comparedService.getCompared(element);
	}
	$scope.detailedList = detailedList;

	$scope.restartSort = function(){
    	$location.path('/home');
	}
});