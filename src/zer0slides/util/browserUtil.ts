export const isInJsdom = () => {
    return navigator.userAgent.toLowerCase().includes("node.js") || navigator.userAgent.toLowerCase().includes("jsdom")
}
