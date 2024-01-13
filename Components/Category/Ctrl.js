app.controller("CategoryCtrl", ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
//-------------------------------------------------- Environment variable
$(`#Modal_Category`).off("show.bs.modal");
$(`#Modal_Category`).on("show.bs.modal", async function () {
	$scope.$apply(() => {
		$scope.Category = angular.copy($rootScope.M4M.Category.data);
		$scope.Category.time = angular.copy($rootScope.M4M.Category.time);
		$timeout(() => {$scope.formChanged = false}, 10);
		$scope.LoadGird();
	})
});
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Environment variable



//-------------------------------------------------- Logic function
// AnLaVN - Update form changed status to [true]
$scope.ChangeForm = () => $scope.formChanged = true;

// AnLaVN - Update form changed status when data of Category change
$scope.$watch('Category', $scope.ChangeForm, true);

// AnLaVN - Load Draggable gird
$scope.LoadGird = function(){
	$('.category-gird').packery('destroy');
	$timeout(() => {
		var $grid = $('.category-gird').packery({itemSelector: '.category-item'});
		var $items = $grid.find('.category-item').draggable();
		$grid.packery('bindUIDraggableEvents', $items);
		$grid.find('.category-item').each((i, itemElem) => {
			var menu = itemElem.querySelector('.row>div:nth-child(3)>div>div');
			$rootScope.LoadEmojiMenu(menu.id, $scope.Category[i]);
		});

		function orderItems() {
			if(!$scope.formChanged) $scope.$apply(() => $scope.ChangeForm())
			var Category = [];
			$($grid.packery('getItemElements')).each((i, itemElem) => {
				Category.push({
					id:   $(itemElem).find('.row>div:nth-child(2)>input').val(), 
					icon: $(itemElem).find('.row>div:nth-child(3)>div>button').html(),
					name: $(itemElem).find('.row>div:nth-child(4)>input').val()
				});
			});
			$scope.Category = angular.copy(Category);
			$scope.LoadGird();
		}
		$grid.off('dragItemPositioned');
		$grid.on('dragItemPositioned', orderItems);
	}, 30);
}

// AnLaVN - Add Category to list
$scope.AddCategory = function(){
	if($scope.Category.every(e => e && e.id && e.name))  {
		$scope.Category.push({id:"", name:""})
		$scope.LoadGird();
	};
}

// AnLaVN - Delete Category from list
$scope.DelCategory = function(index){
	$scope.Category.splice(index, 1);
	$scope.LoadGird();
}

// AnLaVN - Save list Category to Firestore
$scope.SaveCategory = function(){
	let d = new Set(); let de;
	if($scope.Category.some(e => (d.has(e.id) && ((de = e), true)) || (d.add(e.id), false))) {
		$rootScope.AddNotifis(`Đã tồn tại Phân Loại[${de.id}] trong kho lưu trữ !`, "warning");
		return false;
	}
	var fireStore = angular.copy($rootScope.M4M.Category.name);
	var newData = {name: fireStore, data: JSON.parse(angular.toJson($scope.Category)), time: new Date()}
	M4Mfs.collection(M4M.AppName).doc(fireStore).set(newData).then(() => {
		$timeout(() => {$rootScope.AddNotifis(`Cập nhật kho lưu trữ ${fireStore} thành công.`, "success")}, 10);
		$('#Modal_Category').modal('hide');
	}).catch(error => {	
		$timeout(() => {$rootScope.AddNotifis(`Không thể cập nhật kho lưu trữ ${fireStore} !`, "danger")}, 10);
		console.log(error);
	});
}

// AnLaVN - Exit modify list Category
$scope.ExitCategory = function(){
	if(!$scope.formChanged || confirm("Các thay đổi về Phân Loại sẽ không được lưu ?")) $('#Modal_Category').modal("hide");
	else return;
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Logic function
}]);