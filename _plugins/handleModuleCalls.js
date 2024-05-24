export const preloadData = async (moduleName) => {
    const modules = await config('main')
    const DEFAULT_MODULE = 'lists'
    const MODULE_TO_EXECUTE = moduleName || DEFAULT_MODULE

    Object.entries(modules).forEach(async ([moduleName, module]) => {
        if (module[MODULE_TO_EXECUTE] && typeof module[MODULE_TO_EXECUTE] === 'function') {
            await module[MODULE_TO_EXECUTE]();
        } 
    }); 
}
