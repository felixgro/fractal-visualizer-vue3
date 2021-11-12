// Gets file name from full path with or without file extension
export const getFileName = (path: string, withExtension = true) => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    return withExtension ? fileName : fileName.split('.')[0];
}

// Downloads a file blob with specified file name on client's machine.
export const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
}