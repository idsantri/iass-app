export function toProperCase(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
