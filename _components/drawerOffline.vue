<template>
  <div id="drawerOffline" class="q-pa-md">
    <!-- ===== Header ===== -->
    <div class="row justify-between items-center">
      <div class="text-subtitle1 row items-center">
        <q-icon name="fa fa-cloud-upload" color="primary" size="20px" class="q-mr-sm" />
        <label>{{ $tr('isite.cms.label.offlineRequests', { capitalize: true }) }}</label>
      </div>
      <!-- Close icon -->
      <q-icon name="fas fa-times" color="blue-grey" size="20px" class="cursor-pointer"
        @click="eventBus.emit('toggleMasterDrawer', 'offline')" />
    </div>
    <!--Separator-->
    <q-separator class="q-my-md" />
    <q-list>
      <div v-for="request in requests" :key="request?.id">
        <q-item
          class="
            tw-flex-col
            tw-py-5
            tw-rounded-lg
            tw-bg-white
            tw-shadow-lg
            tw-mb-4
          "
        >
          <q-item-section class="tw-flex tw-flex-row tw-justify-between">
            <section>
              <q-item-label
                class="
                  tw-text-sm
                  tw-text-gray-400
                "
              >
                {{ getTitle(request)?.titleOffline }}
              </q-item-label>
              <q-item-label
                class="
                  tw-font-bold
                  tw-text-base
                "
                v-if="getTitle(request)?.id"
              >
                ID: {{ getTitle(request)?.id }}
              </q-item-label>
            </section>
            <section>
              <q-tooltip>{{ status[request?.metadata?.status].label }}</q-tooltip>
              <i :class="status[request?.metadata?.status].class"></i>
            </section>
          </q-item-section>
          <q-item-section
            class="
              tw-flex-row
              tw-justify-between
              tw-items-center
              tw-mt-2
              tw-text-gray-400
            "
            style="margin-left: 0;"
          >
            <q-item-label class="tw-font-semibold">
              <q-icon
                :name="actions[request?.requestData?.method].icon"
                :color="actions[request?.requestData?.method].color"
                size="14px" class="q-mr-sm"
              />
              {{ actions[request?.requestData?.method].action }}
            </q-item-label>
            <q-item-label class="tw-text-sm">
              {{ $moment(request?.timestamp).fromNow() }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
</template>

<script>
import { eventBus } from 'src/plugins/utils'
import { preloadData } from '../_plugins/handleModuleCalls'

export default {
  name: "drawerOffline",
  props: {},
  components: {},
  watch: {},

  beforeUnmount() {
    eventBus.off('header.badge.manage');
  },
  mounted() {
    this.$nextTick(async () => {
      this.$store.dispatch(
        'qofflineMaster/OFFLINE_REQUESTS',
        { userId: this.$store.state.quserAuth.userId }
      )

      await preloadData()
    });
  },
  computed: {
    requests() {
      return this.$store.state.qofflineMaster.requestsReversed
    }
  },
  data() {
    return {
      refreshIntervalId: null,
      eventBus,
      actions: {
        POST: {
          icon: 'fa-solid fa-square-plus',
          action: 'Create',
          color: 'secondary'
        },
        PUT: {
          icon: 'fa-solid fa-arrows-rotate',
          action: 'Update',
          color: 'warning'
        },
        DELETE: {
          icon: 'fa-solid fa-trash',
          action: 'Delete',
          color: 'negative'
        }
      },
      status: {
        SUCCESSFUL: {
          label: 'Success',
          class: 'fa-solid fa-circle-check tw-text-green-500'
        },
        FAILED: {
          label: 'Failed',
          class: 'fa-solid fa-circle-exclamation tw-text-red-500'
        },
        PENDING: {
          label: 'Pending',
          class: 'fa-solid fa-spinner-third fa-spin tw-text-gray-400'
        }
      }
    }
  },
  methods: {
    getTitle(request) {
      if (request?.requestData?.body) {
        const body = JSON.parse(request.requestData.body)
        const attributes = body?.attributes

        return {
          id: attributes?.id || '',
          titleOffline: attributes?.titleOffline || attributes?.title_offline || ''
        }
      }
    },
  },
}
</script>
