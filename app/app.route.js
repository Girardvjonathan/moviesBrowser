/**
 * Created by jgirard-viau on 3/18/15.
 */

(function () {
    'use strict';
    angular
        .module('app')
        .config(['$locationProvider', '$urlRouterProvider', '$stateProvider', function ($locationProvider, $urlRouterProvider, $stateProvider) {
            $urlRouterProvider.otherwise('/movie//1');
            var query = '.*';

            $stateProvider
                .state('movie', {
                    url: '/movie/:query/{page:[0-9]{1,8}}',
                    templateUrl: 'assets/partials/components/movie/movie.tpl.html',
                    controller: 'mediaCtrl as media'
                })
                .state('tvFeature', {
                    url: '/tv/',
                    templateUrl: 'assets/partials/components/tvshow/tv.tpl.html',
                    controller: 'mediaCtrl as media'
                })
                .state('tv', {
                    url: '/tv/:query/{page:[0-9]{1,8}}',
                    templateUrl: 'assets/partials/components/tvshow/tv.tpl.html',
                    controller: 'mediaCtrl as media'
                })
                .state('about', {
                    url: '/about',
                    templateUrl: 'assets/views/about.html'
                })
                 .state('contact', {
                    url: '/contact',
                    templateUrl: 'assets/views/contact.html'
                });
                //.state('tv.description');
        }]);
})();
