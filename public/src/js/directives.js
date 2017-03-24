app.directive('formInput',function(){
    return {
        restrict: 'C',
        link: function($scope, element, attrs) {
            attrs.$set('autocomplete','off');
            element.on('click' , function(){
                this.select();
            })
        }
    };
});


app.directive('assetListNav',function($stateParams){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/assetList.tpl.html',
        scope: true,
        link: function($scope, element, attrs){
            $scope.getMonthNav = function(x){
                $scope.assetNavToggles.assetListMonth = null;
                $scope.assetNavToggles.assetListMonth = x;
            }
            $scope.getDateNav = function(x){
                $scope.assetNavToggles.assetListDate = null;
                $scope.assetNavToggles.assetListDate = x;
            }
        }
    }
})

app.directive('reactivationAssetListNav',function($stateParams){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/reactivationAssetList.tpl.html',
        scope: true,
        link: function($scope, element, attrs){
            $scope.getReactivationMonthNav = function(x){
                $scope.reactivationNavToggles.assetListMonth = null;
                $scope.reactivationNavToggles.assetListMonth = x;
            }
            $scope.getReactivationDateNav = function(x){
                $scope.reactivationNavToggles.assetListDate = null;
                $scope.reactivationNavToggles.assetListDate = x;
            }
        }
    }
})




////////////////////////////////////////////////////////////////////////
///////////////////////// EDITOR DIRECTIVES //////////////////////////
////////////////////////////////////////////////////////////////////////

app.directive('cancelMode',function($state , parseData, uuid4){
    return {
        restrict: 'E',
        replace: true,
        template: '<a class="button" ng-show="currentAsset.editingMode">Cancel</a>',
        scope: true,
        link: function($scope, element, attrs){
            element.on('click' , function(){
                console.log($scope.currentAsset.currentMode)
                $scope.currentAsset.editingMode = false;
                $scope.currentAsset.currentMode = null;
                $scope.reactivationNavToggles.assetListDate = null;
                $scope.reactivationNavToggles.assetListMonth = null;
                $scope.$apply();
            })
        }
    }
})

////////////////////////////////////////////////////////////////////////
///////////////////////// HOMEPAGE DIRECTIVES //////////////////////////
////////////////////////////////////////////////////////////////////////

/////////////////////////// CREATE NEW MODULE //////////////////////////

app.directive('addModule',function($state , parseData, uuid4){
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="button add-hp-module"><a>{{addModuleTitle}}</a><input class="formInput" placeholder="1" value="1"></input></span>',
        scope: true,
        link: function($scope, element, attrs){
            $scope.addModuleTitle = attrs.addAssetTitle
            var createElements = function(){
                var ctaCount =  element.find('input').val()  
                var assetType = attrs.addAssetType;
                if(ctaCount < 10){
                    for(i = 0 ; i < ctaCount; i++){
                        console.log(ctaCount)
                        var tempModel = angular.copy($scope.modelTemplates[assetType])
                        var newUUID = uuid4.generate();
                        var currentAssetData = parseData.returnIndexes($scope.siteData);
                        tempModel.uuid = newUUID
                        $scope.siteData[currentAssetData.assetIndex][assetType].push(tempModel);
                        tempModel.length = 0;
                    }
                }else{
                    alert('Are you nuts?! CTA Count must be less than 10')
                }
                element.find('input').val('1')
                $scope.$apply();
            }
            element.find('a').on("click", function(e){
                e.preventDefault();
                createElements();
            });
            element.find('input').on("keydown", function(e){
                if (e.which == 13) {
                    e.preventDefault();
                    createElements();
                }
            });
        }
    }
})

/////////////////////////// HOMEPAGE MODULES /////////////////////////

app.directive("deleteModule", function(parseData , $state){   
    return{
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<a class="button small btn-delete-module" data-parent-module-uuid="{{homepageModule.uuid}}">DEL</a>',
        link: function($scope , element, attrs){              
            element.on("click", function(e){
                var currentAssetData = parseData.returnIndexes($scope.siteData,{'assetType' : 'homepageModules','assetID' : attrs.parentModuleUuid});
                $scope.siteData[currentAssetData.assetIndex].homepageModules.splice(currentAssetData.homepageModulesIndex,1);
                $scope.$apply();
            });
        }
    }
});

