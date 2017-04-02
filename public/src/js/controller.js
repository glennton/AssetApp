//// Want to's
// Add notification panel on bottom
// reactivation popup with more info
// redo $('.choose-reactivation-assets').removeClass('active');

app.run(function($rootScope , loadData, $http, siteAssetDataService){
	 $rootScope.postJson = function(){
	 	$http.get()
	 }

    $rootScope.postJson = function() {
	    siteAssetDataService.get({'_id':'58e03e1d17e5c304a617f0b3','test':'3'}).then(function(d){
	    	console.log(d)
	    })
	}


})

////////////////////////////////////////////////////////////////////////
////////////////////////////// MAIN CTRL ///////////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('mainCtrl' , function($scope, $http, $state , $stateParams, $rootScope, parseData){

    $scope.months = [{'month': 'Jan', 'date' : '01'},{'month': 'Feb', 'date' : '02'},{'month': 'Mar', 'date' : '03'},{'month': 'Apr', 'date' : '04'},{'month': 'May', 'date' : '05'},{'month': 'Jun', 'date' : '06'},{'month': 'Jul', 'date' : '07'},{'month': 'Aug', 'date' : '08'},{'month': 'Sep', 'date' : '09'},{'month': 'Oct', 'date' : '10'},{'month': 'Nov', 'date' : '11'},{'month': 'Dec', 'date' : '12'}]
	//Editor VARS
    //$scope.modelTemplates = {};

    $scope.assetTypeClass = function(x){
    	if(x == 'SA'){return 'typeSiteAsset'}
    	if(x == 'RA'){return 'typeReactivation'}
    	if(x == 'LP'){return 'typeLandingPage'}
    }
	//Debugger
	$rootScope.debugWindow = false;
    $rootScope.debugger = function(){
    	$rootScope.debugWindow = !$rootScope.debugWindow
    }
    $rootScope.editMode = false
    $rootScope.toggleEdit = function(){
    	$rootScope.editMode = !$rootScope.editMode
    }
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// EDITOR CTRL //////////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('editorCtrl' , function($scope , $stateParams, parseData, reactivationVarService, siteAssetVarService, siteAssetDataService, siteAssetData){
	//On Load, Pull Data, and store locally
	$scope.siteData = siteAssetData
	$scope.$on('siteAssetDataUpdated', function () {
		siteAssetDataService.get().then(function(d){
			$scope.siteData = d;
		});
	});
	//Resets
	reactivationVarService.clear()
	siteAssetVarService.clear()
	//INIT REACTIVATION VARIABLES
	$scope.reactivationVars = reactivationVarService.get()
	$scope.$on('reactivationVarServiceUpdated', function () {
		if(reactivationVarService.get().url != null){
			var getReactivationIndex = parseData.siteAssetIndex($scope.siteData,reactivationVarService.get().url, 'url')
			reactivationVarService.push([{'index' : getReactivationIndex}],false)
		}
		$scope.reactivationVars = reactivationVarService.get()
	});
	//INIT ASSET NAV VARIABLES
	$scope.siteAssetVars = siteAssetVarService.get()
	$scope.$on('siteAssetVarServiceUpdated', function () {
		$scope.siteAssetVars = siteAssetVarService.get()
	});


	$scope.cancelReactivationMode = function(){
        reactivationVarService.clear();
	}	
	$scope.assetNavToggles = {assetListDate: null , assetListMonth: null};
	$scope.monthConvert = {  "Jan": "01",  "Feb": "02",  "Mar": "03",  "Apr": "04",  "May": "05",  "Jun": "06",  "Jul": "07",  "Aug": "08",  "Sep": "09",  "Oct": "10",  "Nov": "11",  "Dec": "12"}
	
	//Reactivation VARS
	$scope.reactivationModel = {'reactivationAsset':{}};
	$scope.tempData = {}
	$scope.tempDataModel = {
		"homepageModules" : {
			'tempList' : [],
			'tempData' : []
		},
		"flyouts" : {
			'tempList' : [],
			'tempData' : []
		},
		"globalAs" : {
			'tempList' : [],
			'tempData' : []
		},
		"globalCs" : {
			'tempList' : [],
			'tempData' : []
		}
	};
	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else if(phase == null){ 
			fn();
		} else {
			this.$apply(fn);
		}
	};

});

////////////////////////////////////////////////////////////////////////
///////////////////// SITE ASSET - REACTIVATE ADD //////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('reactivateAddCtrl' , function($scope , $stateParams){

});

