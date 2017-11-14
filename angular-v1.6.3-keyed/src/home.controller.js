var startTime;
var lastMeasure;

var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
};
var stopMeasure = function() {
    window.setTimeout(function() {
        var stop = performance.now();
        console.log(lastMeasure+" took "+(stop-startTime));
    }, 0);
};

export class HomeController {
    constructor($scope, $http,config) {
        this.$scope = $scope;
        this.$http = $http;
        this.config = config;
        this.start = 0;
        this.data = [];
        this.id = 1;
        this.jsonData = "";
    }

    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.id++, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
        }
        return data;
    }
    printDuration() {
        stopMeasure();
    }
    _random(max) {
        return Math.round(Math.random() * 1000) % max;
    }

    cleanDB() {
        this.$http({
            method: 'DELETE',
            url: ctrl.config.apiUrl
        }).then(function successCallback(response){
            console.log(response.status);
            }, function errorCallback (response){
                console.error('Error occurred:', response.status, response.data);
        });
    }
    
    add() {
        startMeasure("add");
        this.start = performance.now();
        this.data = this.data.concat(this.buildData(1000));
        this.printDuration();
    }
    select(item) {
        startMeasure("select");
        this.start = performance.now();
        this.selected = item.id;
        this.printDuration();
    }
    del(item) {
        startMeasure("delete");
        this.start = performance.now();
        const idx = this.data.findIndex(d => d.id===item.id);
        this.data.splice(idx, 1);
        this.printDuration();
    }
    update() {
        startMeasure("update");
        this.start = performance.now();
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
        this.printDuration();
    }
    run() {
        startMeasure("run");
        this.start = performance.now();
        this.data = this.buildData();
        this.printDuration();
    };
    runLots() {
        startMeasure("runLots");
        this.start = performance.now();
        this.data = this.buildData(10000);
        this.selected = null;
        this.printDuration();
    };
    clear() {
        startMeasure("clear");
        this.start = performance.now();
        this.data = [];
        this.selected = null;
        this.printDuration();
    };
    swapRows() {
    	startMeasure("swapRows");
    	if(this.data.length > 10) {
    		var a = this.data[4];
    		this.data[4] = this.data[9];
    		this.data[9] = a;
    	}
    	this.printDuration();
    };
    insertDB() {
        startMeasure("insertDB");
        this.start = performance.now();
        var ctrl = this; //set controller as a variable in the scope of the function.
        this.jsonData = angular.toJson(this.data.concat(this.buildData(1000)));
        this.$http({
            method: 'POST',
            data: this.jsonData,
            url: ctrl.config.apiUrl
        }).then(function successCallback(response){
            ctrl.printDuration(); //finish measuing the insert
            //ctrl.cleanDB();
            }, function errorCallback (response){
                console.error('Error occurred:', response.status, response.data);
        });
    };
    selectDB() {
        startMeasure("selectDB");
        this.start = performance.now();
        var ctrl = this; //set controller as a variable in the scope of the function.
        this.$http({
            method: 'GET',
            url: ctrl.config.apiUrl
        }).then(function successCallback(response){
            ctrl.data = response.data;
            ctrl.printDuration();
            }, function errorCallback (response){
                console.error('Error occurred:', response.status, response.data);
        });
    };
    updateDB() {
        startMeasure("updateDB");
        this.start = performance.now();
        var ctrl = this; //set controller as a variable in the scope of the function.
        for (let i=0;i<this.data.length;i+=10) 
            this.data[i].label += ' !!!';
            
        this.jsonData = angular.toJson(this.data);
        this.$http({
            method: 'PUT',
            data: this.jsonData,
            url: ctrl.config.apiUrl
        }).then(function successCallback(response){
            //ctrl.printDuration();
            }, function errorCallback (response){
                console.error('Error occurred:', response.status, response.data);
        });
        this.printDuration();
    };
    deleteDB() {
        startMeasure("deleteDB");
        this.start = performance.now();
        var ctrl = this; //set controller as a variable in the scope of the function.
        this.$http({
            method: 'DELETE',
            url: ctrl.config.apiUrl
        }).then(function successCallback(response){
            ctrl.data = [];
            ctrl.selected = null;
            ctrl.printDuration();
            }, function errorCallback (response){
                console.error('Error occurred:', response.status, response.data);
        });
    };
};

HomeController.$inject = ['$scope','$http','config'];
