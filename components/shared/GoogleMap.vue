<template>
  <gmap-map
    class='map w-100 h-100'
    :center.sync="center"
    :zoom.sync="zoom"
    :options="mapOptions"
    @idle="onIdle"
    v-if='googleMapsInitialized'
    @click="onMapClick">
    <gmap-marker
      v-for="(marker, i) of markers"
      :key="i"
      :icon="generateMarkerIcon(marker)"
      :position="marker.fields.location.geometry.location"
      :title="marker.fields.title"
      :clickable="false"
      @click="selectMarker(marker._id)" />
    <gmap-marker
      :key="1000000"
      :icon="icon"
      :optmized="false"
      :zIndex="1000"
      :position="center" />
  </gmap-map>
</template>

<script>
import mapStyles from '@/assets/json/mapStyles'
import { loaded } from 'vue2-google-maps'

export default {
  name: 'google-map-component',
  data: () => {
    googleMapsInitialized: false,
    zoom: 15
  },
  props: [
    'model'
  ],
  computed: {
    icon () {
      let multiplier = this.$device.isMobile ? 2 : 1.3
      let sizeX = 71 / multiplier
      let sizeY = 100 / multiplier

      return {
        url: '/img/logo.svg',
        scaledSize: new google.maps.Size(sizeX, sizeY)
      }
    },
    mapOptions () {
      return {
        minZoom: 5,
        maxZoom: 20,
        draggable: true,
        zoomControl: true,
        scrollwheel: false,
        mapTypeControl: false,
        zoomControl: true,
        gestureHandling: 'cooperative',
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        scaleControl: true,
        streetViewControl: false,
        styles: mapStyles
      }
    },
    center () {
      let loc = this.getAttribute(this.model, 'location')
      let defaultLoc = {
        lat: 50.110000,
        lng: 14.407193
      }
      return loc ? loc.geometry.location : defaultLoc
    },
    markers () {
      return this.$store.getters['pages/getManyByProp']('attribute_set_code', 'location_marker')
    }
  },
  mounted () {
    loaded.then(() => {
      this.$nextTick(() => {
        this.googleMapsInitialized = true // define this property in data
      })
    })
  },
  methods: {
    onIdle () {},
    onMapClick () {},
    selectMarker (id) {
      console.log('marker id', id)
    },
    generateMarkerIcon (marker) {
      let cat = this.$store.getters['pages/getByProp']('id', marker.fields.location_category.id)
      let src = this.getImageVersion(cat, 'image')
      let multiplier = this.$device.isMobile ? 9 : 6
      let sizeX = 136 / multiplier
      let sizeY = 136 / multiplier

      return {
        url: src,
        scaledSize: new google.maps.Size(sizeX, sizeY)
      }
    }
  }
}
</script>

<style lang="scss" >
.vue-map {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  box-shadow: 0px 11px 40px 4px rgba(0, 0, 0, 0.05);
  // -webkit-overflow-scrolling: touch;
}
</style>
