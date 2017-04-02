app.filter('slice', function() {
    return function(arr, start, end) {
        if(arr != null){
            return arr.slice(start, end);
        }
    };
});

app.filter('uuidFilter', function() {
    return function (siteAsset, uuid) {
        var items = [];
        angular.forEach(siteAsset, function (value, key) {
            if (siteAsset[key].uuid === uuid && siteAsset[key].uuid != null) {
                items.push(value);
            }
        });
        return items;
    };
});

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
        templateUrl: 'views/siteAssetList.tpl.html',
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
        scope: true
    }
})

////////////////////////////////////////////////////////////////////////
///////////////////////// EDITOR DIRECTIVES //////////////////////////
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
///////////////////////// HOMEPAGE DIRECTIVES //////////////////////////
////////////////////////////////////////////////////////////////////////

//////////////////////////// CHANGE MAIN INFO //////////////////////////

app.directive('changeNotes',function($state , parseData){
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="change-notes"><p>Notes:</p><pre>{{tempCoreInfo.notes}}</pre><textarea placeholder="Notes" ng-value="tempCoreInfo.notes" ng-model="tempCoreInfo.notes"></textarea><a class="button">Exit Editing Mode</a></div>',
        scope: true,
        link: function($scope, element, attrs){
            element.find('pre').on('click' , function(){
                element.addClass('editing-mode')
            })
            element.find('a').on('click' , function(){
                element.removeClass('editing-mode')
            })
        }
    }
})

/////////////////////////// CREATE NEW MODULE //////////////////////////

app.directive('btnChangeDate',function(){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div class="calendar-container"><a ng-click="triggerCalendar()"><i class="fi-calendar"></i>&nbsp;&nbsp; {{tempCoreInfo.month}} / {{tempCoreInfo.day}}&nbsp;&nbsp;&nbsp;<i class="fi-arrow-right"></i>&nbsp;&nbsp;&nbsp;&nbsp; {{tempCoreInfo.endMonth}} / {{tempCoreInfo.endDay}}</a><input style="background-color:transparent;border:0;height:0px;width:0px;padding:0;display:block;overflow:hidden" date-range-picker class="form-control date-picker" ng-model="datePicker.date"/></div>',
        link: function($scope, element, attrs , ngModel){
            element.find('a').on('click' , function(){
                element.find('input').trigger( "click" );
            })
        }
    }
})

/////////////////////////// CREATE NEW MODULE //////////////////////////

