/**
 * Created by jgirard-viau on 2/2/15.
 */

(function (window) {
'use strict';

    angular.module('shared', []);
    window.app = angular.module('app', ['ui.router', 'shared',  'ui.bootstrap']);

})(window);

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

(function () {
    'use strict';

    angular
        .module('app')
        .controller('mediaCtrl', ['$http', '$stateParams', '$state', '$modal','$q', Media]);

    function Media($http, $stateParams, $state, $modal, $q) {
        var vm = this;
        var search = $stateParams.query;
        var page = $stateParams.page;
        const KEY = '?api_key=1b1497adc03fb28cf8df7fa0cdaed980';

        var CONFIG_URL = '';
        var CONFIG_DESC = '';
        var CONFIG_SEARCH = '';

        if ($state.current.name == 'movie') {
            CONFIG_URL = 'https://api.themoviedb.org/3/discover/movie' + KEY + '&page=';
            CONFIG_DESC = 'https://api.themoviedb.org/3/movie/';
            CONFIG_SEARCH = 'http://api.themoviedb.org/3/search/movie' + KEY + '&page=';
        } else {
            CONFIG_URL = 'https://api.themoviedb.org/3/discover/tv' + KEY + '&page=';
            CONFIG_DESC = 'https://api.themoviedb.org/3/tv/';
            CONFIG_SEARCH = 'http://api.themoviedb.org/3/search/tv' + KEY + '&page=';
        }

        //voir avec angular si je peux juste pas le chercher
        var $search = $('#search');
        $search.keypress(function (e) {
            if (e.keyCode == 13) {
                search = $search.val();
                $state.go($state.current.name, {query: search});
            }
        });

        vm.init = function () {
            vm.page = 1;
            vm.maxPage = 1;
            vm.media = [];
            loadData();
        };

        vm.searchFilter = function (input) {
            if (input) {
                return input.title.toLowerCase().indexOf(vm.search.toLowerCase()) >= 0;
            }
            return true;

        };

        function loadData() {
            if (search != '' && typeof search === 'string' && search.length < 64) {
                $http.get(CONFIG_SEARCH + vm.page + '&query=' + search).success(function (data) {
                    vm.media = data.results;
                    vm.maxPage = data.total_pages;
                    vm.page = data.page;
                    vm.totalResults = data.total_results;
                });
                return;
            }
            $http.get(CONFIG_URL + vm.page).success(function (data) {
                vm.media = data.results;
                vm.maxPage = data.total_pages;
                vm.page = data.page;
                vm.totalResults = data.total_results;
            });
        }


        vm.getPosterMedium = function (url) {
            if (url === null) {
                return 'assets/img/cover-placeholder.jpg';
            }
            return 'http://image.tmdb.org/t/p/w300' + url;
        };

        vm.onChange = function (number) {
            //switch case
            switch (number) {
                case 0:
                    if (vm.page > 1) vm.page--;
                    loadData();
                    break;
                case 6:
                    if (vm.page < vm.maxPage) vm.page++;
                    loadData();
                    break;
                default:
                    if (number > 0 && number < vm.maxPage) {
                        vm.page = number;
                        loadData();
                    }
            }
        };

        // https://api.themoviedb.org/3/movie/12?api_key=1b1497adc03fb28cf8df7fa0cdaed980
        vm.getMoreInfo = function getMoreInfo(id) {
            var deferred = $q.defer();
            $http.get(CONFIG_DESC + id + KEY).success(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        };

        vm.open = function (mediaId) {
            // We have to wait until the API call has been made
            vm.getMoreInfo(mediaId).then(function (data) {
                var modalInstance = $modal.open({
                    controller: "modalDescriptionCtrl as description",
                    templateUrl: 'assets/partials/components/movie/description/description.tpl.html',
                    resolve: {
                        media: function()
                        {
                            return data;
                        }
                    }
                });
            });
        };

        vm.init();

    }
})();
(function () {
    'use strict';

    angular.module('app').controller('tvCtrl', ['$http', TV]);
    function TV($http) {
        var vm = this;
        const KEY = '?api_key=1b1497adc03fb28cf8df7fa0cdaed980';
        const CONFIG_URL = 'https://api.themoviedb.org/3/discover/tv'+KEY+'&page=';
        const CONFIG_DESC = 'https://api.themoviedb.org/3/tv/';
        const CONFIG_SEARCH = 'http://api.themoviedb.org/3/search/tv'  + KEY +  '&page=';

       var $search = $('#search');
        $search.keypress(function (e) {
            console.log('ok');
            if (e.keyCode == 13) {
                loadData();
                vm.page = 1;
            }
        });

        vm.init = function () {
            vm.page = 1;
            vm.maxPage = 1;
            vm.tv = [];
            loadData();
        };

        vm.searchFilter = function (input) {
            if (input) {
                return input.name.indexOf(vm.search) >= 0;
            }
            return true;

        };

        function loadData() {
            var search = $search.val();
            if (search != '' && typeof search === 'string' && search.length < 64 ) {
                $http.get(CONFIG_SEARCH + vm.page + '&query='+search).success(function (data) {
                    vm.tv = data.results;
                    vm.maxPage = data.total_pages;
                    vm.page = data.page;
                    vm.totalResults = data.total_results;
                });
                 return;
            }
            $http.get(CONFIG_URL + vm.page).success(function (data) {
                    vm.tv = data.results;
                    vm.maxPage = data.total_pages;
                    vm.page = data.page;
                    vm.totalResults = data.total_results;
                });
        }

        vm.getPosterMedium = function (url) {
            if (url === null) {
                return 'assets/img/cover-placeholder.jpg';
            }
            return 'http://image.tmdb.org/t/p/w300' + url;
        };

        vm.getPosterBig = function (url) {
            if (url === null) {
                return '';
            }
            return 'http://image.tmdb.org/t/p/w500/' + url;
        };

        vm.onChange = function (number) {
            //switch case
            switch (number) {
                case 0:
                    if (vm.page > 1) vm.page--;
                    loadData();
                    break;
                case 6:
                    if (vm.page < vm.maxPage) vm.page++;
                    loadData();
                    break;
                default:
                    if (number > 0 && number < vm.maxPage) {
                        vm.page = number;
                        loadData();
                    }
            }
        };

        // https://api.themoviedb.org/3/tv/12?api_key=1b1497adc03fb28cf8df7fa0cdaed980
        vm.getMoreInfo = function getMoreInfo(id) {
            $http.get(CONFIG_DESC + id + KEY).success(function (data) {
                vm.overview = data.overview;
                vm.tagline = data.tagline;
            });
        };

        vm.init();
    }
})();
/**
 * Created by jgirard-viau on 2/4/15.
 */
(function () {
    angular.module('shared').directive('pagination', Pagination);
    function Pagination(){
        return {
            restrict: 'E',
            transclude: false,
            scope: {
                page: '=',
                maxPage: '=',
                onChange: '&'
            },
            link: function (scope) {
                var adjust = function () {
                    if (scope.page < 3) {
                        scope.pageNumber1 = 1;
                        scope.pageNumber2 = 2;

                        scope.pageNumber3 = 3;
                        scope.pageNumber4 = 4;
                        scope.pageNumber5 = 5;
                    }
                    else if (scope.page > scope.maxPage - 2) {
                        scope.pageNumber1 = scope.maxPage - 4;
                        scope.pageNumber2 = scope.maxPage - 3;
                        scope.pageNumber3 = scope.maxPage - 2;
                        scope.pageNumber4 = scope.maxPage - 1;
                        scope.pageNumber5 = scope.maxPage;
                    }
                    else {
                        scope.pageNumber1 = scope.page - 2;
                        scope.pageNumber2 = scope.page - 1;
                        scope.pageNumber3 = scope.page;
                        scope.pageNumber4 = scope.page + 1;
                        scope.pageNumber5 = scope.page + 2;
                    }
                };
                adjust();
                scope.$watch('page', adjust);
            },
            templateUrl: 'assets/partials/shared/pagination/pagination.tpl.html',
            replace: true
        };
    }
})();
/**
 * Created by jgirard-viau on 3/31/15.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('modalDescriptionCtrl', ['$http', '$stateParams', '$state', 'media', Description]);

    function Description($http, $stateParams, $state, media) {
        var vm = this;

        vm.getPosterBig = function (url) {
            console.log('hi ho');
            if (url === null) {
                return '';
            }
            return 'http://image.tmdb.org/t/p/w500' + url;
        };

        vm.media = media;
    }
})();