import Ember from 'ember';

export default Ember.Component.extend({
  rows: Ember.inject.service(),
  actions: {
    add: function() {
      //console.log("add");
      this.get('rows').add();
    },
    create: function() {
      //console.log("create",this.rows);
      this.get('rows').run();
    },
    update: function() {
      //console.log("update",this.rows);
      this.get('rows').update();
    },
    runLots: function() {
      this.get('rows').runLots();
    },
    clear: function() {
      this.get('rows').clear();
    },
    swapRows: function() {
      this.get('rows').swapRows();
    },
    insertDB: function(){
      this.get('rows').insertDB();
    },
    selectDB: function(){
      this.get('rows').selectDB();
    },
    updateDB: function(){
      this.get('rows').updateDB();
    },
    deleteDB: function(){
      this.get('rows').deleteDB();
    },
    remove(identifier) {
      this.get('rows').remove(identifier);
    },
    select(identifier) {
      this.get('rows').select(identifier);
    }
  }
});