app.directive('setModuleCols',function($state , parseData){
    return {
        restrict: 'E',
        scope: true,
        template: '<div class="col-setter"><a ng-class="{\'active\':homepageModule.columns == \'1\' }" class="button small" data-set-cols="1">1 Col</a><a ng-class="{\'active\':homepageModule.columns == \'2\' }" class="button small" data-set-cols="2">2 Col</a><a ng-class="{\'active\':homepageModule.columns == \'3\' }" class="button small" data-set-cols="3">3 Col</a>  <input type="hidden" name="{{homepageModule.columns}}" placeholder="CTA Columns" ng-value="homepageModule.columns" ng-model="homepageModule.columns" class="formInput homepageModuleCols"/></a></div>',
        link: function($scope, element, attrs , ngModel) {
            element.find('a').each(function(){
                $(this).on('click' , function(){
                    var parentModuleUuid = $(this).closest('.col-info-container').attr('data-uuid')
                    var currentAssetData = parseData.returnIndexes($scope.siteData,{'assetType' : 'homepageModules','assetID' : parentModuleUuid});
                    $scope.siteData[currentAssetData.assetIndex].homepageModules[currentAssetData.homepageModulesIndex].columns = $(this).attr('data-set-cols');
                    $scope.$apply();
                })
            })
            
        }
    };
});

app.directive('trackModuleRowPosition',function($timeout , $rootScope){
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        template: '<input class="formInput homepageModuleRow" type="hidden" , name="homepageModule.rowPosition" , placeholder="CTA Columns", ng-value="homepageModule.rowPosition", ng-model="homepageModule.rowPosition"></input>',
        link: function($scope, element, attrs , ngModel){
            var updateIndex  = function(){
                element.parent('.col-info-container').each(function(){
                    var positionHolder = element.children('.homepageModuleRow')
                    var position = $(this).index()
                    $(this).attr('data-homepage-position',position)
                    ngModel.$setViewValue(position);
                })
            }
            $timeout(updateIndex, 0);
            $rootScope.$on('resortEvent', function(event, data){
                updateIndex()
            });
        }
    }
})

app.directive('trackModuleColPosition',function($timeout , $rootScope){
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        template: '<input class="formInput homepageModuleRow" type="hidden" , name="homepageModule.colPosition" , placeholder="CTA Columns", ng-value="homepageModule.colPosition", ng-model="homepageModule.colPosition"></input>',
        link: function($scope, element, attrs , ngModel){
            var updateIndex  = function(){
                //Find multiples
                function patternItem(x, lastNum) {
                  return x % lastNum;
                }
                element.parent('.col-info-container').each(function(){
                    if( !($(this).hasClass('medium-6')) || !($(this).hasClass('medium-4')) ){
                        ngModel.$setViewValue('');
                    }
                })
                element.parent('.col-info-container.medium-6').each(function(){
                    var position = $(this).index()
                    ngModel.$setViewValue(patternItem(position, 2) + 1);
                })
                element.parent('.col-info-container.medium-4').each(function(x,y){
                    var position = $(this).index()
                    ngModel.$setViewValue(patternItem(position, 3) + 1);
                })

            }
            $timeout(updateIndex, 0);
            $rootScope.$on('resortEvent', function(event, data){
                updateIndex()
            });
        }
    }
})

/////////////////////////// CTAS /////////////////////////

app.directive("createModuleCta", function(parseData , $state, uuid4){   
    return{
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div class="card" data-parent-module-uuid="{{homepageModule.uuid}}"><div class="col-info-box col-info-add"><a><i class="fi-plus large"></i> Add New CTA</a><input class="formInput" placeholder="1" value="1"></input></div></div>',
        link: function($scope , element, attrs){
            var createElements = function(){
                var ctaCount =  element.find('input').val()  
                if(ctaCount < 10){
                    for(i = 0 ; i < ctaCount; i++){
                        var newUUID = uuid4.generate()
                        var newCta = {"uuid" : uuid4.generate(), "name" : "", "link" : "", "tracking" : ""};
                        var currentAssetData = parseData.returnIndexes($scope.siteData,{'assetType' : 'homepageModules','assetID' : attrs.parentModuleUuid});
                        var ctaData = $scope.siteData[currentAssetData.assetIndex].homepageModules[currentAssetData.homepageModulesIndex].ctas;
                        ctaData.push(newCta)
                    }
                }else{
                    alert('Are you nuts?! CTA Count must be less than 10')
                }
                element.find('input').val('1')
                $scope.$apply();
            }
            element.find('input').on("keydown", function(e){
                if (e.which == 13) {
                    e.preventDefault();
                    createElements();
                }
            });
            element.find('a').on("click", function(e){
                e.preventDefault();
                createElements();
            });
        }
    }
});

