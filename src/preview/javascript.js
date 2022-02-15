import { STATIC_VIDEOS_URL } from '../util/constant'
import { traverse } from '../util/utils'
export const AnimaCreator = (elements, HTML) => {

    const script = document.createElement('script');
    script.type = "text/javascript";

    traverse(elements, (element) => {
        const anima = element.animation
        const id = element.id.replace('-', '_');
        if (element.videoType === 'scroll') {
            const file = element.src.split('/');

            const filename = file[file.length - 1].split('.')[0]
            const animation =
                `
            const ${id}_scroll_video = videoAnima.playCanvasVideo({
                target: '#${element.id}',
                images: {
                  path: '${STATIC_VIDEOS_URL}/${filename}/',
                  filename: '',
                  count: ${element.frameCount},
                  extension: 'jpg',
                  width:${element.style.width},
                  height:${element.style.height},
                }
              });
              utils.scrollEvent('#${element.id}', ${id}_scroll_video, ${element.scrollStart}, ${element.scrollEnd});            
            `
            script.innerHTML += animation
        }

        Object.keys(anima).forEach(event => {
            if (!anima[event]) return;
        const params = {};
            Object.keys(anima[event]).forEach(key => {
                if (!anima[event][key]) return;
                if (key === 'target' && anima[event][key] === 'self')
                    params[key] = `#${element.id}`;
                else if (key === 'duration')
                    params[key] = Number(anima[event][key])
                else
                    params[key] = anima[event][key]
            })

            const scroll = event === 'scroll' ?
                `, ${anima[event].start}, ${anima[event].end}` : ''
            const animation =
                `
            const ${id}_${event} = ${anima[event].type}Anima.${element.animation[event].name}(${JSON.stringify(params)});
            utils.${event}Event('#${element.id}', ${id}_${event}${scroll});
            `
            script.innerHTML += animation

        })

    })

    const BODY = HTML.querySelector('body')
    BODY.appendChild(script);
}