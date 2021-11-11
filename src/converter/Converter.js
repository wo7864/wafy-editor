import { toUnderscore, addNumberUnit} from '../util/util'

const traverse = (element, func) => {

    if (!element.children) return;
    element.children.forEach(child => {
        func(child, element);
        traverse(child, func);
    })
}

const Converter = async ({ elements }) => {


    const viewHTML = await ViewCreator(elements)


    const htmlFrame = document.createElement('iframe');
    htmlFrame.width = window.innerWidth;
    htmlFrame.height = window.innerHeight;
    htmlFrame.srcdoc = `
        <html>
            ${viewHTML.innerHTML}
        </html>`;

    htmlFrame.addEventListener('load', () => {
        const closeFrame = htmlFrame.contentDocument.body.querySelector('#close-frame');
        closeFrame.addEventListener('mousedown', () => {
            const iframe = document.querySelector('iframe');
            iframe.parentNode.removeChild(iframe);
        });
        AnimaCreator(elements, htmlFrame.contentDocument.body.parentNode);

    })

    var link = document.createElement('a');
    link.download = 'index.html';
    var blob = new Blob([htmlFrame.srcdoc], {type: 'text/plain'});
    link.href = window.URL.createObjectURL(blob);
    link.click();

    document.body.prepend(htmlFrame);

}



const ViewCreator = (elements) => {

    const InitHTML = () => {
        const HEAD = document.createElement('head');
        const googleFont = document.createElement('link');
        googleFont.rel = "preconnect";
        googleFont.href = "https://fonts.gstatic.com";

        const font = document.createElement('link');
        font.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;400;700;900&family=Open+Sans:wght@300;400;700;800&display=swap"
        font.rel = "stylesheet";

        HEAD.appendChild(googleFont);
        HEAD.appendChild(font);
        const BODY = document.createElement('body');
        const container = document.createElement('div');
        container.id = "root-container"
        HTML.appendChild(HEAD);
        HTML.appendChild(BODY);
        BODY.appendChild(container);

        const closeFrame = document.createElement('button');
        closeFrame.id = 'close-frame'
        closeFrame.style.width = '30px';
        closeFrame.style.height = '30px';
        closeFrame.style.background = '#333';
        closeFrame.style.position = 'absolute';
        closeFrame.style.right = '10px';
        closeFrame.style.top = '10px';

        BODY.appendChild(closeFrame);


        const funcURL = './assets/';


        const addScript = (url) => {
            const script = document.createElement('script');
            script.src = `${funcURL}${url}`;
            BODY.appendChild(script);
        }

        addScript('finished-animation.min.js')
        //addScript('util.min.js')
        //addScript('core.min.js')
        //addScript('common.min.js')
        //addScript('image.min.js')
        //addScript('text.min.js')
        //addScript('button.min.js')
        //addScript('video.min.js')
    }

    const DOMCreator = () => {
        const container = HTML.querySelector('#root-container');

        const addDomElem = (domElem, element, parent) => {
            domElem.id = element.id;
            domElem.className = element.className;

            if (element.innerText){
                domElem.innerText = element.innerText;
            }

            if (!parent.id) {
                container.appendChild(domElem)
            } else {
                const parentNode = container.querySelector(`#${parent.id}`);
                parentNode.appendChild(domElem)
            }
        }

        traverse(elements, (element, parent) => {
            if (element.tag === "video") {

                if(element.videoType === 'normal'){
                    const domElem = document.createElement('video')
                    domElem.src = element.src;
                    domElem.autoplay = true;
                    addDomElem(domElem, element, parent);
                }else if(element.videoType === 'scroll'){
                    const domElem = document.createElement('canvas')
                    addDomElem(domElem, element, parent);
                }
                
            }else if(element.tag === "image"){
                const domElem = document.createElement('img')
                domElem.src = element.src;
                addDomElem(domElem, element, parent);
            }else{
                const domElem = document.createElement('div');
                addDomElem(domElem, element, parent);
            }
        })
    }

    const CSSCreator = () => {

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

    const HTML = document.createElement('html');
    InitHTML();
    DOMCreator();
    CSSCreator();
    return HTML;
}
const AnimaCreator = (elements, HTML) => {

    const script = document.createElement('script');
    script.type = "text/javascript";

    traverse(elements, (element) => {
        const anima = element.animation
        const id = element.id.replace('-', '_');

        if(element.videoType === 'scroll'){
            const file = element.src.split('/');

            const filename = file[file.length-1].split('.')[0]
            const animation =
            `
            const ${id}_scroll_video = playCanvasVideo({
                target: '#${element.id}',
                images: {
                  path: '../assets/videos/${filename}/',
                  filename: 'image_000000',
                  count: ${element.frameCount},
                  extension: 'jpg',
                  width:${element.style.width},
                  height:${element.style.height},
                }
              });
              scrollEvent('#${element.id}', ${id}_scroll_video, ${element.scrollStart}, ${element.scrollEnd});            
            `
            script.innerHTML += animation
        }

        Object.keys(anima).forEach(event => {
            if(!anima[event]) return;
            const params = {};
            Object.keys(anima[event]).forEach(key => {
                if(!anima[event][key]) return;
                if (key === 'target' &&  anima[event][key] === 'self')
                    params[key] = `#${element.id}`;
                else if(key==='duration')
                    params[key] = Number(anima[event][key])
                else
                    params[key] = anima[event][key]
            })

            const scroll = event === 'scroll' ?
            `, ${anima[event].start}, ${anima[event].end}` : ''            
            const animation =
            `
            const ${id}_${event} = ${element.animation[event].name}(${JSON.stringify(params)});
            ${event}Event('#${element.id}', ${id}_${event}${scroll});
            `
            script.innerHTML += animation

        })

    })

    const BODY = HTML.querySelector('body')
    BODY.appendChild(script);
    return HTML;
}

export default Converter;