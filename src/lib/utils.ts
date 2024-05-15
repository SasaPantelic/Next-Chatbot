


export function isJSONParsable(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function capitalize(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1)
}