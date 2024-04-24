export const moduleOfflineHandler = async (refresh) => {
    const modules = await config('main')
    
    Object.entries(modules).forEach(([moduleName, module]) => {
        if (module.offline && typeof module.offline === 'function') {
            module.offline(refresh);
        } 
    });
}
