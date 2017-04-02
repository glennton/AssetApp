var app = angular.module('assetGenerator', ['ui.router' , 'ui.sortable' , 'uuid', 'ngAnimate', 'afklStickyElement', 'daterangepicker' ]);

app.config(function($stateProvider) {

  $stateProvider
    .state('main', {
      url: "/",
      templateUrl: "views/main.tpl.html",
      controller: "mainCtrl"
    })
    .state('main.editor', {
      url: "editor",
      templateUrl: "views/editor.tpl.html",
      controller: "editorCtrl",
      resolve: {
        siteAssetData : function(siteAssetDataService){
          return siteAssetDataService.get()
        }
      }
    })
    .state('main.editor.sites', {
      url: "/asset/:id",
      params: {'page':'assets'},
      views: {
        'siteAssetView' : {
          templateUrl: "views/siteAsset.tpl.html",
          controller: "assetCtrl"
        },
        'siteAssetNavView' : {
          templateUrl: "views/siteAssetNav.tpl.html",
          controller: "assetNavCtrl"
        },
        'reactivationMenuAddMenu' : {
          templateUrl: "views/reactivationAddMenu.tpl.html",
          controller: "reactivateAddCtrl"
        },
        'reactivationView' : {
          templateUrl: "views/reactivation.tpl.html",
          controller: "reactivateCtrl"
        },
        'reactivationNavView' : {
          templateUrl: "views/reactivationNav.tpl.html",
          controller: "reactivateNavCtrl"
        }
      }
    })
    .state('main.editor.newAsset', {
      url: "/newAsset",
      params: {'page':'newAsset'},
      templateUrl: "views/newAsset.tpl.html",
      controller: "newAssetCtrl"
    })
    .state('main.editor.newAsset.create', {
      url: "/create",
      views: {
        'reactivationView' : {
          templateUrl: "views/reactivation.tpl.html",
          controller: "reactivateCtrl"
        },
        'reactivationNavView' : {
          templateUrl: "views/reactivationNav.tpl.html",
          controller: "reactivateNavCtrl"
        }
      }
    })
});