app.directive("removeModuleCta", function(parseData , $state){   
    return{
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div class="col-info-delete" data-parent-module-uuid="{{homepageModule.uuid}}" data-cta-uuid="{{cta.uuid}}""><a><i class="fi-x-circle large"></i></a></div>',
        link: function($scope , element, attrs){              
            element.children('a').on("click", function(e){
                var currentAssetData = parseData.returnIndexes($scope.siteData,{'assetType' : 'homepageModules','assetID' : attrs.parentModuleUuid},{'assetType' : 'ctas','assetID' : attrs.ctaUuid});
                console.log(currentAssetData)
                ctaList = $scope.siteData[currentAssetData.assetIndex].homepageModules[currentAssetData.homepageModulesIndex].ctas.splice(currentAssetData.ctasIndex,1);
                $scope.$apply();
            });
        }
    }
});


////////////////////////////////////////////////////////////////////////
///////////////////////// REACTIVATION TOOL ////////////////////////////
////////////////////////////////////////////////////////////////////////

app.directive('openReactivationTool',function(){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<a class="button">Add Reactivation</a>',
        link: function($scope, element){
            element.on('click', function(){
                if($scope.currentAsset.currentMode == 'reactivation'){
                    $scope.currentAsset.currentMode = 0
                    $scope.currentAsset.editingMode = false
                }
                if($scope.currentAsset.currentMode !== 'reactivation'){
                    $scope.currentAsset.currentMode = 'reactivation'
                    $scope.currentAsset.editingMode = true
                    
                }
                $scope.$apply();
            })
        }
    }
})

app.directive('chooseReactivationDate',function(parseData){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<a data-reactivation-date="{{siteAsset.date}}" ng-class="{active : siteAsset.date == btnToggles.reactivationDate}" class="button">{{siteAsset.date}}</a>',
        link: function($scope, element, attrs){
            element.on('click' , function(){
                $scope.btnToggles.reactivationDate = attrs.reactivationDate
                $scope.$apply();
            })
        }   
    }
})

app.directive('chooseReactivationAssets',function(parseData){
    return {
        restrict: 'C',
        replace: true,
        scope: true,
        link: function($scope, element, attrs){
            element.on('click' , function(){
                var exists = false   
                var pastAssetData = parseData.returnIndexes([$scope.siteData , {'customDate' : attrs.assetDate}],{'assetType' : attrs.assetType,'assetID' : attrs.assetUuid});
                var assetType = attrs.assetType
                var assetTypeIndex = attrs.assetType + 'Index'
                var postData = $scope.siteData[pastAssetData.assetIndex][assetType][pastAssetData[assetTypeIndex]]
                var tempData = $scope.tempDataModel[assetType].tempData;
                var tempList = $scope.tempDataModel[assetType].tempList;
                console.log(tempData)
                if(tempData.length < 1){
                    tempData.push(postData);
                    tempList.push(postData.uuid);
                    element.addClass('active');
                    exists = false        
                }else{
                    tempData.filter(function(d,c){
                        if(d.uuid == postData.uuid){
                            tempData.splice(c , 1);
                            tempList.splice(c , 1);
                            element.removeClass('active');
                            exists = true 
                        }
                    })
                    if(!exists){
                        tempData.push(postData);
                        tempList.push(postData.uuid);
                        element.addClass('active')
                    }
                }
            })
        }   
    }
})

