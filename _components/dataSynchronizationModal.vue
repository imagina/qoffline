<script setup>
import { computed, watch, ref, onMounted } from 'vue'
import { store, i18n } from 'src/plugins/utils.ts'

const isOpenModalFinally = ref(false)

const isOpenModal = computed(() => store.state.qofflineMaster.isOpenModalSync)
const pendingRequests = computed(() => store.state.qofflineMaster.pendingRequests)
const totalRequests = computed(() => store.state.qofflineMaster.totalRequests)
const remainingPendingRequests = computed(() => totalRequests.value - pendingRequests.value)
const progress = computed(() => remainingPendingRequests.value / totalRequests.value)

watch(pendingRequests, (newValue) => {
    if (newValue === 0 && isOpenModal.value) {
        isOpenModalFinally.value = true
    }
})

const triggerSyncEvent = async () => {
    if (navigator.serviceWorker.controller) {
        try {
            await navigator.serviceWorker.controller.postMessage({ 
                type: 'trigger-sync-event' 
            });
        } catch (error) {
            console.error('Error triggering sync event:', error);
        }
    } else {
        console.error('Service Worker is not active');
    }
}

onMounted(() => {
    if (pendingRequests === 0 && isOpenModal.value) {
        isOpenModalFinally.value = true
    }
    triggerSyncEvent()
})

const closeManners = () => {
    isOpenModalFinally.value = false
    store.dispatch('qofflineMaster/CLOSE_MODAL_SYNC')
}

</script>
<template>
    <q-dialog 
        v-model="isOpenModal" 
        persistent
    >
        <div class="tw-w-full sm:tw-w-80">
            <section class="tw-flex tw-flex-col tw-gap-5 tw-p-5 tw-rounded-2xl tw-bg-gray-100">
                <section class="tw-flex tw-justify-between">
                    <h1 class="tw-font-semibold tw-text-base">
                        {{ i18n.tr('ioffline.cms.labels.sinchronizingOfflineRequests') }}
                    </h1>
                    <div>
                        <i 
                            :class="{
                                'fa-duotone fa-solid fa-spinner-third fa-spin': !isOpenModalFinally,
                                'fa-solid fa-circle-check tw-text-green-500': isOpenModalFinally
                            }"
                        ></i>
                    </div>
                </section>
                <section class="tw-text-center">
                    <span class="tw-text-sm tw-text-gray-400">
                        {{ remainingPendingRequests }}/{{ totalRequests }}
                    </span>
                    <q-linear-progress rounded size="12px" :value="progress" color="secondary" class="q-mt-sm" />
                </section>
                <q-scroll-area style="height: 550px;" :thumb-style="{ width: '5px' }">
                    <slot />
                </q-scroll-area>
            </section>
        </div>
    </q-dialog>
    <q-dialog 
        v-model="isOpenModalFinally"
        persistent
    >
        <div>
            <section class="tw-flex tw-flex-col tw-text-center tw-p-5 tw-rounded-2xl tw-bg-gray-100 tw-w-full sm:tw-w-80 tw-gap-4">
                <span class="tw-text-base tw-font-medium">
                    {{ i18n.tr('ioffline.cms.messages.requestsSuccessfullySynced') }}
                </span>
                <q-btn unelevated rounded color="positive" @click.stop="closeManners">
                    {{ i18n.tr('ioffline.cms.labels.ok') }}
                </q-btn>
            </section>
        </div>
    </q-dialog>
</template>