////////////////////////////////////////////////////////////////////////
///////////////////////////// SITE ASSETS //////////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('assetCtrl' , function($scope , $rootScope, $stateParams ,$state , parseData, parseDate, siteAssetVarService,reactivationVarService, siteAssetDataService, siteAssetData){

	//////////////////////////// INITS ////////////////////////////
	delete $scope.tempCoreInfo
	reactivationVarService.clear()
	siteAssetVarService.clear()
	//Set VARS / Default vars if no asset loaded
	if($stateParams.id == ""){
		siteAssetVarService.push({page : 'editor'})
	}else{
		siteAssetVarService.push({page : 'asset'})
	    siteAssetDataService.get({url:$stateParams.id}).then(function(d){
	    	$scope.tempCoreInfo = d
	    	//SETS FIRST TIME SITE VARS
			siteAssetVarService.init($scope.tempCoreInfo)

		    //INIT CALENDAR FROM SAVED DATA
			$scope.datePicker = {};
			$scope.datePicker.date = {
				startDate: $scope.tempCoreInfo.year+'-'+$scope.tempCoreInfo.month+'-'+$scope.tempCoreInfo.day, 
				endDate: $scope.tempCoreInfo.endYear+'-'+$scope.tempCoreInfo.endMonth+'-'+$scope.tempCoreInfo.endDay 
			};

		    //WHEN DATE PICKER UPDATED
		    $scope.$watch('datePicker.date', function(newDate) {
		    	if($scope.datePicker.date.startDate._d != null){
		    		//PARSE DATEPICKER DATA
			    	var parsedDate = parseDate.stringToObj($scope.datePicker.date.startDate._d , $scope.datePicker.date.endDate._d)
			    	//UPDATE DATE VARS
			    	siteAssetVarService.push(parsedDate);
			    	//UPDATE LOCAL DATE VARS
			    	$scope.refreshLocalDate()
			    	
		    	}
		    	//console.log($scope.tempCoreInfo)
		    }, false);
	    })
	}

	//Init Sortable
    $scope.sortableOptions = {
        stop: function(e, ui) { 
	  		$rootScope.$broadcast('resortEvent');
        }
    }
	$scope.refreshLocalDate = function(){
		$scope.tempCoreInfo.date = siteAssetVarService.get().date;
		$scope.tempCoreInfo.day = siteAssetVarService.get().day;
		$scope.tempCoreInfo.month = siteAssetVarService.get().month;
		$scope.tempCoreInfo.year = siteAssetVarService.get().year;
		$scope.tempCoreInfo.endDate = siteAssetVarService.get().endDate;
		$scope.tempCoreInfo.endDay = siteAssetVarService.get().endDay;
		$scope.tempCoreInfo.endMonth = siteAssetVarService.get().endMonth;
		$scope.tempCoreInfo.endYear = siteAssetVarService.get().endYear;
		$scope.tempCoreInfo.url = siteAssetVarService.get().month + siteAssetVarService.get().day + siteAssetVarService.get().year + siteAssetVarService.get().type;
	}
	$scope.refreshURL = function(){
		$scope.tempCoreInfo.url = siteAssetVarService.get().date
	}

	//Calendar Trigger
	$scope.changeAssetType = function(x){
		siteAssetVarService.push({type:x});
		$scope.refreshLocalDate()
	}

	$scope.setFlyoutLocation = function(flyoutName , parentUUID){
		var flyoutIndex = parseData.uuidToIndex($scope.tempCoreInfo.flyouts , parentUUID);
		var locationIndex = parseData.locToIndex($scope.tempCoreInfo.flyouts[flyoutIndex].location , flyoutName);
		$scope.tempCoreInfo.flyouts[flyoutIndex].location[locationIndex].active = !$scope.tempCoreInfo.flyouts[flyoutIndex].location[locationIndex].active
	}

    //Open Reactivation Tool
    $scope.toggleReactivation = function(x){
    	reactivationVarService.push(x)
    }

    //Save
    $scope.assetSave = function(parentUUID){
    	//Reset Vars after save
	    siteAssetDataService.update($scope.tempCoreInfo).then(function(d){
			$state.go('main.editor.sites', {id: siteAssetVarService.get().url});
			reactivationVarService.clear()
	    })
    }

    //Cancel
    $scope.assetCancel = function(){
    	delete $scope.tempCoreInfo
    	//$$$$$$ $scope.tempCoreInfo = angular.copy($scope.siteData[$scope.currentAsset.currentIndex])
    }

    //Set Module Columns
    $scope.setModuleColumns = function(col , parentUUID){
        var hpModIndex =  parseData.uuidToIndex($scope.tempCoreInfo.homepageModules , parentUUID);
    	$scope.tempCoreInfo.homepageModules[hpModIndex].columns = col
    }

    //Delete Modules
    $scope.deleteModule = function(parentUUID){
        var hpModIndex =  parseData.uuidToIndex($scope.tempCoreInfo.homepageModules , parentUUID);
    	$scope.tempCoreInfo.homepageModules.splice(hpModIndex,1);
    }

    //Delete Secondary Modules
    $scope.deleteSecondaryModule = function(UUID , assetType){
	    var modIndex =  parseData.uuidToIndex($scope.tempCoreInfo[assetType] , UUID);
    	$scope.tempCoreInfo[assetType].splice(modIndex,1);
    }

    //Delete Module CTA
    $scope.deleteModuleCTA = function(parentUUID , ctaUUID){
        var hpModIndex =  parseData.uuidToIndex($scope.tempCoreInfo.homepageModules , parentUUID);
        var ctaIndex =  parseData.uuidToIndex($scope.tempCoreInfo.homepageModules[hpModIndex].ctas , ctaUUID);
        $scope.tempCoreInfo.homepageModules[hpModIndex].ctas.splice(ctaIndex,1);
    }

    $scope.reorderTracking = function(){
    	var modules = $scope.tempCoreInfo.homepageModules;
    	var modulesLength = $scope.tempCoreInfo.homepageModules.length;
    	var ctaTracking;
    	var bgctaTracking;
    	var bgTrackingType;
    	var ctaTrackingType;
    	function iterateArray(){

    	}
    	for(i = 0; i < modulesLength; i++){
    		var modulePosition = '0' + (modules[i].rowPosition + 1)
    		if(modules[i].rowPosition == 0){
    			bgTrackingType = 'HEROIMAGE'
    			ctaTrackingType = 'HERO'
    		}else{
    			bgTrackingType = 'BTMIMAGE'
    			ctaTrackingType = 'BTM'
     		}
     		var bgctasplit = modules[i].bgcta.tracking.split('-_-')
     		modules[i].bgcta.tracking = bgctasplit[0] + '-_-'+ bgctasplit[1].split('_')[0] + '_' + modulePosition + bgTrackingType + '-_-' + bgctasplit[2]
    		for(j = 0; j < modules[i].ctas.length; j++){
	     		var ctasplit = modules[i].ctas[j].tracking.split('-_-')
	     		modules[i].ctas[j].tracking = ctasplit[0] + '-_-'+ ctasplit[1].split('_')[0] + '_' + modulePosition + ctaTrackingType + '-_-' + ctasplit[2]
    		}

    		//console.log('BGCTA: '+modules[i].bgcta.tracking)
    	}

    }

    //Watch for Reactivation 
    $scope.$watch('reactivationModel', function (newValue, oldValue, scope) {
    	//Check to see if reservation asset is empty
		function isEmpty(obj) {
			for(var key in obj) {
				if(obj.hasOwnProperty(key)){
					return false;
				}
			}
		    return true;
		}
		//Only run if reservation is not empty - therefor changes
		if (!isEmpty($scope.reactivationModel.reactivationAsset)) {
			var populateData = function(x){
				for(j = 0; j < x.length; j++){
					var assetType = x[j]
					if($scope.reactivationModel.reactivationAsset[assetType] != null){
						for(i=0;i < $scope.reactivationModel.reactivationAsset[assetType].length; i++){
							//If Empty Module Exists and is only item, remove it before adding reactivation
                            if((i == 0) && ($scope.tempCoreInfo[assetType].length == 1) && ($scope.tempCoreInfo[assetType][0].uuid.length < 2)){
                                $scope.tempCoreInfo[assetType].splice(0 , 1);
                            }
							$scope.tempCoreInfo[assetType].push($scope.reactivationModel.reactivationAsset[assetType][i])
						}
					}
				}
			}
			populateData(['homepageModules','flyouts','globalAs','globalCs'])
			$scope.reactivationModel.reactivationAsset.length = 0;
			$scope.reactivationModel.reactivationAsset = {};
		}
	}, true);
});

