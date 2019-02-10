// deprecated
// use queryUtil2
import * as url from "url";
import * as _ from "lodash";

interface QueryMap {[key: string]: string | undefined}

const parseQuery = (query: string) => {
    const parts = query.split("&");
    const queryMap: QueryMap = {};
    parts.forEach((part) => {
        const keyVal = part.split("=");
        if(keyVal.length === 1) {
            queryMap[keyVal[0]] = undefined;
        }
        else {
            queryMap[keyVal[0]] = keyVal[1];
        }
    });

    return queryMap
};

export const createQueryMap = () => {
    const _url = url.parse(window.location.href);
    const query = _url.hash;
    if(query) {
        return parseQuery(query);
    }

    return {}
}

const makeQueryFromQueryMap = (queryMap) => {
    return _.toPairs(queryMap).reduce((queryString, keyValuePair) => {
        if(_.isUndefined(keyValuePair[1])) {
            return queryString + "&" + keyValuePair[0];
        }
        return queryString + "&" + keyValuePair[0] + "=" + keyValuePair[1];
    }, "")
}

export const createHrefWithQueryMap = (queryMap) => {
    const urlObject = url.parse(window.location.href);
    const newQuery = makeQueryFromQueryMap(queryMap);
    urlObject.query = newQuery;

    return url.format(urlObject);
}

export const paramValue = (paramName) => {
    const queryMap = createQueryMap();
    return queryMap[paramName];
}

export const firstParamSet = (paramNameList) => {
    const queryMap = createQueryMap();
    for(const paramName of paramNameList) {
        if(!_.isEmpty(queryMap[paramName])) {
            return paramName;
        }
    }

    return ""
}

export const setHashValue = (name: string, value: string | number) => {
    const newQuery = makeQueryFromQueryMap({[name]: value});
    window.location.hash = newQuery;
}
