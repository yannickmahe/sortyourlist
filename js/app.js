"use strict";

var sortListApp = angular.module('sortListApp', ['ngRoute','ngResource','ui.materialize']);

sortListApp.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller : 'homeController'
        })
        .when('/sort', {
            templateUrl: 'partials/sort.html',
            controller : 'sortController'
        })
        .when('/results', {
            templateUrl: 'partials/results.html',
            controller : 'resultsController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});