////////////////////////////////////////////////////////////////////////
//////////////////////// SITE ASSET NAVIGATION /////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('assetNavCtrl' , function($scope , $stateParams, siteAssetVarService, parseData){
	$scope.$on('siteAssetVarServiceUpdated', function () {
		$scope.siteAssetVars = siteAssetVarService.get()
	});
	$scope.setSiteAssetVars = function(x){
		siteAssetVarService.push(x) 
	}
});

////////////////////////////////////////////////////////////////////////
////////////////////////////// JADE CTRL ///////////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('jadeCreatorCtrl' , function($scope , $stateParams){
});

////////////////////////////////////////////////////////////////////////
//////////////////////////// NEW ASSET CTRL/////////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('newAssetCtrl' , function($scope , $stateParams, uuid4, checkDupes , $state, reactivationVarService, newAssetService, modelTemplates,siteAssetVarService , sanitizeModel, siteAssetDataService){
	siteAssetVarService.push([{page : $stateParams.page}])
	reactivationVarService.clear()
	newAssetService.clear()
	//INIT CALENDAR VARS
	$scope.datePicker = {};
	$scope.datePicker.date = {startDate: {_d:{}}, endDate: {_d:{}}};
	$scope.dateStart;
	$scope.dateEnd;
	$scope.newSiteMode = {currentMode : ''};
	$scope.dateCheck;

	//INIT ASSET NAV VARIABLES
	$scope.newAssetVars = newAssetService.get()
	$scope.$on('newAssetServiceUpdated', function () {
		$scope.newAssetVars = newAssetService.get()
	});

	//SET DEFAULT TYPE AND NEW UUID
	newAssetService.push({
		type:'SA',
		uuid: uuid4.generate()
	})
	$scope.pushDate = function(){
		newAssetService.push({
			day             : $scope.dateStart.split(' ')[2],
			month           : $scope.monthConvert[$scope.dateStart.split(' ')[1]],
			year            : $scope.dateStart.split(' ')[3],
			endDay          : $scope.dateEnd.split(' ')[2],
			endMonth        : $scope.monthConvert[$scope.dateEnd.split(' ')[1]],
			endYear         : $scope.dateEnd.split(' ')[3]
		});
	}
	$scope.pushURL = function(){
		newAssetService.push({
			date            : newAssetService.get().month + newAssetService.get().day + newAssetService.get().year ,
			endDate         : newAssetService.get().endMonth + newAssetService.get().endDay + newAssetService.get().endYear ,
			url             : newAssetService.get().month + newAssetService.get().day + newAssetService.get().year + newAssetService.get().type 
		});
	}

    $scope.$watch('datePicker.date', function(newDate) {
    	if($scope.datePicker.date.startDate._d != null){
			$scope.dateStart = $scope.datePicker.date.startDate._d + '';
			$scope.dateEnd = $scope.datePicker.date.endDate._d + '';
			$scope.pushDate()
			$scope.pushURL()
		    $scope.datePicker.status = angular.equals($scope.datePicker.date.startDate._d, {})
			$scope.dupeCheck = checkDupes.checkAssetObj($scope.siteData , {'url':newAssetService.get().url})
    	}
    }, false);

	$scope.setAssetType = function(x){
		newAssetService.push({type:x})
		$scope.pushURL()
		$scope.dupeCheck = checkDupes.checkAssetObj($scope.siteData , {'url':newAssetService.get().url})	
	}
	$scope.newAssetMode = function(x){
		reactivationVarService.clear()
		$scope.newSiteMode.currentMode = x;
		if(x == 'reactivation'){newAssetService.push({type:'RA'})}
		reactivationVarService.push([{mode:x}])

	}
	$scope.cancelNewAssetMode = function(x){
	    newAssetService.clear()
	    reactivationVarService.clear()
	}

	$scope.saveNewSiteAsset = function(){
		var finalModel;
		if($scope.newSiteMode.currentMode == ''){
			var assetData = modelTemplates.getNewAssetModel()
			var sanitizedAsset = sanitizeModel.uuid(assetData)
			var assetTracking = sanitizeModel.tracking(sanitizedAsset, newAssetService.get())
			finalModel = newAssetService.update(assetTracking , newAssetService.get())
		}
		//If Reactivation
		if($scope.newSiteMode.currentMode == 'reactivation'){
            var reactivationAssetData = angular.copy($scope.siteData[reactivationVarService.get().index])
			var sanitizedModel = sanitizeModel.reactivation(reactivationAssetData, reactivationVarService.get().url)
			finalModel = newAssetService.update(sanitizedModel , newAssetService.get())
			finalModel.reactivation = true
			delete finalModel['_id']
		}
		if($scope.newSiteMode.currentMode == 'template'){
			//console.log('template')
		}
	    siteAssetDataService.new(finalModel).then(function(d){
			$state.go('main.editor.sites', {id: newAssetService.get().url});
			newAssetService.clear()
			reactivationVarService.clear()
	    })
	}
});

