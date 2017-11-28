import {HttpClient, json} from 'aurelia-fetch-client';

let httpClient = new HttpClient();

httpClient.configure(config => {
    config
      .withBaseUrl('https://js-benchmark-185712.appspot.com/api/data')
      //.withBaseUrl('http://localhost:3000/api/data')
      
      .withInterceptor({
        request(request) {
          //console.log(`Requesting ${request.method} ${request.url}`);
          return request; // you can return a modified Request, or you can short-circuit the request by returning a Response
        },
        response(response) {
          //console.log(`Received ${response.status} ${response.url}`);
          return response; // you can return a modified Response
        }
      });
  })

  var startTime;
  var lastMeasure;
  var startMeasure = function(name) {
      startTime = performance.now();
      lastMeasure = name;
  }
  var stopMeasure = function() {
      window.setTimeout(function() {
          var stop = performance.now();
          console.log(lastMeasure+" took "+(stop-startTime));
      }, 0);
  }


function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

export class Store {
    constructor() {
        this.data = [];
        this.selected = undefined;
        this.id = 1;
        this.jsonData = "";
        this.tr = "";
    }
    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++)
            data.push({id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
        return data;
    }
    sendRequest() {
        if (this.tr == "GET"){
            httpClient.fetch('/', {
                method: this.tr
             })
              .then(response => response.json())
              .then(data => {
                 this.data = data;
                 stopMeasure();
              });
        }else if (this.tr == "DELETE"){
            httpClient.fetch('/', {
                method: this.tr
             })
              .then(this.data = [], stopMeasure());
        }
        else{
            httpClient.fetch('/', {
                method: this.tr,
                body: json(this.jsonData)
             })
              .then(response => response.json())
              .then(data => {
                 this.data = data;
                 stopMeasure();
              });
        }
     }  
    updateData(mod = 10) {
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
    }
    delete(id) {
        const idx = this.data.findIndex(d => d.id==id);
        this.data = this.data.filter((e,i) => i!=idx);
        return this;
    }
    deleteNext(id) {
        const idx = this.data.findIndex(d => d.id==id);
        this.data = this.data.filter((e,i) => i!=idx+1);
        return this;
    }
    run() {
        this.data = this.buildData();
        this.selected = undefined;
    }
    add() {
        this.data = this.data.concat(this.buildData(1000));
        this.selected = undefined;
    }
    update() {
        this.updateData();
    }
    select(id) {
        this.selected = id;
    }
    hideAll() {
        this.backup = this.data;
        this.data = [];
        this.selected = undefined;
    }
    showAll() {
        this.data = this.backup;
        this.backup = null;
        this.selected = undefined;
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = undefined;
    }
    clear() {
        this.data = [];
        this.selected = undefined;
    }
    swapRows() {
        if(this.data.length > 998) {
            var a = this.data[1];
            var b = this.data[998];
            this.data.splice(1, 1, b);
            this.data.splice(998, 1, a);
        }
    }
    insertDB() {
        startMeasure("insertDB");
        this.selected = undefined;
        this.tr = "POST";
        this.jsonData = this.buildData();
        this.sendRequest();
    }
    selectDB() {
        startMeasure("selectDB");
        this.selected = undefined;
        this.tr = "GET";
        this.sendRequest();
    }
    updateDB() {
        startMeasure("updateDB");
        this.selected = undefined;
        this.updateData();
        this.tr = "PUT";
        this.jsonData = this.data;
        this.sendRequest();
    }
    deleteDB() {
        startMeasure("deleteDB");
        this.selected = undefined;
        this.tr = "DELETE";
        this.sendRequest();
    }
}
