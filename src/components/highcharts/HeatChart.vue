<template>
  <highcharts :options="mapOptions" class="map"></highcharts>
</template>

<script>
import variables from "../../config.js";
import axios from "axios";
import { EventBus } from "../../event-bus";
import Highcharts from "highcharts";
export default {
  data() {
    return {
      
      diseases: variables.diseases_yll,
      measureFilter: variables.yll,
      defaultIndiaApi: "",
      mapOptions: {
        chart: {
          type: "heatmap",
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1
        },

        title: {
          text: "Heat Map"
        },

        xAxis: {
          categories: [],
        //   opposite : true
        },

        yAxis: {
          categories: [],
          title: null
        },

        colorAxis: {
          min: 0,
          max: 50000,
          minColor: "#FFFFFF",
          maxColor: Highcharts.getOptions().colors[0]
        },

        legend: {
          align: "right",
          layout: "vertical",
          margin: 0,
          verticalAlign: "top",
          y: 25,
          symbolHeight: 280
        },

        tooltip: {
          formatter: function() {
            return (
              "<b>" +
              this.series.xAxis.categories[this.point.x] +
              "</b> sold <br><b>" +
              this.point.g +
              "</b> items on <br><b>" +
              this.series.yAxis.categories[this.point.y] +
              "</b>"
            );
          }
        },

        series: [
          {
            name: "Heat Map",
            borderWidth: 1,
            data: [],
            dataLabels: {
              enabled: true,
              color: "#000000"
            }
          }
        ]
      },

      subtitle: {
        text:
          'Click points to drill down. Source: <a href="http://apps.who.int/gho/data/node.main.12?lang=en">WHO</a>.'
      },
      title: {
        text: "Global Mortality Rate 2012, per 100 000 population"
      }
    };
  },
  watch: {
    measureFilter: function(value) {
      if (value == variables.yll) this.diseases = variables.diseases_yll;
      else if (value == variables.yld) this.diseases = variables.diseases_yld;
      else if (value == variables.daly) this.diseases = variables.diseases_daly;
      else this.diseases = variables.diseases_deaths;
      this.loadMapData();
    }
  },
  mounted() {
    this.getApiData();
    EventBus.$on("filters", this.setFilters);
  },
  methods: {
      setColors: function() {
      var count1 = 1,
        count2 = 1,
        count3 = 1,
        count4 = 1;
      for (let g = 0; g < Object.keys(this.diseases[0]).length; g++) {
        var key = Object.keys(this.diseases[0])[g];
        var index = this.diseases[0][key].group;
        if (index == 0) {
          this.diseases[0][key].color = this.getColorShades(
            128,
            0,
            0,
            count1
          );
          count1++;
        } else if (index == 1) {
          this.diseases[0][key].color = this.getColorShades(
            0,
            128,
            0,
            count2
          );
          count2++;
        } else if (index == 2) {
          this.diseases[0][key].color = this.getColorShades(
            255,
            165,
            0,
            count3
          );
          count3++;
        } else {
          this.diseases[0][key].color = this.getColorShades(
            0,
            0,
            255,
            count4
          );
          count4++;
        }
      }
    },
    getColorShades: function(r, g, b, x) {
      var o =  x>3 && x<6 ? 0.9 : x>=6 && x<10 ? 0.75 : x>=10 && x<16 ? 0.60 : x>=16 && x<20 ? 0.45 : x>=20 ? 0.3 : 1;
      x = x+4;
      r = (x * r) / 10;
      g = (x * g) / 10;
      b = (x * b) / 10;
      return "rgb(" + r  + "," + g + "," + b + "," + o + ")";
    },
    getApiData: function() {
      $("#loader").show();
      this.setApis();
      axios
        .get(this.defaultIndiaApi)
        .then(response => {
            this.setColors();
          this.mapOptions.series[0].data = [];
          var dataloop = "";
          response.data.rows.length == 0
            ? (this.chartOptions.series = [],alert("No data at this organisation Unit!"), $("#loader").hide())            
            : (dataloop = response.data.rows);
          this.sortDataByLoc(dataloop);
        })
        .catch(error => {
          console.log(error);
        });
    },
    sortDataByLoc: function(dataloop) {
      //   $("#btnLocation").addClass("selected-option");
      let temp = JSON.parse(JSON.stringify(this.diseases));
      var temp_arr = [];
      var temp_x = [];
      var temp_y = [];
      var x = 0;
      for (let j = 0; j < Object.keys(variables.stateNames[0]).length; j++) {
        var turn_flag = false;
        var y = 0;
        for (let i = 0, len = dataloop.length; i < len; i++) {
          var disease_id = dataloop[i][0];
          var value = parseFloat(dataloop[i][3]);
          var stateData = dataloop[i][2];

          if (stateData == Object.keys(variables.stateNames[0])[j]) {
            var stateName =
              variables.stateNames[0][Object.keys(variables.stateNames[0])[j]];
            if (!temp_x.includes(stateName)) temp_x[stateName] = stateName;
            if (!temp_y.includes((this.diseases[0][disease_id].name))) temp_y[this.diseases[0][disease_id].name] = this.diseases[0][disease_id].name ;
            // temp_arr.push([x, y, value]);
            temp_arr.push({
                x : x,
                y : y,
                name : this.diseases[0][disease_id].index,
                g : value,
                value : this.diseases[0][disease_id].index,
                color : this.diseases[0][disease_id].color,
            });
            turn_flag = true;
            y += 1;
          }
        }
        if (turn_flag) {
             x += 1;
        }

        if (j == Object.keys(variables.stateNames[0]).length - 1) {
          var vm = this;
          console.log(temp_arr);
          console.log(temp_x);
          console.log(temp_y);
          setTimeout(function() {
            vm.mapOptions.series[0].data = [...temp_arr];
            vm.mapOptions.xAxis.categories = [...Object.values(temp_x)];
            vm.mapOptions.yAxis.categories = [...Object.values(temp_y)];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    setApis: function() {
      this.defaultIndiaApi =
        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
        variables.allouIDs +
        "&dimension=dx:" +
        this.measureFilter +
        "&displayProperty=NAME&outputIdScheme=UID";
    }
  }
};
</script>
 <style scoped>
.map {
  min-height: 1200px;
}
</style>