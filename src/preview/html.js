import { traverse } from '../util/utils'

export const InitHTML = (HTML) => {
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


    const addScript = (url) => {
        const script = document.createElement('script');
        script.src = `${url}`;
        BODY.appendChild(script);
    }

    addScript('https://cdn.jsdelivr.net/npm/finished-animation@0.0.34/dist/finished-animation.js')

}

export const DOMCreator = (HTML, elements) => {
    const container = HTML.querySelector('#root-container');

    const addDomElem = (domElem, element, parent) => {
        domElem.id = element.id;
        domElem.className = element.className;

        if (element.innerText) {
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

            if (element.videoType === 'normal') {
                const domElem = document.createElement('video')
                domElem.src = element.src;
                domElem.autoplay = true;
                addDomElem(domElem, element, parent);
            } else if (element.videoType === 'scroll') {
                const domElem = document.createElement('canvas')
                addDomElem(domElem, element, parent);
            }

        } else if (element.tag === "image") {
            const domElem = document.createElement('img')
            domElem.src = element.src;
            addDomElem(domElem, element, parent);
        } else {
            const domElem = document.createElement('div');
            addDomElem(domElem, element, parent);
        }
    })
}