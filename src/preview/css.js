import { 
    toUnderscore, 
    addNumberUnit,
    traverse
} from '../util/utils'

export const CSSCreator = (HTML, elements) => {

    const useUnitAttr = ["left", "top", "width", "height"]
    const head = HTML.querySelector('head');
    const style = document.createElement('style');
    head.appendChild(style);
    let styleContents =
        `
*{
box-sizing: border-box;
}
body{
margin:0;
padding:0;
width:100vw;
}
.button{
-ms-user-select: none; 
-moz-user-select: -moz-none;
-webkit-user-select: none;
-khtml-user-select: none;
user-select:none;

}
#root-container{
width:100vw;
}
#fix-header{
z-index:5;
}
`
    traverse(elements, (element) => {
        styleContents += `
#${element.id}{
${Object.keys(element.style).map(key => {
            if (useUnitAttr.includes(key)) {
                return `    ${toUnderscore(key)}: ${element.style[key] + element.style[key + 'Unit']};`
            }
            if (element.tag === "video" && key === "backgroundImage") return '';
            return `    ${toUnderscore(key)}: ${addNumberUnit(element.style[key])};`;
        }).join('\n')}
}
`
    })
    style.innerHTML = styleContents;
}