////////////////////////////////////////////////////////////////////////
///////////////////////// REACTIVATE NAV CTRL //////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('reactivateNavCtrl' , function($scope, reactivationVarService){
	$scope.$on('reactivationVarServiceUpdated', function () {
		$scope.reactivationVars = reactivationVarService.get()
	});
	$scope.setReactivationVars = function(x){
		reactivationVarService.push(x) 
	}
	$scope.cancelReactivationMode = function(){
        reactivationVarService.clear()
	}	
});

////////////////////////////////////////////////////////////////////////
//////////////////////// REACTIVATE WINDOW CTRL ////////////////////////
////////////////////////////////////////////////////////////////////////
app.controller('reactivateCtrl' , function($scope){
	$scope.reactivationSelectedDate = false
	$scope.reactivationTempData;
	$scope.toggleSubmitbtn = false;

});


////////////////////////////////////////////////////////////////////////
////////////////////////////// FACTORIES ///////////////////////////////
////////////////////////////////////////////////////////////////////////

app.factory('loadData', ['$http' , function($http) {
	return {
		getJSON: function(){
			return $http.get('js/data.json')
				.then(function(response) {
					return response.data;
				});
		}
	}
}]);

app.factory('parseDate', function() {
	return {
		stringToObj: function(x , y){
			// x = start date MON/DAY/YEAR - LETTER/NUMERAL/NUMERAL
			// y = end date
			//formats from Tue Mar 14 2017 00:00:00 GMT-0700 (PDT)
			var monthConvert = {  "Jan": "01",  "Feb": "02",  "Mar": "03",  "Apr": "04",  "May": "05",  "Jun": "06",  "Jul": "07",  "Aug": "08",  "Sep": "09",  "Oct": "10",  "Nov": "11",  "Dec": "12"}

			var tempNewDateStart = x + '';
			var tempNewDateEnd = y + '';

			var returnObject = {
		    	'date'      : monthConvert[tempNewDateStart.split(' ')[1]]+tempNewDateStart.split(' ')[2]+tempNewDateStart.split(' ')[3],
		    	'month'     : monthConvert[tempNewDateStart.split(' ')[1]],
		    	'day'       : tempNewDateStart.split(' ')[2],
		    	'year'      : tempNewDateStart.split(' ')[3],
		    	'endDate'   : monthConvert[tempNewDateEnd.split(' ')[1]]+tempNewDateEnd.split(' ')[2]+tempNewDateEnd.split(' ')[3],
		    	'endMonth'  : monthConvert[tempNewDateEnd.split(' ')[1]],
		    	'endDay'    : tempNewDateEnd.split(' ')[2],
		    	'endYear'   : tempNewDateEnd.split(' ')[3]
		    }
			return returnObject
		}
	}
});

