app.controller("SpendsCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$filter", "$translate", function ($scope, $rootScope, $location, $timeout, $filter, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
$scope.Spends = [];
let firestore = {name: $translate.instant('spends.name')};
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;
$scope.Change = e => e.changed = true;

// AnLaVN - Update form changed status when data of Spends change
$scope.$watch('Spends', $scope.ChangeForm, true);

let index = 0
$scope.LoadMoreData = function(){
	var isChanged = $scope.formChanged;
	$scope.Spends = $scope.Spends.concat($rootScope.M4M.Spends.data.slice(index, index + M4M.FirebaseRow));
	index += M4M.FirebaseRow;
	if(!isChanged) $timeout(() => $scope.formChanged = isChanged);
}

// AnLaVN - Add Spends to list
$scope.AddSpends = () => {
	if($scope.Spends.every(e => e && e.category && e.wallet && e.time && e.content && e.price))  {
		let last = angular.copy($scope.Spends.slice(-1)[0]);
		last.id = uid();
		last.time = $rootScope.viewTime(last.time).getDate() == new Date().getDate() ? last.time : new Date();
		last.content = "";
		last.price = 0;
		$scope.Spends.unshift(last);
		$rootScope.M4M.Spends.data.unshift(last);
		$("#ScrollTop").click();
	};
}

// AnLaVN - Delete Spends from list
$scope.DelSpends = index => {
	$scope.Spends.splice(index, 1);
	$rootScope.M4M.Spends.data.splice(index, 1);
}

// AnLaVN - Save list Spends to Firestore
$scope.SaveSpends = function(){
	firestore = {name: $translate.instant('spends.name')};
	const changedData = $scope.Spends.filter(e => e.changed);
	const newData = {
		time: new Date(),
		data: angular.copy($filter('orderBy')($rootScope.M4M.Spends.data, "-time").map(e => {
			var item = changedData.find(i => i.id == e.id) || e;
			item.price = Number(replaceCurrency(item.price || 0, false));
			const {changed, ...itemWithoutChanged} = item;
			return itemWithoutChanged;
		}))
	};
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