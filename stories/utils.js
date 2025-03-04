export function hashCode(str) {
    var hash = 0;
    var i;
    var chr;
    if (str.length === 0)
        return hash;
    for (i = 0; i < str.length; i += 1) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}