app.service('sanitizeModel', function($rootScope, parseData, uuid4){
	this.uuid = function(model){
		var obj = angular.copy(model)
		function sanitizeObj(obj){
		    var k;
		    if (obj instanceof Object) {
		        for (k in obj){
		            if (obj.hasOwnProperty(k)){
		            	if(k == 'uuid'){
			            	obj[k] = uuid4.generate()
		            	}
		                sanitizeObj( obj[k] );  
		            }                
		        }
		    } else {

		    }
	    }
	    sanitizeObj(obj)
	    return obj
	}
	this.reactivation = function(model, url){
		var obj = angular.copy(model)
		function sanitizeObj(obj){
		    var k;
		    if (obj instanceof Object) {
		        for (k in obj){
		            if (obj.hasOwnProperty(k)){
		            	if(k == 'uuid'){
			            	obj[k] = uuid4.generate()
		            	}
		            	if(k == 'modType'){
			            	obj[k] = 'RA'
		            	}
		            	if(k == 'reactivationURL'){
			            	obj[k] = url
		            	}
		                sanitizeObj( obj[k] );  
		            }                
		        }
		    } else {

		    }
	    }
	    sanitizeObj(obj)
	    return obj
	}

	this.tracking = function(model, newAssetVars){
		var obj = angular.copy(model);  
		var dd = newAssetVars.day
		var mm = newAssetVars.month
		var yyyy = newAssetVars.year
        for(i = 0; i < obj.homepageModules.length; i++){
        	for(a = 0; a < obj.homepageModules[i].ctas.length; a++){
        		obj.homepageModules[i].ctas[a].tracking = yyyy+'_'+mm+'_'+dd+'-_-HP_$$BTM-_-'
        	}
        	obj.homepageModules[i].bgcta.tracking = yyyy+'_'+mm+'_'+dd+'-_-HP_$$BTMIMAGE-_-'
        }
        for(i = 0; i < obj.flyouts.length; i++){
        	obj.flyouts[i].tracking = yyyy+'_'+mm+'_'+dd+'-_-TOPNAV_FLYOUT-_-'
        }
        for(i = 0; i < obj.globalAs.length; i++){
        	obj.globalAs[i].tracking = yyyy+'_'+mm+'_'+dd+'-_-GLOBAL_A-_-'
        }
        for(i = 0; i < obj.globalCs.length; i++){
        	obj.globalCs[i].tracking = yyyy+'_'+mm+'_'+dd+'-_-GLOBAL_DROPDOWN-_-'
        }
        return obj
	}
})

