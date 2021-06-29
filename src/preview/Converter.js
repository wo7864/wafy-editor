import {
    InitHTML,
    DOMCreator
} from './html';

import { CSSCreator } from './css';
import { AnimaCreator } from './javascript';
const Converter = async ({ elements }) => {


    const HTML = document.createElement('html');
    InitHTML(HTML);
    DOMCreator(HTML, elements);
    CSSCreator(HTML, elements);

    const htmlFrame = document.createElement('iframe');
    htmlFrame.width = window.innerWidth;
    htmlFrame.height = window.innerHeight;
    htmlFrame.srcdoc = `
        <html>
            ${HTML.innerHTML}
        </html>`;

    htmlFrame.addEventListener('load', () => {
        const closeFrame = htmlFrame.contentDocument.body.querySelector('#close-frame');
        closeFrame.addEventListener('mousedown', () => {
            const iframe = document.querySelector('iframe');
            iframe.parentNode.removeChild(iframe);
        });
        AnimaCreator(elements, htmlFrame.contentDocument.body.parentNode);

    })
    document.body.prepend(htmlFrame);

    // var link = document.createElement('a');
    // link.download = 'index.html';
    // var blob = new Blob([htmlFrame.srcdoc], {type: 'text/plain'});
    // link.href = window.URL.createObjectURL(blob);
    // link.click();
}

export default Converter;