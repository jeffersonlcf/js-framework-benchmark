import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
    ajax: Ember.inject.service(),
    host: 'https://js-benchmark-185712.appspot.com/api/data',
    //host: 'http://localhost:3000/api/data',
    async: false,
    contentType: 'application/json; charset=utf-8'
  });