app.service('reactivationVarService', function($rootScope, parseData){
	this.reactivationVars = {month:null,date:null,uuid:null,url:null,index:null,mode:null};

	this.push = function(x,refresh = true){
		var data = [];
		for(i = 0; i < x.length; i++){
			var keyName = Object.keys(x[i])
			this.reactivationVars[keyName] = x[i][keyName];
		}
		if(refresh){
			$rootScope.$broadcast('reactivationVarServiceUpdated');
		}
	};

	this.get = function(){
		return this.reactivationVars
	};
	this.clear = function(){
		delete this.reactivationVars
		this.reactivationVars = {month:null,date:null,uuid:null,url:null,index:null,mode:null}
		$rootScope.$broadcast('reactivationVarServiceUpdated');
	};
	this.changed = function(){

	};
	this.broadcast = function(){
		$rootScope.$broadcast('reactivationVarServiceUpdated');
	};
})





app.service('siteAssetVarService', function($rootScope){
	this.siteAssetVars = {date:null,day:null,month:null,year:null,endDate:null,endDay:null,endMonth:null,endYear:null,type:null,url:null,uuid:null,index:null,mode:null,page:null};

	this.init = function(data){
		this.siteAssetVars = {date:data.date,day:data.day,month:data.month,year:data.year,endDate:data.endDate,endDay:data.endDay,endMonth:data.endMonth,endYear:data.endYear,type:data.type,url:data.url,uuid:data.uuid};
	}

	this.push = function(x,refresh = true){
		var data = [];
		for(i = 0; i < Object.keys(x).length; i++){
			var keyName = Object.keys(x)[i]
			var item = x[keyName]
			this.siteAssetVars[keyName] = item
		}
		this.siteAssetVars.url = this.siteAssetVars.month + this.siteAssetVars.day + this.siteAssetVars.year + this.siteAssetVars.type
		if(!refresh){$rootScope.$broadcast('siteAssetVarServiceUpdated')}
	};

	this.get = function(){
		return this.siteAssetVars
	};
	this.clear = function(){
		delete this.siteAssetVars
		this.siteAssetVars = {date:null,day:null,month:null,year:null,endDate:null,endDay:null,endMonth:null,endYear:null,type:null,url:null,uuid:null,index:null,mode:null,page:null};
		$rootScope.$broadcast('siteAssetVarServiceUpdated');
	};
	this.changed = function(){

	};
	this.broadcast = function(){
		$rootScope.$broadcast('siteAssetVarServiceUpdated');
	};
})

app.factory('checkDupes', function($rootScope) {
	return {
		checkAssetDate: function(data , checkDate){
			// x = data
			// y = date to be checked
			var returnObject = false;
			for(i = 0; i < data.length; i++){
				if(data[i].date == checkDate){
					returnObject = true
				}
			}
			return returnObject
		},
		checkAssetObj: function(data , checkParamObj){
			var keys = Object.keys(checkParamObj)
			var returnObject = {};
			for(i = 0; i < keys.length; i++){
				var checkKey = keys[i]
				var checkValue = checkParamObj[checkKey]
				for(j = 0; j < data.length; j++){
					if(data[j][checkKey] == checkValue){
						returnObject[checkKey] = true;
						break;
					}else{
						returnObject[checkKey] = false;
					}
				}
			}
			return returnObject
		}
	}
});

app.factory('parseData', function($rootScope , $stateParams) {
	return {
		locToIndex: function(data, locname){
			var returnObject;
			data.filter(function(d,c){
				if(d.name == locname){
					returnObject = c;
				}
			})
			return returnObject
		},
		uuidToIndex: function(data, uuid){
			var returnObject;
			data.filter(function(d,c){
				if(d.uuid == uuid){
					returnObject = c;
				}
			})
			return returnObject
		},
		siteAssetIndex: function(data, value, property){
			var returnObject;
			var property = property;
			data.filter(function(d,c){
				if(d[property] == value){
					returnObject = c;
				}
			})
			return returnObject
		},
		returnIndexes: function(x , y , z){
			// x = Data Array || [Data Array, {'customDate' : 'x'}]
			// y = {homepageModules : uuid} || {globalCs : uuid} || {globalAs : uuid} || {flyouts : uuid}
			// z = {cta : uuid}
			// var currentAssetData = parseData.returnIndexes($scope.siteData,{'assetType' : 'homepageModules','assetID' : y},{'assetType' : 'ctas','assetID' : z});
			// currentAssetData.assetIndex | currentAssetData.homepageModulesIndex | currentAssetData.ctasIndex
			// var pastAssetData = parseData.returnIndexes([$scope.siteData , {'customDate' : '030617'}],{'assetType' : 'homepageModules','assetID' : y},{'assetType' : 'ctas','assetID' : z});
			
			//Option for using a custom date (ie reactivation date)
			//Hacky Splice $FIX$
			//var date = $stateParams.id
			if('customDate' in x[1]){
				var returnObject = { 'assetDate':x[1].customDate}
				x = x[0]
			}else{
				var returnObject = { 'assetDate':$stateParams.id }
			}

			var firstProperty
			var secondProperty
			var tempData;
			var tempData2;
			x.filter(function(d,c){
				if(d.date == returnObject.assetDate){
					returnObject.assetIndex = c;
					tempData = d;
				}
			})
			if(typeof y !== "undefined"){
				firstPropertyName = y.assetType + 'Index'
				firstProperty = y.assetType
				tempData[firstProperty].filter(function(d,c){
					if(d.uuid == y.assetID){
						returnObject[firstPropertyName] = c;
						tempData = d;
					}
				})
			}
			if(typeof z !== "undefined"){
				secondPropertyName = z.assetType + 'Index'
				secondProperty = z.assetType
				tempData[secondProperty].filter(function(d,c){
					if(d.uuid == z.assetID){
						returnObject[secondPropertyName] = c;
					}
				})
			}
			return returnObject
		}
	}
});

