<template>
  <highcharts id='allcharts' :options="mapOptions" class="heatmap" ref="heatmap"></highcharts>
</template>

<script>
import variables from "../../config.js";
import axios from "axios";
import { EventBus } from "../../event-bus";
import Highcharts from "highcharts";
import clicks from "../../catch-clicks";
export default {
  data() {
    return {
      map_arr:[],
      diseases: variables.diseases_yll,
      measureFilter: variables.yll,
      defaultIndiaApi: "",
      mapOptions: {
        chart: {
          type: "heatmap",
          marginTop: 150,
          // spacingTop:100,
          marginBottom: 50,
          plotBorderWidth: 0,
          borderColor: "white"
        },

        title: {
          text: "Heat Map"
        },

        xAxis: {
          categories: [],
          className: "xAxis",
          title: "States",

          labels: {
            formatter: function() {
              return (
                "<span class='xaxis-labels' id='" +
                this.value.split(" ").join("") +
                "'>" +
                this.value +
                "</span>"
              );
            },
            style: {
              cursor: "pointer"
            },
            useHTML: true
          },
          opposite: true
        },

        yAxis: {
          categories: [],
          className: "yaxis",
          title: "Diseases",
          labels: {
            formatter: function() {
              return "<b>" + this.value + "</b>";
            }
          }
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
              "<br>" +
              this.point.value +
              "<br>" +
              this.series.yAxis.categories[this.point.y] +
              "</b>"
            );
          }
        },

        series: [
          {
            name: "Heat Map",
            borderWidth: 4,
            borderColor: "white",
            className: "seriesmap",
            id: "series",
            useHTML: true,
            data: [],
            dataLabels: {
              enabled: true,
              color: "#000000",
              formatter: function() {
                return this.point.point;
              }
            },
            animation: {
              duration: 1000
            },
            events: {
              click: function(event) {}
            },
            point: {},
            turboThreshold: 0,
            states: {
              hover: {
                halo: {
                  fill: "gray"
                }
              }
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
    EventBus.$on("catchclicks", this.updateChart);
    clicks.setClassToCatchClicks("xaxis-labels");
  },
  methods: {
    handleShowHide: function() {
        $(".rightbarsite").addClass("hidediv");  
        $(".rightbargender").addClass("hidediv");  
        $(".rightbarage").addClass("hidediv");  
        $(".rightbardisease").addClass("hidediv");  
        $(".rightbarunit").addClass("hidediv");  
    },
    updateChart: function(v) {
      $("#loader").show();
      let sn = variables.stateNamesAndId[0][v];
      let n = (Object.keys(variables.stateNamesAndId[0])).indexOf(v);
      var map_arr = this.map_arr;
      // var array_with_labels = this.getPointLabels(map_arr);
      var temp_arr = this.getMatrixSorted(n, map_arr);
      var updated_y = this.updateYaxis(n, temp_arr);
      var vm = this;
      setTimeout(function() {
        vm.mapOptions.series[0].data = [...temp_arr];
        vm.mapOptions.yAxis.categories = [...updated_y];
        $("#loader").hide();
      }, 2000);
    },
    setColors: function(index, count) {
      if (index == 0) {
        return this.getColorShades(128, 0, 0, count);
      } else if (index == 1) {
        return this.getColorShades(0, 128, 0, count);
      } else if (index == 2) {
        return this.getColorShades(255, 165, 0, count);
      } else {
        return this.getColorShades(0, 0, 255, count);
      }
    },
    getColorShades: function(r, g, b, x) {
      var o =
        x > 3 && x < 6
          ? 0.9
          : x >= 6 && x < 10
          ? 0.75
          : x >= 10 && x < 16
          ? 0.6
          : x >= 16 && x < 20
          ? 0.45
          : x >= 20
          ? 0.3
          : 1;
      x = x + 4;
      r = (x * r) / 10;
      g = (x * g) / 10;
      b = (x * b) / 10;
      return "rgb(" + r + "," + g + "," + b + "," + o + ")";
    },
    getApiData: function() {
      $("#loader").show();
      this.handleShowHide();
      this.setApis();
      axios
        .get(this.defaultIndiaApi)
        .then(response => {
          this.setColors();
          this.mapOptions.series[0].data = [];
          var dataloop = "";
          response.data.rows.length == 0
            ? ((this.chartOptions.series = []),
              alert("No data at this organisation Unit!"),
              $("#loader").hide())
            : (dataloop = response.data.rows);
          this.sortDataByLoc(dataloop);
        })
        .catch(error => {
          console.log(error);
        });
    },
    sortDataByLoc: function(dataloop, n) {
      //   $("#btnLocation").addClass("selected-option");
      let temp = JSON.parse(JSON.stringify(this.diseases));
      var temp_arr = [];
      for (let i = 0, len = dataloop.length; i < len; i++) {
        var disease_id = dataloop[i][0];
        var value = parseFloat(dataloop[i][3]);
        var stateData = dataloop[i][2];
        if (temp_arr[stateData + "_" + disease_id] === undefined)
          temp_arr[stateData + "_" + disease_id] = value;
        else temp_arr[stateData + "_" + disease_id] += value;

        if (i == dataloop.length - 1) {
          // console.log(temp_arr);
          var map_arr = [];
          var temp_x = [];
          var temp_y = [];
          let disease_arr = this.measureFilter.split(";");
          let states = [...variables.stateNames];
          for (let i = 0, len = Object.keys(states[0]).length; i < len; i++) {
            var statename = Object.keys(states[0])[i];
            temp_x[i] = states[0][statename];
            for (let k = 0, lenn = disease_arr.length; k < lenn; k++) {
              var disease_id = disease_arr[k];
              temp_y[k] = temp[0][disease_id].name;
              var matrix_val =
                temp_arr[statename + "_" + disease_id] === undefined
                  ? 0
                  : temp_arr[statename + "_" + disease_id];
              var color = temp[0][disease_id].color;
              var index = temp[0][disease_id].index;
              map_arr.push({
                x: i,
                y: k,
                value: matrix_val,
                color: color,
                ref: disease_id,
                point: "",
                index: index
              });
            }
          }
          var array_with_labels = this.getPointLabels(map_arr);
          var temp_arr = this.getMatrixSorted(1, array_with_labels);
          var updated_y = this.updateYaxis(1, temp_arr);
          this.map_arr = temp_arr;
          var vm = this;
          setTimeout(function() {
            // console.log(temp_arr);
            vm.mapOptions.series[0].data = [...temp_arr];
            vm.mapOptions.xAxis.categories = [...Object.values(temp_x)];
            vm.mapOptions.yAxis.categories = [...updated_y];
            $("#loader").hide();
          }, 2000);
        }
      }
    },
    updateYaxis: function(n, arr) {
      let singlesort = arr.filter(x => (x.x == n ? x : null));
      let tempy = [];
      for (let l = 0; l < singlesort.length; l++) {
        tempy[l] = this.diseases[0][singlesort[l].ref].name.split("- YLL")[0];
      }
      return tempy;
    },
    getPointLabels: function(arr) {
      let states = [...variables.stateNames];
      var sortedMapArray = [];
      for (let e = 0; e < Object.keys(states[0]).length; e++) {
        let singlesort = arr
          .filter(x => (x.x == e ? x : null))
          .sort(function(a, b) {
            if (a.value > b.value) {
              return -1;
            } else {
              1;
            }
          });
        for (let l = 0; l < singlesort.length; l++) {
          singlesort[l].point = l + 1;
          singlesort[l].color = this.setColors(
            Math.floor(l / 4),
            Math.floor(l / 4) + l
          );
        }
        sortedMapArray.push(...singlesort);
        if (e == Object.keys(states[0]).length - 1) {
          return sortedMapArray;
        }
      }
    },
    getMatrixSorted: function(n, map_arr) {
      let states = [...variables.stateNames];
      let afterSort = map_arr
        .filter(x => (x.x == n ? x : null))
        .sort(function(a, b) {
          if (a.value < b.value) {
            return -1;
          } else {
            1;
          }
        });
      var sortedMapArray = [];
      for (let e = 0; e < Object.keys(states[0]).length; e++) {
        let singlesort = this.getSorted(
          map_arr.filter(x => (x.x == e ? x : null)),
          afterSort
        );
        // console.log(singlesort);
        sortedMapArray.push(...singlesort);
        if (e == Object.keys(states[0]).length - 1) {
          return sortedMapArray;
        }
      }
    },
    getSorted: function(a, b) {
      var temparr = [];
      for (let g = 0; g < b.length; g++) {
        for (let f = 0; f < a.length; f++) {
          if (b[g].ref == a[f].ref) {
            temparr[g] = a[f];
            temparr[g].y = g;
          }
        }
      }
      return temparr;
    },
    setApis: function() {
      this.defaultIndiaApi =
        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
        variables.allouIDs +
        "&dimension=dx:" +
        this.measureFilter +
        "&displayProperty=NAME&outputIdScheme=UID";
    }
  },
  destroyed() {
    EventBus.$on("filters", this.setFilters);
    EventBus.$on("catchclicks", this.updateChart);
  }
};
</script>
 <style scoped>
.heatmap {
  min-height: 1200px !important;
}
</style>