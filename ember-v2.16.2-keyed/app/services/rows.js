import Ember from 'ember';

function _random(max) {
  return Math.round(Math.random()*1000)%max;
}

function measurePromise(fn) {
  var onPromiseDone = function () { return performance.now() - start; };
  var start = performance.now();
  return fn().then(onPromiseDone, onPromiseDone);
}

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

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  data: [],
  selected: undefined,
  id: 1,
  jsonData: "",
  tr: "",
  buildData(count = 1000) {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++) {
      var row = {
        id: this.id++,
        label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
      };
      data.push(row);
    }
    return data;
  },
  updateData(mod = 10) {
    var data = this.data.map(function(data, i) {
      if (i%mod === 0) {
        return Object.assign({}, data, {label: data.label + ' !!!'});
      } else {
        return data;
      }
    });
    return data;
  },
  sendRequest(){
    if (this.tr != "DELETE"){
      this.get('ajax').raw('/', {
        method: this.tr,
        data: this.jsonData
      }).then(({ response }) => {
        this.set('data',response);
        stopMeasure();
      })
      .catch(({ response, jqXHR, payload }) => console.log(payload));
    }else{
      this.get('ajax').raw('/', {
        method: this.tr,
      }).then(this.set('data', []), stopMeasure())
      .catch(({ response, jqXHR, payload }) => console.log(payload));
    }
  },
  remove(id) {
    startMeasure("delete");
    this.set('data', this.data.filter((d) => d.id!==id));
    this.set('selected', undefined);
    stopMeasure();
  },
  run() {
    startMeasure("run");
    this.set('data', this.buildData());
    this.set('selected', undefined);
    stopMeasure();
  },
  add() {
    startMeasure("add");
    this.set('data', this.data.concat(this.buildData(1000)));
    stopMeasure();
  },
  update() {
    startMeasure("update");
    this.set('data', this.updateData());
    stopMeasure();
  },
  select(id) {
    startMeasure("select");
    this.set('selected', id);
    stopMeasure();
  },
  runLots() {
	startMeasure("runLots");
    this.set('data', this.buildData(10000));
    this.set('selected', undefined);
	stopMeasure();
  },
  clear() {
	startMeasure("clear");
    this.set('data', []);
    this.set('selected', undefined);
	stopMeasure();
  },
  swapRows() {
  	startMeasure("swapRows");
    if(this.data.length > 998) {
	  let d1 = this.data[1];
	  let d998 = this.data[998];

	  var data = this.data.map(function(data, i) {
	    if(i === 1) {
	    	return d998;
	    }
	    else if(i === 998) {
	    	return d1;
	    }
	    return data;
	  });
	  this.set('data', data);
	}
	stopMeasure();
  },
  insertDB() {
    startMeasure('insertDB');    
    this.jsonData = JSON.stringify(this.buildData(1000));
    this.tr = 'POST'
    this.sendRequest();
  },
  selectDB() {
    startMeasure('selectDB');
    this.tr = 'GET'
    this.jsonData = ''
    this.sendRequest();
  },
  updateDB() {
    startMeasure('updateDB'); 
    for (let i=0;i<this.data.length;i+=10) 
      this.data[i].label += ' !!!';
    this.tr = 'PUT'
    this.jsonData = JSON.stringify(this.data);
    this.sendRequest();
  },
  deleteDB() {
    startMeasure('deleteDB');
    this.tr = 'DELETE'
    this.jsonData = ''
    this.sendRequest();
  }
  
});
