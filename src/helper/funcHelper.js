
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

export const round = (num, decimal = 2) => {
    if (decimal <= 0 || num === undefined) return NaN;
    const divider = Number(`1${Array.from({ length: decimal }, () => '0').join('')}`);

    return Math.round((num + Number.EPSILON) * divider) / divider;
};

export const formatFileSize = (size) => {
    if (size > 1024 * 1024 * 1024)
        return {
            originalSize: size,
            formattedSize: `${round(size / (1024 * 1024 * 1024), 2)} GB`,
        };
    if (size > 1024 * 1024)
        return {
            originalSize: size,
            formattedSize: `${round(size / (1024 * 1024), 2)} MB`,
        };
    if (size > 1024)
        return {
            originalSize: size,
            formattedSize: `${round(size / 1024, 2)} KB`,
        };

    return {
        originalSize: size,
        formattedSize: `${round(size, 2)} Bytes`,
    };
};

export function keyDownA11y(handler) {
    return function onKeyDown(event) {
        if (['keydown', 'keypress'].includes(event.type) && ['Enter', ' '].includes(event.key)) {
            handler(event);
        }
    };
}

