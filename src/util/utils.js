
export function toUnderscore(string) {
    if (typeof string == 'number') {
        return string.toString()
    }
    return string.replace(/[A-Z]/g, function (upp, i, st) {
        return (i === 0 ? '' : '-') + upp.toLowerCase()
    })
}

export function addNumberUnit(string) {
    if (typeof string == 'number') {
        return string.toString() + 'px';
    }
    return string;
}

export const traverse = (element, func) => {

    if (!element.children) return;
    element.children.forEach(child => {
        func(child, element);
        traverse(child, func);
    })
}
