app.controller("SendingCtrl", ["$scope", "$rootScope", "$location", "$timeout", "$translate", function ($scope, $rootScope, $location, $timeout, $translate) {
//-------------------------------------------------- Environment variable
$rootScope.AppPath = $location.path().substring($location.path().lastIndexOf("/"));
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;

// AnLaVN - Update form changed status when data of Sending change
$scope.$watch('M4M.Sending', $scope.ChangeForm, true);

// AnLaVN - Add Sending to list
$scope.AddSending = function(){
	if($rootScope.M4M.Sending.data.every(e => e && e.wallet && e.time && e.content && e.price))  {
		$rootScope.M4M.Sending.data.push(({...$rootScope.M4M.Sending.data.slice(-1)[0], content: "", price: 0}));
	};
}

// AnLaVN - Delete Sending from list
$scope.DelSending = index => $rootScope.M4M.Sending.data.splice(index, 1);

// AnLaVN - Save list Sending to Firestore
$scope.SaveSending = function(){
	const firestore = {name: $translate.instant('sending.name')};
	const newData = {data: angular.copy($rootScope.M4M.Sending.data.map(e => ({...e, price: Number(replaceCurrency(e.price || 0, false))}) )), time: new Date()};
	M4Mfs.collection(M4M.AppName).doc($rootScope.M4M.Sending.name).update(newData).then(() => {
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_success', firestore), "success")}, 10);
		$scope.formChanged = false;
	}).catch(error => {	
		$timeout(() => {$rootScope.AddNotifis($translate.instant('notifi.fs_update_error', firestore), "danger")}, 10);
		console.log(error);
	});
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);