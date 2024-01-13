app.controller("ConfigCtrl", ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
//-------------------------------------------------- Environment variable
$scope.config = null;
$scope.FirebaseConfig = M4M.FirebaseConfigExample;
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = function(){
	$scope.formChanged = true;
}

// AnLaVN - Get config firebase from local function
$scope.getConfig = function(){
	$scope.$apply(() => $scope.config = localStorage.getItem(M4M.FirebaseConfig) || null);
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
		firebase.initializeApp(JSON.parse($scope.config));	
		M4Mfs = firebase.firestore();
		$timeout(() => $rootScope.AddNotifis("Kết nối thành công với Firebase", "success"));

		for (let i in $rootScope.M4M) {
			let fireStore = $rootScope.M4M[i].name;
			let db = M4Mfs.collection(M4M.AppName).doc(fireStore);
			function onSnapshotFireStore(){
				db.onSnapshot(newData => {
					$scope.$apply(() => $rootScope.M4M[fireStore] = newData.data())
				});
			}
			db.get().then(data => {	
				if (data.exists) onSnapshotFireStore();
				else db.set({...($rootScope.M4M[fireStore]), data: [], time: new Date()}).then(() => {
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