export const ValidElemId = (id) => {
    var regExp = /[A-Za-z][-A-Za-z0-9_:.]*/i
    return id.match(regExp) ? true : false
}