app.directive('addReactivationAssets',function(parseData, uuid4){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<a class="button text-center">Commit Reactivation Selections</a>',
        link: function($scope, element, attrs){
            element.on('click' , function(){
                var currentAssetData = parseData.returnIndexes($scope.siteData);
                var sanitizeData = function(x){
                    uuid4.generate()
                    var assetType = x
                    var tempData = angular.copy($scope.tempDataModel[assetType].tempData)
                    var tempList = angular.copy($scope.tempDataModel[assetType].tempList)
                    for(i = 0; i < tempData.length; i++){
                        if((i == 0) && ($scope.siteData[currentAssetData.assetIndex][assetType].length == 1) && ($scope.siteData[currentAssetData.assetIndex][assetType][0].uuid.length < 2)){
                            $scope.siteData[currentAssetData.assetIndex][assetType].splice(0 , 1);
                        }
                        tempData[i].uuid = uuid4.generate();
                        tempData[i].reactivation = 'true';
                        tempData[i].reactivationDate = $scope.reactivationSelectedDate;
                        tempData[i].rowPosition = '99';
                        if(assetType == 'homepageModules'){
                            for(y = 0; y < tempData[i].ctas.length; y++){
                                tempData[i].ctas[y].uuid = uuid4.generate();
                            }
                        }
                        $scope.siteData[currentAssetData.assetIndex][assetType].push(tempData[i])
                    }
                }
                var clearData = function(x){
                    var assetType = x
                    var tempData = $scope.tempDataModel[assetType].tempData;
                    var tempList = $scope.tempDataModel[assetType].tempList;
                    for(i = 0; i < tempData.length; i++){
                        z = (tempData.length - i) - 1
                        tempData.splice(z , 1);
                    }
                }
                sanitizeData('homepageModules');
                sanitizeData('flyouts');
                sanitizeData('globalAs');
                sanitizeData('globalCs');

                clearData('homepageModules');
                clearData('flyouts');
                clearData('globalAs');
                clearData('globalCs');

                $scope.$apply();
                $scope.tempDataModel.length = 0;
                $scope.tempDataModel = {
                        "homepageModules" : {
                            'tempList' : undefined,
                            'tempData' : undefined
                        },
                        "flyouts" : {
                            'tempList' : undefined,
                            'tempData' : undefined
                        },
                        "globalAs" : {
                            'tempList' : undefined,
                            'tempData' : undefined
                        },
                        "globalCs" : {
                            'tempList' : undefined,
                            'tempData' : undefined
                        }
                    };
                $('.choose-reactivation-assets').removeClass('active');

                $scope.currentAsset.editingMode = false;
                $scope.currentAsset.currentMode = null;
                $scope.reactivationNavToggles.assetListDate = null;
                $scope.reactivationNavToggles.assetListMonth = null;
                $scope.$apply(function(){
                });
            })
        }   
    }
})


////////////////////////////////////////////////////////////////////////
////////////////////////////// JADE TOOL ///////////////////////////////
////////////////////////////////////////////////////////////////////////

app.directive('openJadeTool',function(){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<a class="button">Make Jade</a>',
        link: function($scope, element){
            $scope.btnToggles.jadeBtn = false
            $scope.btnToggles.editingMode = false
            element.on('click', function(){
                $scope.$apply(function(){
                    $scope.btnToggles.jadeBtn = !$scope.btnToggles.jadeBtn
                    if($scope.btnToggles.jadeBtn){$scope.btnToggles.editingMode = true}
                });
            })
        }
    }
})

////////////////////////////////////////////////////////////////////////
////////////////////////////// ADD  NEW  ///////////////////////////////
////////////////////////////////////////////////////////////////////////

app.directive('newFromReactivationTrigger',function(){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<span><a class="button show-reactivation-dates" data-new-from-reactivation-date="{{siteAsset.date}}" ng-hide="btnToggles.newFromReactivation">New Asset from Reactivation</a><a class="button cancel-reactivation-dates" ng-show="btnToggles.newFromReactivation">Cancel</a><a class="button save-reactivation-dates" ng-show="btnToggles.newFromReactivation">Save</a></span>',
        link: function($scope, element, attrs){
            $scope.btnToggles.newFromReactivation = false;
            element.children('a.show-reactivation-dates').on('click', function(){
                $scope.$apply(function(){
                    $scope.btnToggles.newFromReactivation = !$scope.btnToggles.newFromReactivation
                    if(!$scope.btnToggles.newFromReactivation){
                        $scope.btnToggles.newFromReactivationDate = 0
                    }
                });
            })
            element.children('a.cancel-reactivation-dates').on('click', function(){
                $scope.$apply(function(){
                    $scope.btnToggles.newFromReactivation = !$scope.btnToggles.newFromReactivation
                    $scope.btnToggles.newFromReactivationDate = 0
                });
            })

            element.children('a.save-reactivation-dates').on('click', function(){
                $scope.$apply(function(){
                });
            })
        }
    }
})

app.directive('btnGetCode',function($state , parseData, uuid4){
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="button child-btns">Get <a>Jade Code</a><a> Activity CSV</a></span>',
        scope: true,
        link: function($scope, element){
            element.on('click', function(){
            })
        }
    }
})


app.directive('btnNewAsset',function(){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<span class="button child-btns">New<a> From Blank</a><a> From Template</a></span>',
        link: function($scope, element){
            $scope.btnToggles.newFromNew = false
            element.on('click', function(){
            })
        }
    }
})






//NAVIGATION

app.directive('navBtnSort',function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<a class="button">Quick View</a>',
        link: function($scope, element){
            element.on('click', function(){
                $('#site-asset-container').toggleClass('sort-site-assets');
            })
        }
    }
})

app.directive('navBtnAddFromTemplate',function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<a class="button">Add From Template</a>',
        link: function($scope, element, attrs , ngModel){
        }
    }
})













