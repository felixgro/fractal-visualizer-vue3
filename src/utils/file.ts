export const getFileName = (path: string, withExtension = true) => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    return withExtension ? fileName : fileName.split('.')[0];
}