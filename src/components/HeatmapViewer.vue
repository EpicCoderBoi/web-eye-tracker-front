<template>
  <v-card id="card">
    <div class="video-view">
      <video autoplay class="video-container" id="video" />
      <div class="video-content">
        <v-btn
          icon
          @click="$emit('close')"
          fixed
          absolute
          top
          right
          color="red"
          class="mr-4"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div style="width:200vh">
          <v-row justify="center" class="mt-5">
            <v-btn
              class="mt-4"
              @click="createHeatmap()"
              v-if="!isplay"
              color="green"
              outlined
              >Play Session Result
              <v-icon righ>mdi-play</v-icon>
            </v-btn>
          </v-row>
        </div>
      </div>
      <div class="heatmap-container">
        <div id="heatmap" />
      </div>
    </div>
  </v-card>
</template>

<script>
const h337 = require("heatmap.js");

export default {
  props: {
    gaze_points: {
      type: Array,
      default: () => [],
    },
    screen_record: Blob,
  },
  data() {
    return {
      isplay: false,
      points: [],
      max: 1,
      heatmap: null,
    };
  },
  methods: {
    addToHeatmap(point) {
      // uncoment if wanted to clear points before setting them
      // this.points = []
      
      // heatmap data format
      this.points.push({
        x: Math.floor(Math.abs(point.x)),
        y: Math.floor(Math.abs(point.y)),
        value: 1,
      });

      var data = {
        max: this.max,
        data: this.points,
      };

      this.heatmap.setData(data);
    },
    async createHeatmap() {
      this.isplay = true;
      document.getElementById("video").src = URL.createObjectURL(
        this.screen_record
      );
      const elem = document.getElementById("card");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }

      const container = document.getElementById("heatmap");
      this.heatmap = h337.create({
        container: container,
      });

      const video = document.getElementById("video");
      var reqId;
      var th = this;
      var startTracking = function() {
        reqId = requestAnimationFrame(function play() {
          if (th.gaze_points.length > 0) {
            if (th.gaze_points[0].moment_in_time <= video.currentTime) {
              th.addToHeatmap(th.gaze_points[0]);
              th.gaze_points.shift();
            }
          }

          reqId = requestAnimationFrame(play);
        });
      };

      var stopTracking = function() {
        if (reqId) {
          cancelAnimationFrame(reqId);
        }
      };

      video.addEventListener("play", startTracking);

      video.addEventListener("pause", stopTracking);
      
      // uncomment for full heatmap without progressive construction
      // var points = [];
      // var max = 1;
      // // heatmap data format
      // this.gaze_points.forEach((element) => {
      //   points.push({
      //     x: Math.floor(Math.abs(element.x)),
      //     y: Math.floor(Math.abs(element.y)),
      //     value: 1,
      //   });
      // });
      // var data = {
      //   max: max,
      //   data: points,
      // };
      // console.log(data);
      // this.heatmap.setData(data);
    },
  },
};
</script>

<style scoped>
#heatmap {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.heatmap-container {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

.video-container {
  height: 100vh;
  width: 100%;
}
.video-view {
  position: relative;
  width: 100%;
  height: 100px;
}

.video-view .video-content {
  position: absolute;
  bottom: 0px;
  z-index: 2;
}
</style>