app.directive('addModule',function(uuid4, modelTemplates){
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="button add-hp-module" ng-show="editMode"><a><i class="fi-plus"></i> &nbsp;{{addModuleTitle}}</a><input class="formInput" placeholder="1" value="1"></input></span>',
        scope: true,
        link: function($scope, element, attrs){
            $scope.addModuleTitle = attrs.addAssetTitle
            var createElements = function(){
                var ctaCount =  element.find('input').val()  
                var assetType = attrs.addAssetType;
                if(ctaCount < 10){
                    for(i = 0 ; i < ctaCount; i++){
                        var tempModel;
                        var trackingString = $scope.tempCoreInfo.year +'_'+ $scope.tempCoreInfo.month +'_'+ $scope.tempCoreInfo.day
                        
                        if(assetType == 'homepageModules'){
                            tempModel = modelTemplates.getHomepageModel()
                            tempModel.bgcta.tracking = trackingString + '-_-HP_00BTMIMAGE-_-'
                        }
                        if(assetType == 'flyouts'){    
                            tempModel = modelTemplates.getFlyoutModel()
                            tempModel.tracking = trackingString + '-_-TOPNAV_FLYOUT-_-'
                        }
                        if(assetType == 'globalAs'){   
                            tempModel = modelTemplates.getGlobalAModel()
                            tempModel.tracking = trackingString + '-_-GLOBAL_A-_-'
                        }
                        if(assetType == 'globalCs'){  
                            tempModel = modelTemplates.getGlobalCModel()
                            tempModel.tracking = trackingString + '-_-GLOBAL_DROPDOWN-_-'
                        }

                        tempModel.uuid = uuid4.generate();
                        $scope.tempCoreInfo[assetType].push(tempModel);
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
                        var trackingString = $scope.tempCoreInfo.year +'_'+ $scope.tempCoreInfo.month +'_'+ $scope.tempCoreInfo.day;
                        var newUUID = uuid4.generate();
                        var newCta = {"uuid" : uuid4.generate(), "name" : "", "link" : "", "tracking" : trackingString + "-_-HP_00BTM-_-"};
                        var hpModIndex =  parseData.uuidToIndex($scope.tempCoreInfo.homepageModules , attrs.parentModuleUuid);
                        var ctaData = $scope.tempCoreInfo.homepageModules[hpModIndex].ctas;
                        ctaData.push(newCta)
                    }
                }else{
                    alert('Are you nuts?! Try less CTAS.')
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

////////////////////////////////////////////////////////////////////////
///////////////////////// REACTIVATION TOOL ////////////////////////////
////////////////////////////////////////////////////////////////////////

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

app.directive('addReactivationAssets',function(parseData, uuid4, reactivationVarService){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<a class="button text-center confirm-btn ">Save</a>',
        link: function($scope, element, attrs){
            element.on('click' , function(){

                var currentAssetData = parseData.returnIndexes($scope.siteData);
                //Prepare and Save Data to tempCoreInfo
                var sanitizeData = function(x){
                    //For Each Main Resource added to temp data (Homepages, Flyouts, Global A, Global C)
                    for(j = 0; j < x.length; j++){
                        var assetType = x[j];
                        var tempData = angular.copy($scope.tempDataModel[assetType].tempData)
                        var tempList = angular.copy($scope.tempDataModel[assetType].tempList)
                        for(i = 0; i < tempData.length; i++){

                            //Give Resource new UUID
                            tempData[i].uuid = uuid4.generate();
                            //Set Reactivation Flag to True
                            tempData[i].reactivation = 'true';
                            //Set Reativation Date
                            tempData[i].reactivationDate = $scope.reactivationSelectedDate;
                            //Default position to Last
                            tempData[i].rowPosition = '99';
                            // If resources includes one or more CTAS
                            if(assetType == 'homepageModules'){
                                //For Each Sub Resource added to temp data (CTAS in Homepages)
                                for(y = 0; y < tempData[i].ctas.length; y++){
                                    //Give resource new UUID
                                    tempData[i].ctas[y].uuid = uuid4.generate();
                                }
                            }
                            //If scope variable doesnt exist, create it
                            if($scope.reactivationModel.reactivationAsset[assetType] == null){
                                $scope.reactivationModel.reactivationAsset[assetType] = []
                            }
                            //Push To Site Asset Scope
                            $scope.reactivationModel.reactivationAsset[assetType].push(tempData[i])
                        }

                    }
                }

                sanitizeData(['homepageModules','flyouts','globalAs','globalCs'])
                //Reset tempDataModel
                delete $scope.tempDataModel
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

                //Reset reactivation vars
                reactivationVarService.clear();
                $scope.$apply();
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
/*
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
        template: '<span class="button child-btns"><i class="fi-clipboard-pencil"></i> &nbsp;Get <a class="jade-btn">Jade Code</a><a> Activity CSV</a></span>',
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
        template: '<span class="button child-btns">New<a ui-sref="main.editor.newAsset"> From Blank</a><a> From Template</a></span>',
        link: function($scope, element){
            element.find('a').on('click', function(){
                $scope.assetNavToggles.assetListMonth = null;
                $scope.reactivationVars.assetListMonth = null;
                $scope.reactivationVars.assetListDate = null;
                $scope.assetNavToggles.assetListDate = null;
            })
        }
    }
})
*/





//NAVIGATION

app.directive('navBtnSort',function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<a class="button"><i class="fi-arrows-in"></i> &nbsp;Quick View</a>',
        link: function($scope, element){
            element.on('click', function(){
                $('#site-asset-container').toggleClass('sort-site-assets');
            })
        }
    }
})
app.directive('navBtnTable',function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<a class="button"><i class="fi-align-justify"></i> &nbsp;Table View</a>',
        link: function($scope, element){
            element.on('click', function(){
                $('#site-asset-container').toggleClass('table-site-assets');
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


////////////////////////////////////////////////////////////////////////
/////////////////////////// CUSTOM PLUGINS  ////////////////////////////
////////////////////////////////////////////////////////////////////////


app.directive('stickyNav',function(){
    return {
        restrict: 'C',
        replace: true,
        template: '<a class="button">Add From Template</a>',
        link: function($scope, element, attrs , ngModel){
        }
    }
})

app.directive('btnDateRangePicker',function(){
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div><a class="button"><span ng-show="datePicker.status">Pick</span><span ng-hide="datePicker.status">Change</span> Date</a><input date-range-picker class="form-control date-picker" ng-model="datePicker.date"/></div>',
        link: function($scope, element, attrs , ngModel){
            element.find('a').on('click' , function(){
                element.find('input').trigger( "click" );
            })
        }
    }
})








