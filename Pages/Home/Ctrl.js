app.controller("HomeCtrl", ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
$scope.Author = M4M.AppAuthor;
$scope.AppName = M4M.AppName;
$scope.copyright = new Date().getFullYear();
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable
}]);