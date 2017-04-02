
////////////////////////////////////////////////////////////////////////
//////////////////////////// NEW ASSET CTRL/////////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('newAssetCtrl' , function($rootScope, $scope , $stateParams, uuid4 , parseData, checkDupes , $state, reactivationVarService){
	//Date Picker
	$scope.datePicker = {};
	$scope.datePicker.date = {startDate: {_d:{}}, endDate: {_d:{}}};
	$scope.newAssetDate = {start:{_d:{}},end:{_d:{}}};
	$scope.newSiteModel = angular.copy($scope.modelTemplates.newSiteAsset)
    $scope.newSiteModel.type = 'SA';
	$scope.newSiteMode = {currentMode : ''};
	$scope.dateCheck;

	$scope.$on('reactivationVarServiceUpdated', function () {
		reactivationVarService.get()
	});
    $scope.$watch('datePicker.date', function(newDate) {
		$scope.tempNewDateStart = $scope.datePicker.date.startDate._d + '';
		$scope.tempNewDateEnd = $scope.datePicker.date.endDate._d + '';
		$scope.newAssetDate.start.month = $scope.monthConvert[$scope.tempNewDateStart.split(' ')[1]];
		$scope.newAssetDate.start.day = $scope.tempNewDateStart.split(' ')[2]
		$scope.newAssetDate.start.year = $scope.tempNewDateStart.split(' ')[3]

		$scope.newAssetDate.end.month = $scope.monthConvert[$scope.tempNewDateEnd.split(' ')[1]];
		$scope.newAssetDate.end.day = $scope.tempNewDateEnd.split(' ')[2]
		$scope.newAssetDate.end.year = $scope.tempNewDateEnd.split(' ')[3]
		
	    $scope.datePicker.status = angular.equals($scope.datePicker.date.startDate._d, {})
	    $scope.newSiteModel.url      = $scope.newAssetDate.start.month + $scope.newAssetDate.start.day + $scope.newAssetDate.start.year + $scope.newSiteModel.type;
	    $scope.newSiteModel.date      = $scope.newAssetDate.start.month + $scope.newAssetDate.start.day + $scope.newAssetDate.start.year;
	    $scope.newSiteModel.day       = $scope.newAssetDate.start.day;
	    $scope.newSiteModel.month     = $scope.newAssetDate.start.month;
	    $scope.newSiteModel.year      = $scope.newAssetDate.start.year;
	    $scope.newSiteModel.endDate   = $scope.newAssetDate.end.month + $scope.newAssetDate.end.day + $scope.newAssetDate.end.year  + $scope.newSiteModel.type;
	    $scope.newSiteModel.endDay    = $scope.newAssetDate.end.day;
	    $scope.newSiteModel.endMonth  = $scope.newAssetDate.end.month;
	    $scope.newSiteModel.endYear   = $scope.newAssetDate.end.year;
	    $scope.newSiteModel.uuid      = uuid4.generate();
		$scope.dateCheck = checkDupes.checkAssetDate($scope.siteData , $scope.newSiteModel.date)
    }, false);

	$scope.setAssetType = function(x){
		$scope.newSiteModel.type = x;
	    $scope.newSiteModel.date  = $scope.newAssetDate.start.month + $scope.newAssetDate.start.day + $scope.newAssetDate.start.year;
	    $scope.newSiteModel.url  = $scope.newAssetDate.start.month + $scope.newAssetDate.start.day + $scope.newAssetDate.start.year + $scope.newSiteModel.type;
		$scope.dateCheck = checkDupes.checkAssetDate($scope.siteData , $scope.newSiteModel.date)
	
	}
	$scope.newAssetMode = function(x){
		$scope.newSiteMode.currentMode = x;
	}
	$scope.cancelNewAssetMode = function(x){
	}
	$scope.saveNewSiteAsset = function(){
		//If Blank Asset
		if($scope.newSiteMode.currentMode == ''){
		    $scope.newSiteModel.homepageModules[0].uuid = uuid4.generate();
			$scope.newSiteModel.homepageModules[0].ctas[0].uuid = uuid4.generate();
		    $scope.newSiteModel.flyouts[0].uuid = uuid4.generate();
		    $scope.newSiteModel.globalAs[0].uuid = uuid4.generate();
		    $scope.newSiteModel.globalCs[0].uuid = uuid4.generate();
		    $scope.siteData.push(angular.copy($scope.newSiteModel));

		    $state.go('main.editor.sites', {id: $scope.newSiteModel.url});
		}
		//If Reactivation
		if($scope.newSiteMode.currentMode == 'reactivation'){
            var reactivationAssetData = angular.copy($scope.siteData[reactivationVarService.get().index])
            console.log(reactivationVarService.get().index)
            console.log($scope.siteData[reactivationVarService.get().index])
            reactivationAssetData.uuid = uuid4.generate()
            for(i = 0; i < reactivationAssetData.homepageModules.length; i++){
            	reactivationAssetData.homepageModules[i].uuid = uuid4.generate()
            	for(a = 0; a < reactivationAssetData.homepageModules[i].ctas.length; a++){
            		reactivationAssetData.homepageModules[i].ctas[a].uuid = uuid4.generate();
            	}
            }
            for(i = 0; i < reactivationAssetData.flyouts.length; i++){
            	reactivationAssetData.flyouts[i].uuid = uuid4.generate()
            }
            for(i = 0; i < reactivationAssetData.globalAs.length; i++){
            	reactivationAssetData.globalAs[i].uuid = uuid4.generate()
            }
            for(i = 0; i < reactivationAssetData.globalCs.length; i++){
            	reactivationAssetData.globalCs[i].uuid = uuid4.generate()
            }
            $scope.newSiteModel.homepageModules = reactivationAssetData.homepageModules
            $scope.newSiteModel.flyouts = reactivationAssetData.flyouts
            $scope.newSiteModel.globalAs = reactivationAssetData.globalAs
            $scope.newSiteModel.globalCs = reactivationAssetData.globalCs

		    $scope.siteData.push(angular.copy($scope.newSiteModel));
		    $state.go('main.editor.sites', {id: $scope.newSiteModel.url});
		}
		if($scope.newSiteMode.currentMode == 'template'){
			console.log('template')
		}
	}
});
