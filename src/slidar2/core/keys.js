import {Keyboard} from 'keyboardjs';
const usLocale = require('keyboardjs/locales/us');

const keyboard = new Keyboard();
keyboard.setLocale('us', usLocale);

export const bindKeyToFunction = (key, func) => {
    debugger
    keyboard.bind(key, func);
}
