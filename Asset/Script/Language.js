app.config(function ($translateProvider) {
	$translateProvider.preferredLanguage('vi_VN');
	$translateProvider.useLoader('loadLanguages');
	$translateProvider.useLocalStorage();
	$translateProvider.useSanitizeValueStrategy('escape');
});

app.factory('loadLanguages', function ($http, $q) {
	return function (options) {
		var deferred = $q.defer();
		$http.get(`Asset/Languages/${options.key}.json`).then(
			(res)=>{deferred.resolve(res.data)},
			()=>{deferred.reject(options.key)}
		);
		return deferred.promise;
	};
});