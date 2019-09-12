<template>
  <!-- Disease Dropdown start-->
  <div class="row justify-content-center p-1 rightbar-menu-main rightbardisease">
    <div class="class col rightbar-menu">
      Diseases : &ensp; &ensp;
      <select
              class="disease-button"
              id="dropdown-disease"
              v-model="selected"
      >Select diseases
        <option class="dropdown-item" v-for="d in diseases" :value="d" :key="d">{{d.text}}</option>
      </select>
    </div>
  </div>

  <!-- Disease Dropdown end-->
</template>

<script>
    import { EventBus } from "../../event-bus";
    import variables from "../../config.js";
    import axios from "axios";

    export default {
        name: "RightbarDisease",
        data() {
            return {
                diseases: [],
                tempDiseases: [],
                diseasesTemp: [{id:'',text:'All causes',value:'', category: false}],
                selected : {id:'',text:'All causes',value:'', category: false},
                disease_typeapi_1: "",
                disease_typeapi_2: "",
            };
        },
        mounted() {
            this.changeDropDown(variables.yll);
            EventBus.$on("diseasechange", this.changeDropDown);
            EventBus.$on("reset", this.reset);
        },
        methods: {
            reset : function(param){
                this.selected = {id:'',text:'All causes',value:'', category: false}
            },
            sendFilter: function() {
                EventBus.$emit("filters", { value: this.selected, filter: "disease" });
                    document.getElementById("headertext-diseases").innerHTML = this.selected.text + ", ";   
            },
            changeDropDown: function(diseaseType) {
                this.reset();
                this.diseases = [...this.diseasesTemp];
                if (diseaseType == variables.yll) {
                    for (var i = 0; i < Object.keys(variables.diseases_yll[0]).length; i++) {
                        this.diseases.push({
                            text: variables.diseases_yll[0][Object.keys(variables.diseases_yll[0])[i]].name,
                            id: Object.keys(variables.diseases_yll[0])[i],
                            value: variables.diseases_yll[0][Object.keys(variables.diseases_yll[0])[i]],
                            category: false
                        });
                    }
                } else if (diseaseType == variables.yld) {
                    for (var i = 0; i < Object.keys(variables.diseases_yld[0]).length; i++) {
                        this.diseases.push({
                            text: variables.diseases_yld[0][Object.keys(variables.diseases_yld[0])[i]].name,
                            id: Object.keys(variables.diseases_yld[0])[i],
                            value: variables.diseases_yld[0][Object.keys(variables.diseases_yld[0])[i]],
                            category: false
                        });
                    }
                } else if (diseaseType == variables.daly) {
                    for ( var i = 0; i < Object.keys(variables.diseases_daly[0]).length; i++) {
                        this.diseases.push({
                            text: variables.diseases_daly[0][Object.keys(variables.diseases_daly[0])[i]].name,
                            id: Object.keys(variables.diseases_daly[0])[i],
                            value: variables.diseases_daly[0][Object.keys(variables.diseases_daly[0])[i]],
                            category: false
                        });
                    }
                } else {
                    for (var i = 0; i < Object.keys(variables.diseases_deaths[0]).length; i++) {
                        this.diseases.push({
                            text: variables.diseases_deaths[0][Object.keys(variables.diseases_deaths[0])[i]].name,
                            id: Object.keys(variables.diseases_deaths[0])[i],
                            value: variables.diseases_deaths[0][Object.keys(variables.diseases_deaths[0])[i]],
                            category: false
                        });
                    }
                }
                this.getApiData(diseaseType);
            },
            setApis: function(diseaseType) {
                if (diseaseType == variables.yll || diseaseType == variables.yld || diseaseType == variables.daly) {
                    this.disease_typeapi_1 = "../../29/indicatorGroups.json";
                } else if (diseaseType == variables.deaths) {
                    this.disease_typeapi_1 = "../../29/dataElementGroups.json";
                }
            },
            getApiData: function(diseaseType) {
                this.tempDiseases = [];
                this.setApis(diseaseType);
                    axios
                    .get(
                        this.disease_typeapi_1
                    )
                    .then(response => {
                        if (diseaseType == variables.deaths) {
                            
                            for (let j = 0; j < response.data.dataElementGroups.length; j++) {
                                this.tempDiseases.push({
                                    id: response.data.dataElementGroups[j].id,
                                    text: response.data.dataElementGroups[j].displayName,
                                    value: '',
                                    category: true
                                });
                            }
                        } else {
                            for (let i = 0; i < response.data.indicatorGroups.length; i++) {
                                if (response.data.indicatorGroups[i].displayName.indexOf("(YLL)") != -1 && diseaseType == variables.yll) {
                                        this.tempDiseases.push({
                                        id: response.data.indicatorGroups[i].id,
                                        text: response.data.indicatorGroups[i].displayName,
                                        value: '',
                                        category: true
                                    });
                                } else if (response.data.indicatorGroups[i].displayName.indexOf("(YLD)") != -1 && diseaseType == variables.yld) {
                                    this.tempDiseases.push({
                                        id: response.data.indicatorGroups[i].id,
                                        text: response.data.indicatorGroups[i].displayName,
                                        value: '',
                                        category: true
                                    });
                                } else if (response.data.indicatorGroups[i].displayName.indexOf("(DALY)") != -1 && diseaseType == variables.daly) {
                                    this.tempDiseases.push({
                                        id: response.data.indicatorGroups[i].id,
                                        text: response.data.indicatorGroups[i].displayName,
                                        value: '',
                                        category: true
                                    });
                                }
                            }
                        }

                        for (let k = 0; k < this.tempDiseases.length; k++) {
                            axios
                            .get ("../../29/indicatorGroups/"+ this.tempDiseases[k].id +".json")
                            .then(res => {
                                for (let indicator = 0; indicator < res.data.indicators.length; indicator++) {
                                    this.tempDiseases[k].value += res.data.indicators[indicator].id + ";";
                                }
                                this.diseases.unshift(this.tempDiseases[k]);
                            })
                            
                        }
                    })
                    .catch(error => {
                        console.log("error",error);
                    });

            }
        },
        watch: {
            selected: function(val) {
                this.sendFilter();
            }
        }
    };
</script>
<style scoped>
  .disease-button {
    max-width: -webkit-fill-available;
  }
</style>