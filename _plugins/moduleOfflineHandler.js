export const workOrderListLoadHandler = async (refresh) => {
    const modules = await config('main')
    
    Object.entries(modules).forEach(async ([moduleName, module]) => {
        if (module.uploadWorkOrderLists && typeof module.uploadWorkOrderLists === 'function') {
            await module.uploadWorkOrderLists(refresh);
        } 
    });
}

export const workOrderListRefreshHandler = async (refresh) => {
    const modules = await config('main')
    
    Object.entries(modules).forEach(async ([moduleName, module]) => {
        if (module.refreshWorkOrders && typeof module.refreshWorkOrders === 'function') {
            await module.refreshWorkOrders(refresh);
        } 
    });
}
