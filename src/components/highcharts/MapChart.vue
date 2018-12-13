<template>
  <highcharts :constructor-type="'mapChart'" :options="mapOptions" class="map"></highcharts>
</template>

<script>
import mapdata from "../../indiamap.json";
import variables from "../../config.js";
import axios from "axios";

export default {
  data() {
    return {
      mapOptions: {
        chart: {
          map: mapdata
        },

        title: {
          text: "Highmaps basic demo"
        },

        subtitle: {
          text:
            'Source map: <a href="http://code.highcharts.com/mapdata/countries/in/in-all.js">India</a>'
        },

        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: "bottom"
          }
        },

        colorAxis: {
          min: 0
        },

        series: [
          {
            data: [],
            name: "Random data",
            states: {
              hover: {
                color: "#BADA55"
              }
            },
            dataLabels: {
              enabled: false,
              format: "{point.name}"
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.loadMapData();
  },
  methods: {
    loadMapData: function() {
      var defaultIndiaApi =
        "../../analytics.json?dimension=pe:2015&dimension=ou:" +
        variables.allouIDs +
        "&dimension=dx:" +
        variables.yll +
        "&displayProperty=NAME&outputIdScheme=UID";
      axios.get(defaultIndiaApi).then(response => {
        console.log(response.data);
        var loopdata = response.data.rows;
        let temp = [...variables.statesMapData];
        for (let i = 0, len = loopdata.length; i < len; i++) {
          var ouid = loopdata[i][2];
          var value = parseFloat(loopdata[i][3]);
          if (temp[0][ouid] !== undefined) {
            temp[0][ouid].data += value;
          }

          if (i == len - 1) {
            var vm = this;
            $("#loader").show();
            setTimeout(function() {
              let temp_arr = [];
              for (let j = 0; j < Object.keys(temp[0]).length; j++) {
                temp_arr.push([
                  variables.statesMapName[0][Object.keys(temp[0])[j]].name,
                  temp[0][Object.keys(temp[0])[j]].data
                ]);
              }
              vm.mapOptions.series[0].data = [...temp_arr];
              console.log(vm.mapOptions.series[0].data);
              $("#loader").hide();
            }, 2000);
          }
        }
      });
    }
  }
};
</script>
 <style scoped>
.map {
  min-height: 500px;
}
</style>