app.service('siteAssetDataService',function($http, $q, $rootScope){
	this.siteAssets;
	this.get = function(params){
		var urlParams = '';
		if(params){
			var keys = Object.keys(params);
			for(i=0;i<keys.length;i++){
				var k = keys[i]
				if(i == 0){
					urlParams = '?' + k + '=' + params[k]
				}else{
					urlParams = urlParams + '&' + k + '=' + params[k]
				}
			}
		}
    	var promise = $http.get('/api/siteAssets' + urlParams).then(
    		function successCallback(data){
	            this.siteAssets = data.data
	            console.log('Get Sucessfull')
		    	return this.siteAssets 
	    	}, function errorCallback(data){
	            console.log('Error: ' + data);
	    	})
    	return promise
	}
	this.new = function(newData){
		var deferred = $q.defer();
    	var promise = $http.post('/api/siteAssets/create',newData).then(
    		function successCallback(data){
    			deferred.resolve(data)
    			$rootScope.$broadcast('siteAssetDataUpdated');
	    	}, function errorCallback(data){
    			deferred.reject(data)
	    	})
    	return deferred.promise;
	}
	this.update = function(newData){
		var deferred = $q.defer();
    	var promise = $http.post('/api/siteAssets/update',newData).then(
    		function successCallback(data){
    			deferred.resolve(data)
    			$rootScope.$broadcast('siteAssetDataUpdated');
	    	}, function errorCallback(data){
    			deferred.reject(data)
	    	})
    	return deferred.promise;
	}
})

app.service('newAssetService', function(uuid4, $rootScope){
	this.newAssetModel = {
		"date"              : "",
		"day"               : "",
		"month"             : "",
		"year"              : "",
		"endDate"           : "",
		"endDay"            : "",
		"endMonth"          : "",
		"endYear"           : "",
		"type"              : "",
		"uuid"              : "",
		"notes"             : "",
		"homepageModules"   : [],
		"flyouts"           : [],
		"globalAs"          : [],
		"globalCs"          : []
    };
	
	this.push = function(x){
		var data = [];
		for(i = 0; i < Object.keys(x).length; i++){
			var keyName = Object.keys(x)[i]
			var item = x[keyName]
			if(typeof x[keyName] == 'object'){
				item.uuid = uuid4.generate()
				this.newAssetModel[keyName].push(item)
			}else{
				this.newAssetModel[keyName] = item
			}
		}
		//console.log(this.newAssetModel)
	};

	this.get = function(){
		return this.newAssetModel
	};
	this.clear = function(){
		delete this.newAssetModel
		this.newAssetModel = {date:null,day:null,month:null,year:null,endDate:null,endDay:null,endMonth:null,endYear:null,type:null,url:null,uuid:null,index:null,mode:null}
		$rootScope.$broadcast('newAssetServiceUpdated');
	};
	this.changed = function(){

	};

	this.update = function(model , vars){
		obj = angular.copy(model)
		obj.date      = vars.date;
		obj.day       = vars.day;
		obj.month     = vars.month;
		obj.year      = vars.year;
		obj.endDate   = vars.endDate;
		obj.endDay    = vars.endDay;
		obj.endMonth  = vars.endMonth;
		obj.endYear   = vars.endYear;
		obj.type      = vars.type;
		obj.url       = vars.url;
		return obj
	}

	this.broadcast = function(){
		$rootScope.$broadcast('newAssetServiceUpdated');
	};
})


