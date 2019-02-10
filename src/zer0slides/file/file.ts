export const readFile = (relPath: string) => {
    return new Promise(resolve => {
        fetch(relPath)
            .then(response => {
                resolve(response.text())
            })
    })
}

export const file = {
    read: readFile
}
