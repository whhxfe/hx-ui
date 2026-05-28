<script setup lang="ts">
import { HxMap, HxMapMarkers, HxMapPopup } from '@hx/ui'

const markerList = [
  { id: 1, lon: 116.397, lat: 39.908, name: '天安门', address: '北京市东城区长安街' },
]
</script>

<template>
  <div style="height: 500px">
    <HxMap :center="{ lon: 116.397, lat: 39.908 }" :zoom="13">
      <HxMapMarkers :markers="markerList" :marker-style="{ shape:'map-marker',iconSize:[36,36] }" >
        <HxMapPopup multiple />
      </HxMapMarkers>
    </HxMap>
  </div>
</template>