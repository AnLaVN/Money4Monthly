app.controller("ConfigCtrl", ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
//-------------------------------------------------- Environment variable
$scope.config = null;
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable

//-------------------------------------------------- Logic function
// AnLaVN - Get config firebase from local function
$scope.getConfig = function(){
	var config = localStorage.getItem(M4M.FirebaseConfig);
	$scope.config = config ? JSON.parse(config) : null;
}
// AnLaVN - Set config firebase to local function
$scope.setConfig = function(){
	localStorage.setItem(M4M.FirebaseConfig, JSON.stringify(JSON.parse($scope.config)));
	$scope.setUpConfig();
}
// AnLaVN - Setup config firebase function
$scope.setUpConfig = function(){
	$scope.getConfig();
	if($scope.config){
		firebase.initializeApp($scope.config);	
		M4Mdb = firebase.firestore();
		$timeout(() => $rootScope.AddNotifis("Kết nối thành công với Firebase", "success"));

		var fireStores = ["Wallet", "Income", "Sending"]
		for (let i in fireStores) {
			let fireStore = fireStores[i];
			let db = M4Mdb.collection(M4M.AppName).doc(fireStore);
			function onSnapshotFireStore(){
				db.onSnapshot(newData => {
					$scope.$apply(() => $rootScope.M4M[fireStore] = newData.data())
				});
			}
			db.get().then(data => {	
				if (data.exists) onSnapshotFireStore();
				else db.set({}).then(() => {
					$timeout(() => {$rootScope.AddNotifis(`Khởi tạo kho lưu trữ ${fireStore} thành công.`, "success")}, 10);
					onSnapshotFireStore();
				}).catch(error => {	
					$timeout(() => {$rootScope.AddNotifis(`Không thể khởi tạo kho lưu trữ ${fireStore} !`, "danger")}, 10);
					console.log(error);
				});
			}).catch(error => {	
				$timeout(() => {$rootScope.AddNotifis(`Không thể truy cập kho lưu trữ ${fireStore} !`, "warning")}, 10);
				console.log(error);
			});
		}
	} else $timeout(() => {$('#Modal_Config').modal("show")}, 300);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
angular.element(() => $scope.setUpConfig());
}]);