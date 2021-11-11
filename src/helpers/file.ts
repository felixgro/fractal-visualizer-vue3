export const getFileName = (path: string, withExtension = true) => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    return withExtension ? fileName : fileName.split('.')[0];
}

export const getFractalComponents = () => { }

export const getUtilModules = () => {
    const utilImport = import.meta.glob('../core/utils/*.ts');
    return Object.entries(utilImport).map(([path, module]) => {
        return {
            name: getFileName(path, false),
            module
        }
    });
}

// download argument blob with argument file name to clients computer
export const downloadImageBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
}