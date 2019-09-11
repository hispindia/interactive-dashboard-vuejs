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
        <option class="dropdown-item" v-for="t in diseases_types" :value="t" :key="t">{{t.displayName}}</option>
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
                diseases_types: [],
                diseasesTemp: [{id:'',text:'All causes',value:''}],
                selected : {id:'',text:'All causes',value:''},
                disease_typeapi_1: "",
                disease_typeapi_2: "",
                typeid: [],
                indicators: [],
                deaseseType: variables.yll
            };
        },
        mounted() {
            this.changeDropDown(variables.yll);
            this.getApiData(variables.yll);
            EventBus.$on("diseasechange", this.changeDropDown);
            EventBus.$on("diseasechange", this.getApiData);
            EventBus.$on("reset", this.reset);
        },
        methods: {
            reset : function(param){
                this.selected = {id:'',text:'All causes',value:''}
            },
            sendFilter: function() {
                EventBus.$emit("filters", { value: this.selected, filter: "disease" });
                console.log(this.selected);
                
                document.getElementById("headertext-diseases").innerHTML = this.selected.text + ", ";
            },
            changeDropDown: function(m) {
                this.typeid = null;
                this.diseases = [...this.diseasesTemp];
                if (m == variables.yll) {
                    for (
                        var i = 0;
                        i < Object.keys(variables.diseases_yll[0]).length;
                        i++
                    ) {
                        this.diseases.push({
                            text:
                            variables.diseases_yll[0][
                                Object.keys(variables.diseases_yll[0])[i]
                                ].name,
                            id: Object.keys(variables.diseases_yll[0])[i],
                            value:
                                variables.diseases_yll[0][
                                    Object.keys(variables.diseases_yll[0])[i]
                                    ]
                        });
                    }
                } else if (m == variables.yld) {
                    for (
                        var i = 0;
                        i < Object.keys(variables.diseases_yld[0]).length;
                        i++
                    ) {
                        this.diseases.push({
                            text:
                            variables.diseases_yld[0][
                                Object.keys(variables.diseases_yld[0])[i]
                                ].name,
                            id: Object.keys(variables.diseases_yld[0])[i],
                            value:
                                variables.diseases_yld[0][
                                    Object.keys(variables.diseases_yld[0])[i]
                                    ]
                        });
                    }
                } else if (m == variables.daly) {
                    for (
                        var i = 0;
                        i < Object.keys(variables.diseases_daly[0]).length;
                        i++
                    ) {
                        this.diseases.push({
                            text:
                            variables.diseases_daly[0][
                                Object.keys(variables.diseases_daly[0])[i]
                                ].name,
                            id: Object.keys(variables.diseases_daly[0])[i],
                            value:
                                variables.diseases_daly[0][
                                    Object.keys(variables.diseases_daly[0])[i]
                                    ]
                        });
                    }
                } else {
                    for (
                        var i = 0;
                        i < Object.keys(variables.diseases_deaths[0]).length;
                        i++
                    ) {
                        this.diseases.push({
                            text:
                            variables.diseases_deaths[0][
                                Object.keys(variables.diseases_deaths[0])[i]
                                ].name,
                            id: Object.keys(variables.diseases_deaths[0])[i],
                            value:
                                variables.diseases_deaths[0][
                                    Object.keys(variables.diseases_deaths[0])[i]
                                    ]
                        });
                    }
                }
            },
            setApis: function() {
                if ((this.deaseseType == variables.yll || this.deaseseType == variables.yld || this.deaseseType == variables.daly) && this.typeid == null) {
                    this.disease_typeapi_1 = "../../29/indicatorGroups.json";
                } else if (this.deaseseType == variables.deaths && this.typeid.length == 0) {
                    this.disease_typeapi_1 = "../../29/dataElementGroups.json";
                }
            },
            getApiData: function(o) {
                this.deaseseType = o;
                $("#loader").show();
                this.setApis();
                    axios
                    .get(
                        this.disease_typeapi_1
                    )
                    .then(response => {
                        this.indicators = response;
                        this.diseases_types = [];
                        
                        if (o == variables.deaths) {
                            
                            for (let j = 0; j < this.indicators.data.dataElementGroups.length; j++) {
                                var data = {
                                    id: "",
                                    categorie: true,
                                    displayName: "",
                                    value: []
                                };
                                data.id = this.indicators.data.dataElementGroups[j].id;
                                data.displayName = this.indicators.data.dataElementGroups[j].displayName;
                                this.diseases_types.push(data);
                            }
                        } else {
                            for (let i = 0; i < this.indicators.data.indicatorGroups.length; i++) {
                                var data = {
                                    id: "",
                                    categorie: true,
                                    displayName: "",
                                    value: ""
                                };
                                if (this.indicators.data.indicatorGroups[i].displayName.indexOf("(YLL)") != -1 && o == variables.yll) {
                                    data.id = this.indicators.data.indicatorGroups[i].id;
                                    data.displayName = this.indicators.data.indicatorGroups[i].displayName;
                                    this.diseases_types.push(data);
                                } else if (this.indicators.data.indicatorGroups[i].displayName.indexOf("(YLD)") != -1 && o == variables.yld) {
                                    data.id = this.indicators.data.indicatorGroups[i].id;
                                    data.displayName = this.indicators.data.indicatorGroups[i].displayName;
                                    this.diseases_types.push(data);
                                } else if (this.indicators.data.indicatorGroups[i].displayName.indexOf("(DALY)") != -1 && o == variables.daly) {
                                    data.id = this.indicators.data.indicatorGroups[i].id;
                                    data.displayName = this.indicators.data.indicatorGroups[i].displayName;
                                    this.diseases_types.push(data);
                                }
                            }
                        }
                        
                        this.typeid = this.diseases_types;
                        for (let k = 0; k < this.typeid.length; k++) {
                            axios
                            .get ("../../29/indicatorGroups/"+ this.typeid[k].id +".json")
                            .then(res => {
                                for (let indicator = 0; indicator < res.data.indicators.length; indicator++) {
                                    this.typeid[k].value += res.data.indicators[indicator].id + ";";
                                }
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
                this.getApiData(this.deaseseType);
            }
        }
    };
</script>
<style scoped>
  .disease-button {
    max-width: -webkit-fill-available;
  }
</style>