//// Want to's
// Add notification panel on bottom
// reactivation popup with more info
// redo $('.choose-reactivation-assets').removeClass('active');

app.run(function($rootScope , loadData, $http ){
     $http.get('data.json').then(function(res){
    	$rootScope.siteData = res.data.siteAssets;
    	$rootScope.siteDataTemp = res.data;
    });	
/*
    $http.get('/api/siteAssets').then(
    	function successCallback(data) {
	        console.log(data);
		}, function errorCallback(data) {
	        console.log('Error: ' + data);
		});
*/
    $rootScope.createTodo = function() {
    	$http.post('/api/siteAssets', $rootScope.siteDataTemp).then(
    		function successCallback(data){
	            console.log(data);
	    	}, function errorCallback(data){
	            console.log('Error: ' + data);
	    	})
	    };
})

app.controller('mainCtrl' , function($scope, $http, $state , $stateParams, $rootScope, parseData){
    $http.get('data.json').then(function(res){
    	$scope.siteData = res.data.siteAssets;
    });	


	//Editor VARS
	$scope.currentAsset = {};
	$scope.currentAsset.currentAssetDate = false;
	$scope.currentAsset.currentMode = 0;
	$scope.assetNavToggles = {};
	$scope.assetNavToggles.assetListDate;
	$scope.assetNavToggles.assetListMonth;
	$scope.reactivationNavToggles = {};
    $scope.reactivationNavToggles.assetListDate = null;
    $scope.reactivationNavToggles.assetListMonth = null;
	$scope.btnToggles = {};
    $scope.btnToggles.assetListMonth = 0;
    $scope.modelTemplates = {};
});

app.controller('editorCtrl' , function($scope , $stateParams){
    $scope.months = [{'month': 'Jan', 'date' : '01'},{'month': 'Feb', 'date' : '02'},{'month': 'Mar', 'date' : '03'},{'month': 'Apr', 'date' : '04'},{'month': 'May', 'date' : '05'},{'month': 'Jun', 'date' : '06'},{'month': 'Jul', 'date' : '07'},{'month': 'Aug', 'date' : '08'},{'month': 'Sep', 'date' : '09'},{'month': 'Oct', 'date' : '10'},{'month': 'Nov', 'date' : '11'},{'month': 'Dec', 'date' : '12'}]
});


app.controller('assetCtrl' , function($scope , $rootScope, $stateParams , parseData){
	$scope.currentAsset.currentAssetIndex = parseData.returnIndexes($scope.siteData);
	$scope.currentAsset.currentAssetDate = $stateParams.id;
    $scope.sortableOptions = {
        stop: function(e, ui) { 
	  		$rootScope.$broadcast('resortEvent');
        }
    }
	$scope.modelTemplates.homepageModules = {
		        "name": "",
				"day" : "",
				"month" : "",
				"year" : "",
		        "uuid": "",
		        "columns": "1",
		        "rowPosition": "1",
		        "colPosition": "1",
		        "legal": "",
		        "notes": "",
		        "bgcta": [{
		            "link": "",
		            "tracking": ""
		        }],
		        "ctas": [{
		            "uuid": "",
		            "name": "",
		            "link": "",
		            "tracking": ""
		        }]
		    }
	$scope.modelTemplates.flyouts = {
		        "uuid": "",
		        "name": "",
		        "location": "",
		        "link": "",
		        "tracking": ""
		    }
	$scope.modelTemplates.globalAs = {
		        "uuid": "",
		        "name": "",
		        "location": "",
		        "link": "",
		        "tracking": ""
		    }
	$scope.modelTemplates.globalCs = {
		        "uuid": "",
		        "name": "",
		        "location": "",
		        "link": "",
		        "tracking": "",
		        "legal": ""
		    }
});

app.controller('assetListCtrl' , function($scope , $stateParams){
    $scope.number = 12;
    $scope.getNumber = function(num) {
        return new Array(num);   
    }
    /*
	$scope.getClass = function(x){
		if($scope.currentAsset.currentAssetIndex.assetDate !== null){
			if(x == $scope.currentAsset.currentAssetIndex.assetDate){
				return 'active'
			}
		}
	}
	*/
});

app.controller('jadeCreatorCtrl' , function($scope , $stateParams){
});

app.controller('newSiteAssetCtrl' , function($scope , $stateParams){
	console.log($stateParams)
	$scope.blankAsset = 
		[{
		    "date": "",
		    "uuid": "",
		    "notes": "",
		    "homepageModules": [{
		        "name": "",
				"day" : "",
				"month" : "",
				"year" : "",
		        "uuid": "",
		        "columns": "1",
		        "rowPosition": "1",
		        "colPosition": "1",
		        "legal": "",
		        "notes": "",
		        "bgcta": [{
		            "link": "",
		            "tracking": ""
		        }],
		        "ctas": [{
		            "uuid": "",
		            "name": "",
		            "link": "",
		            "tracking": ""
		        }]
		    }],
		    "flyouts": [{
		        "uuid": "",
		        "name": "",
		        "location": "",
		        "link": "",
		        "tracking": ""
		    }],
		    "globalAs": [{
		        "uuid": "",
		        "name": "",
		        "location": "",
		        "link": "",
		        "tracking": ""
		    }],
		    "globalCs": [{
		        "uuid": "",
		        "name": "",
		        "location": "",
		        "link": "",
		        "tracking": "",
		        "legal": ""
		    }]
		}];
});

app.controller('reactivateCtrl' , function($scope, $rootScope, $state , $stateParams, parseData , uuid4){
	$scope.reactivationSelectedDate = false
	$scope.reactivationTempData;
	$scope.toggleSubmitbtn = false;
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
});

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

app.factory('parseData', function($rootScope , $stateParams) {
	return {
		returnIndexes: function(x , y , z){
			// x = Data Array || [Data Array], {'customDate' : 'x'}
			// y = {homepageModules : uuid} || {globalCs : uuid} || {globalAs : uuid} || {flyouts : uuid}
			// z = {cta : uuid}
			// var currentAssetData = parseData.returnIndexes($scope.siteData,{'assetType' : 'homepageModules','assetID' : y},{'assetType' : 'ctas','assetID' : z});
			// currentAssetData.assetIndex | currentAssetData.homepageModulesIndex | currentAssetData.ctasIndex
			// var pastAssetData = parseData.returnIndexes([$scope.siteData , {'customDate' : '030617'}],{'assetType' : 'homepageModules','assetID' : y},{'assetType' : 'ctas','assetID' : z});
			
			//Option for using a custom date (ie reactivation date)
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











