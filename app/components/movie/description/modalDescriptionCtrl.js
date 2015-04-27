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