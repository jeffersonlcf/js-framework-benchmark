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

function measurePromise(fn) {
    var onPromiseDone = function () { return performance.now() - start; };
    var start = performance.now();
    return fn().then(onPromiseDone, onPromiseDone);
}

export class HomeController {
    constructor($scope, $http,config) {
        this.$scope = $scope;
        this.$http = $http;
        this.config = config;
        this.start = 0;
        this.data = [];
        this.id = 1;
        this.jsonData = "";
        this.tr = "";
        this.apiUrl = config.apiUrl;
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

    sendRequest(){
        var ctrl = this; //set controller as a variable in the scope of the function.
        if (this.tr != "DELETE"){
            this.$http({
                method: this.tr,
                url: this.apiUrl,
                data: this.jsonData
            }).then(function successCallback(response){
                ctrl.data = response.data;
                ctrl.printDuration();
                }, function errorCallback (response){
                    console.error('Error occurred:', response.status, response.data);
                })
        }else{
            this.$http({
                method: this.tr,
                url: this.apiUrl,
            }).then(function successCallback(response){
                ctrl.data = [];
                ctrl.selected = null;
                ctrl.printDuration();
                }, function errorCallback (response){
                    console.error('Error occurred:', response.status, response.data);
                })
        }
    };

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
    	if(this.data.length > 998) {
    		var a = this.data[1];
    		this.data[1] = this.data[998];
    		this.data[998] = a;
    	}
    	this.printDuration();
    };
    insertDB() {
        startMeasure("insertDB");
        this.start = performance.now();
        this.tr = 'POST';
        this.jsonData = angular.toJson(this.buildData());
        this.sendRequest();
    };
    selectDB() {
        startMeasure("selectDB");
        
        this.start = performance.now();
        this.tr = 'GET';
        this.sendRequest();
    };
    updateDB() {
        startMeasure("updateDB");
        this.start = performance.now();
        this.tr = 'PUT';
        for (let i=0;i<this.data.length;i+=10) 
            this.data[i].label += ' !!!';
        this.jsonData = angular.toJson(this.data);
        this.sendRequest();
    };
    deleteDB() {
        startMeasure("deleteDB");
        this.start = performance.now();
        this.tr = 'DELETE';
        this.sendRequest();
    };
};

HomeController.$inject = ['$scope','$http','config'];
