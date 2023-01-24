
export const getAsByteArray = async (file) => {
    return new Uint8Array(await readFileAsArrayBuffer(file));
};

export const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        // Create file reader
        let reader = new FileReader();

        // Register event listeners
        reader.addEventListener('loadend', (e) => resolve(e.target.result));
        reader.addEventListener('error', reject);

        // Read file
        reader.readAsArrayBuffer(file);
    });
};

export const base64ToFile = async (
    b64Data,
    contentType = 'file/pfx',
    sliceSize = 512,
) => {
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new File(byteArrays, 'certifica', {type: contentType});
};

