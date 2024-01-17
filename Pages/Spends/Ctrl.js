app.controller("SpendsCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$filter", "$translate", function ($scope, $rootScope, $location, $timeout, $filter, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
$scope.Spends;
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;

// AnLaVN - Update form changed status when data of Spends change
$scope.$watch('Spends', $scope.ChangeForm, true);

$scope.LoadSpends = function(){
	console.log("load")
	$scope.Spends = angular.copy($rootScope.M4M.Spends.data.slice(-10));
}

let indexData = 1;
$scope.loadMore = function(){

}

// AnLaVN - Add Spends to list
$scope.AddSpends = function(){
	if($scope.Spends.every(e => e && e.category && e.wallet && e.time && e.content && e.price))  {
		let last = angular.copy($scope.Spends.slice(-1)[0]);
		last.time = $rootScope.viewTime(last.time).getDate() == new Date().getDate() ? last.time : new Date();
		$scope.Spends.push(({...last, content: "", price: 0}));
	};
}

// AnLaVN - Delete Spends from list
$scope.DelSpends = index => $scope.Spends.splice(index, 1);

// AnLaVN - Save list Spends to Firestore
$scope.SaveSpends = function(){
	const firestore = {name: $translate.instant('spends.name')};
	const newData = {data: angular.copy($filter('orderBy')($rootScope.M4M.Spends.data, "time").map(e => ({...e, price: Number(replaceCurrency(e.price || 0, false))}) )), time: new Date()};
	M4Mfs.collection(M4M.AppName).doc($rootScope.M4M.Spends.name).update(newData).then(() => {
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_success', firestore), "success")}, 10);
		$scope.formChanged = false;
	}).catch(error => {	
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_error', firestore), "danger")}, 10);
		console.log(error);
	});
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);