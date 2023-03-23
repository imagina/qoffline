<template>
    <div id="progress-request">
        <master-modal v-model="modal.show" :title="modal.title">
            <p>Quantity Roles: {{ getQuantityRoles }}</p>
            <p>Quantity Requests: {{ getQuantityRequests }}</p>
            <q-linear-progress size="30px" :value="progressRequestsCompleted" color="primary" class="q-mt-sm">
                <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="primary" :label="progressLabel" />
                </div>
            </q-linear-progress>
        </master-modal>
    </div>
</template>

<script>
export default {
    name: "Progressrequest",
    props: {},
    components: {},
    watch: {},
    data() {
        return {
            modal: {
                show: false,
                title: "Sync Offline Requests"
            },
            sessionData: {},
            progressRequestsCompleted: 0,
            progressLabel: '0.00%',
        }
    },
    computed: {
        getQuantityRoles() {
            return this.sessionData?.userData?.roles?.length || 0;
        },
        getQuantityRequests() {
            let countRequests = 0;
            this.sessionData?.userData?.roles.forEach(role => {
                if (role.options && role.options.offlineRequests) {
                    countRequests += role.options.offlineRequests.length
                }
            });
            return countRequests === 0 ? countRequests : countRequests - 1;
        },
    },
    methods: {
        executeOfflineRequests() {
            const initialRequests = this.getQuantityRequests;
            if (initialRequests === 0) {
                this.progressLabel = '100.00%';
            } else {
                const percentageByRequest = (1 * 100) / (initialRequests);
                let quantityPercentage = 0;
                this.sessionData.userData.roles.forEach(role => {
                    role.options.offlineRequests.forEach(async (offlineReq) => {
                        await this.$crud.index(offlineReq.apiRoute, { params: { ...offlineReq.requestParams } });
                        quantityPercentage += percentageByRequest;
                        this.progressRequestsCompleted = parseInt(quantityPercentage);
                        this.progressLabel = `${quantityPercentage.toFixed(2)}%`;
                    });
                })
                this.modal.show = false;
            }
        }
    },
    mounted() {
        this.$nextTick(async () => {
            const offlineSetting = this.$store.getters['qsiteApp/getSettingValueByName']('isite::offline');
            if (offlineSetting?.value == 1) {
                this.sessionData = await this.$cache.get.item('sessionData');
                this.modal.show = true;
                this.executeOfflineRequests();
            }
        });
    },
}
</script>