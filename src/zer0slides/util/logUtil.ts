export const logObject = (obj: any, message: string) => {
    console.log(`>>> ${message} >>> [${(new Date()).toString()}]`);
    console.log(obj);
    console.log(`<<< ${message} <<<`);
}
