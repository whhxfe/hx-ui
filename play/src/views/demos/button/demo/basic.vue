<template>
  <div class="demo-row">
    <hx-button>Default</hx-button>
    <hx-button type="primary">Primary</hx-button>
    <hx-button type="success">Success</hx-button>
    <hx-button type="warning">Warning</hx-button>
    <hx-button type="danger">Danger</hx-button>
    <hx-button type="info">Info</hx-button>
  </div>
  <div class="demo-row">
    <hx-button plain>Plain</hx-button>
    <hx-button round>Round</hx-button>
    <hx-button dashed>Dashed</hx-button>
    <hx-button circle>+</hx-button>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.demo-row:last-child {
  margin-bottom: 0;
}
</style>
