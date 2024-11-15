import { eventBus, store, i18n } from 'src/plugins/utils';

export default {
    moduleName: 'ioffline',
    moduleTitle: 'ioffline.cms.sidebar.adminGroup',
    /*configList: [
        {
            icon: 'fa-regular fa-wifi-slash',
            title: 'isite.cms.label.offlineSync',
            action: () => {
                eventBus.$emit('offlineSync')
            }
        }
    ],*/
  headerActions: async () => {
    return [
      {
        vIf: store.getSetting('isite::offline'),
        order: 1,
        name: 'offline',
        label: i18n.tr('isite.cms.label.offline'),
        badgeColor: 'orange',
        badgeLabel: store.state.qofflineMaster.pendingRequests,
        props: {
          icon: 'fa-light fa-cloud-slash',
          class: 'btn-small'
        },
        action: () => eventBus.emit('toggleMasterDrawer', 'offline')
      }
    ]
  }
}
