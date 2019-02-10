import {q} from '../selector/selector';

const QRCode = require('qrcode');

const cropHash = (url: string) => {
    const index = url.indexOf("#");
    if(index < 0) {
        return url;
    }

    return url.substr(0, index);
}

export const qrCurrentAddress = (selector: string, scale: number = 10) => {
    const addressWoHash = cropHash(window.location.href);
    makeQrCode(selector, addressWoHash, scale);
    return addressWoHash;
}

export const makeQrCode = (selector, text, scale: number = 10) => {
    const canvas = document.querySelector(q(selector));
    return new QRCode.toCanvas(canvas, text, {scale});
}

export const qrUtil = {
    makeQrCode, qrCurrentAddress
}
