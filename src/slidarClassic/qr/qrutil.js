const QRCode = window.QRCode;

const getCurrentAddressWithRemoveText = (removeText) => {
    const url = window.location.href;
    const urlWithRemoveText = url.replace(removeText, "");

    return urlWithRemoveText;
}

export const qrCurrentAddress = (selector, removeText) => {
    const address = getCurrentAddressWithRemoveText(removeText);
    makeQrCode(selector, address);
    return address;
}

export const makeQrCode = (selector, text) => {
    const element = document.querySelector(selector);
    return new QRCode(element, text);
}

export const qrUtil = {
    makeQrCode, qrCurrentAddress
}
