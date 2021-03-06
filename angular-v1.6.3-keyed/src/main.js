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
        //apiUrl: 'http://localhost:3000/api/data'
        apiUrl: 'https://js-benchmark-185712.appspot.com/api/data'
    })
    .controller('HomeController', HomeController);