var app = angular.module('assetGenerator', ['ui.router' , 'ui.sortable' , 'uuid', 'ngAnimate']);

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
    })
    .state('main.editor.sites', {
      url: "/asset/:id",
      views: {
        'siteAssetView' : {
          templateUrl: "views/siteAsset.tpl.html",
          controller: "assetCtrl"
        },
        'jadeAssetView' : {
          templateUrl: "views/jadeAsset.tpl.html",
          controller: "jadeCreatorCtrl"
        },
        'reactivationAssetView' : {
          templateUrl: "views/reactivationAsset.tpl.html",
          controller: "reactivateCtrl"
        }
      }
    })
    .state('main.editor.existingsite', {
      url: "/existingsite",
      params: {'id':'existingite'},
      views: {
        'newSiteAssetView' : {
          templateUrl: "views/newSiteAsset.tpl.html",
          controller: "newSiteAssetCtrl",
          reload: true
        }
      }
    })
    .state('main.editor.newsite', {
      url: "/newsite",
      params: {'id':'newSite'},
      views: {
        'newSiteAssetView' : {
          templateUrl: "views/newSiteAsset.tpl.html",
          controller: "newSiteAssetCtrl",
          reload: true
        }
      }
    })
});