app.factory('modelTemplates', function() {
	return {
		reactivationDataModel: function(){
			var returnObject = {
				"homepageModules" : {
					'tempList' : [],
					'tempData' : []
				},
				"flyouts" : {
					'tempList' : [],
					'tempData' : []
				},
				"globalAs" : {
					'tempList' : [],
					'tempData' : []
				},
				"globalCs" : {
					'tempList' : [],
					'tempData' : []
				}
			};
			return returnObject;
		},
		getNewAssetModel: function(){
			var returnObject = {
				"date"              : "",
				"day"               : "",
				"month"             : "",
				"year"              : "",
				"endDate"           : "",
				"endDay"            : "",
				"endMonth"          : "",
				"endYear"           : "",
				"type"              : "",
				"uuid"              : "",
				"notes"             : "",
				"url"				: "",
				"homepageModules" : [
			      	{ 
						"name"              : "",
						"uuid"              : "",
						"columns"           : "1",
						"rowPosition"       : "1",
						"colPosition"       : "1", 
						"legal"             : "",
						"notes"             : "",
						"modType"           : "",
						"reactivationURL"  : "",
						"bgcta" : {
								"link"        : "",
								"tracking"    : ""
						},
						"ctas" : [
				            {
								"uuid"        : "",
								"name"        : "",
								"cta"         : "Shop Now >",
								"link"        : "",
								"tracking"    : ""
				            }
				        ]
			        }
		        ],
				"flyouts" : [
					{
						"uuid"              : "",
						"position"          : "",
						"name"              : "",
						"location"          : [
				        	{"name":"SUI","active":false},
				        	{"name":"SPC","active":false},
				        	{"name":"SHI","active":false},
				        	{"name":"PAN","active":false},
				        	{"name":"SWT","active":false},
				        	{"name":"OUT","active":false},
				        	{"name":"SHO","active":false},
				        	{"name":"ACC","active":false},
				        	{"name":"BNT","active":false},
				        	{"name":"SAL","active":false},
				        	{"name":"TUX","active":false}
			       		],
						"link"              : "",
						"tracking"          : "",
						"modType"           : "",
						"reactivationURL"  : ""
					}
				],
				"globalAs" : [
					{
						"uuid"              : "",
						"position"          : "",
						"name"              : "",
						"link"              : "",
						"tracking"          : "",
						"modType"           : "",
						"reactivationURL"   : ""
					}
				],
				"globalCs" : [
					{
						"uuid"              : "",
						"position"          : "",
						"name"              : "",
						"link"              : "",
						"tracking"          : "",
						"legal"             : "",
						"modType"           : "",
						"reactivationURL"  : ""
					}
				]
		    };
			return returnObject;
		},
		getHomepageModel: function(){
			var returnObject = {
				"name"              : "",
				"uuid"              : "",
				"columns"           : "1",
				"rowPosition"       : "1",
				"colPosition"       : "1", 
				"legal"             : "",
				"notes"             : "",
				"modType"           : "",
				"reactivationURL"  : "",
		        "bgcta"       : {
		            "link"           : "",
		            "tracking"       : ""
		        },
		        "ctas": [{
		            "uuid"           : "",
		            "cta"            : "Shop Now >",
		            "name"           : "",
		            "link"           : "",
		            "tracking"       : ""
		        }]
		    };
			return returnObject;
		},
		getFlyoutModel: function(){
			var returnObject = {
		        "uuid"              : "",
		        "position"          : "",
		        "name"              : "",
		        "location"          : [
		        	{"name":"SUI","active":false},
		        	{"name":"SPC","active":false},
		        	{"name":"SHI","active":false},
		        	{"name":"PAN","active":false},
		        	{"name":"SWT","active":false},
		        	{"name":"OUT","active":false},
		        	{"name":"SHO","active":false},
		        	{"name":"ACC","active":false},
		        	{"name":"BNT","active":false},
		        	{"name":"SAL","active":false},
		        	{"name":"TUX","active":false}
	       		],
		        "link"              : "",
		        "tracking"          : "",
				"modType"           : "",
				"reactivationURL"   : ""
		    };
			return returnObject;
		},
		getGlobalAModel: function(){
			var returnObject = {
		        "uuid"              : "",
		        "position"          : "",
		        "name"              : "",
		        "link"              : "",
		        "tracking"          : "",
				"modType"           : "",
				"reactivationURL"   : ""
		    };
			return returnObject;
		},
		getGlobalCModel: function(){
			var returnObject = {
		        "uuid"              : "",
		        "position"          : "",
		        "name"              : "",
		        "link"              : "",
		        "tracking"          : "",
		        "legal"             : "",
				"modType"           : "",
				"reactivationURL"   : ""
		    };
		    return returnObject;
		}
	}
});






















