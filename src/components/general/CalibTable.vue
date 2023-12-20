<template>
  <v-card outlined class="pa-4">
    <v-card-title>
      All Calibrations
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details outlined
        dense></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="filteredCalibrations">
      <template v-slot:item="{ item }">
        <tr>
          <td @click="select(item)" v-for="(header, index) in headers" :key="index">
            {{ item[header.value] }}
          </td>
          <td>
            <v-btn icon color="black" @click="deleteItem(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        { text: 'name', value: 'calibName' },
        { text: 'id', value: 'id' },
        { text: 'point number', value: 'pointNumber' },
        { text: 'average accuracy (px)', value: 'averageAccuracy' },
        { text: 'average precision (px)', value: 'averagePrecision' },
      ],
    };
  },
  computed: {
    calibrations() {
      return this.$store.state.calibration.calibrations
    },
    filteredCalibrations() {
      return this.calibrations.filter(calibration =>
        Object.values(calibration).some(value =>
          value.toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
  },
  async created() {
    if (this.calibrations.length == 0) {
      await this.getAllCalibrations()
    }
  },
  methods: {
    select(item) {
      this.$store.commit('setFromDashboard', true)
      this.$store.dispatch('selectCalib', item)
    },
    getAllCalibrations() {
      this.$store.dispatch('getAllCalibs')
    },
    deleteItem(calib) {
      this.$store.dispatch('deleteCalib', calib)
    }
  }
};
</script>
