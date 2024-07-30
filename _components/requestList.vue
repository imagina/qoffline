<script setup>
import { computed } from 'vue'
import { store, i18n } from 'src/plugins/utils.ts'

const actions = {
    POST: {
        icon: 'fa-solid fa-square-plus',
        action: i18n.tr('ioffline.cms.labels.create'),
        color: 'secondary'
    },
    PUT: {
        icon: 'fa-solid fa-arrows-rotate',
        action: i18n.tr('ioffline.cms.labels.update'),
        color: 'warning'
    },
    DELETE: {
        icon: 'fa-solid fa-trash',
        action: i18n.tr('ioffline.cms.labels.delete'),
        color: 'negative'
    }
}
const status = {
    SUCCESSFUL: {
        label: i18n.tr('ioffline.cms.labels.success'),
        class: 'fa-solid fa-circle-check tw-text-green-500'
    },
    FAILED: {
        label: i18n.tr('ioffline.cms.labels.failed'),
        class: 'fa-solid fa-circle-exclamation tw-text-red-500'
    },
    PENDING: {
        label: i18n.tr('ioffline.cms.labels.pending'),
        class: 'fa-solid fa-spinner-third fa-spin tw-text-gray-400'
    }
}

const getTitle = (request) => {
    if (request?.requestData?.body) {
        const body = JSON.parse(request.requestData.body)
        const attributes = body?.attributes

        return {
        id: attributes?.id || '',
        titleOffline: attributes?.titleOffline || attributes?.title_offline || ''
        }
    }
}

const requests = computed(() => {
    return store.state.qofflineMaster.requestsReversed
})
</script>
<template>
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
</template>