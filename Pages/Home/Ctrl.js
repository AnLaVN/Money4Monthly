app.controller("HomeCtrl", ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);