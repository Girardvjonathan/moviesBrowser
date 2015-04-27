/**
 * Created by jgirard-viau on 2/2/15.
 */

(function (window) {
'use strict';

    angular.module('shared', []);
    window.app = angular.module('app', ['ui.router', 'shared',  'ui.bootstrap']);

})(window);
