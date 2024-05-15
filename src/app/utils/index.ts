export function generateUUID(): string {
    const hexDigits = "0123456789abcdef";
    let uuid = "";

    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += "-"; // format parts of the UUID as hyphen-separated sections
        } else if (
            i === 14 // set the version number (4) at position 14
        ) {
            uuid += "4";
        } else if (i === 19) {
            uuid += hexDigits.substr(Math.floor(Math.random() * 4) + 8, 1); // set the variant at position 19
        } else {
            uuid += hexDigits.substr(Math.floor(Math.random() * 16), 1); // randomly set other hex values
        }
    }

    return uuid;
}
