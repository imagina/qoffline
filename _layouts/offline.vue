<template>
  <q-page id="offline"
          class="text-center layout-padding relative-position q-my-xl">
    <div class="row gutter-md ">
      <div class="col-12">
        <q-icon name="wifi_off"/>
      </div>
      <div class="col-12">
        <div class="q-title">Can't load page.</div>
      </div>
      <div class="col-12">
        <div class="q-body-2">No internet connection. We can notify you when you can view this page.</div>
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus">
  @import "~variables";
  #offline
    .q-icon
      font-size 5rem
      width 100%
    .row
      min-height: auto !important;
</style>

<script>
  export default {
    name: 'PageIndex'
  }
</script>
