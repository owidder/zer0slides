const queryString = require('query-string');

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

export const getParamValue = (paramName: string) => {
    const searchParamValue = getSearchParamValue(paramName);
    if(searchParamValue) {
        return searchParamValue;
    }

    return getHashParamValue(paramName);

}
