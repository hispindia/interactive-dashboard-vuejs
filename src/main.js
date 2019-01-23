// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from "vue";
import App from "./App.vue";
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import mapInit from 'highcharts/modules/map'
import stockInit from 'highcharts/modules/stock'
import treemapInit from 'highcharts/modules/treemap'
import exportingInit from 'highcharts/modules/exporting'
import Router from 'vue-router'
import d2headerBar from 'dhis2-header-vue'
// import addWorldMap from './indiamap'

stockInit(Highcharts)
exportingInit(Highcharts)
mapInit(Highcharts)
treemapInit(Highcharts)
// addWorldMap(Highcharts)
Vue.use(HighchartsVue)
Vue.use(Router)
Vue.use(d2headerBar)


Vue.config.productionTip = true;

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
