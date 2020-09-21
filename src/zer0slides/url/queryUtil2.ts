const queryString = require('query-string');

const getHashParamMap = () => {
    const hash = window.location.hash;
    return queryString.parse(hash);
}

export const getSearchParamValue = (paramName: string) => {
    const search = window.location.search;
    const parsed = queryString.parse(search);

    return parsed[paramName];
}

export const getHashParamValue = (paramName: string) => {
    const hash = window.location.hash;
    const parsed = queryString.parse(hash);

    return parsed[paramName];
}

const doCutTrailingSlash = (value: string, cutTrailingSlash: boolean) => {
    if(cutTrailingSlash && value && value.length > 0 && value.endsWith("/")) {
        return value.substr(0, value.length-1);
    }

    return value;
}

export const getParamValue = (paramName: string, cutTrailingSlash = false) => {
    const searchParamValue = getSearchParamValue(paramName);
    if(searchParamValue) {
        return doCutTrailingSlash(searchParamValue, cutTrailingSlash);
    }

    return doCutTrailingSlash(getHashParamValue(paramName), cutTrailingSlash);
}

export const getParamValueWithDefault = (paramName: string, defaultValue: string) => {
    const param = getParamValue(paramName);
    return param ? param : defaultValue;
}

export const setHashValue = (name: string, value: string | number) => {
    const hashParamMap = getHashParamMap();
    const newHashParamMap = {...hashParamMap, [name]: value};
    window.location.hash = queryString.stringify(newHashParamMap);
}

export const removeHashValue = (name: string) => {
    const hashParamMap = getHashParamMap();
    delete hashParamMap["step"];
    window.location.hash = queryString.stringify(hashParamMap);
}