<template>
  <!-- Units toggle bar start-->
  <!-- <div class="row justify-content-center m-2">
    <div class="class"> -->
      <div class="row justify-content-center p-1 rightbar-menu-main">
        <div class="class rightbar-menu">
            Unit : &ensp; &ensp;
             <input
                v-model="selected"
                type="radio"
                name="units"
                autocomplete="off"
                value="Count"
                checked
              > Count
              <input
                v-model="selected"
                type="radio"
                name="units"
                autocomplete="off"
                value="Rate"
              > Rate
              <input
                v-model="selected"
                type="radio"
                name="units"
                autocomplete="off"
                value="% age"
              > % age
        </div>
      </div>
   
  <!-- Units toggle bar end-->
</template>
<script>
export default {
  name: "RightbarUnits",
  data() {
    return {
      selected: "Count"
    };
  }
};
</script>