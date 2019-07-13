const nowAsString = () => {
    const now = new Date();
    return now.toString() + " ms: " + String(now.getMilliseconds());
}

module.exports = {
    nowAsString,
}
