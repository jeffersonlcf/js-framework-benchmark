import { default as jQuery } from 'jquery';
import { default as angular } from 'angular';
import { HomeController } from './home.controller';

angular
    .module('app', [])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])
    .run(() => {
        console.info(angular.version.full);
    })
    .constant('config',{
        apiUrl: 'https://js-benchmark-185712.appspot.com/api/data'    
    })
    .controller('HomeController', HomeController);