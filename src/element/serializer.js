import {
    createModelSchema,
    primitive,
    list,
    object,
    serialize,
    deserialize,
} from "serializr"
import {Element} from './Element'
import {Animations, Animation} from './Animation'
import {Style} from './Style'

const styleProperty = [
    'left', 'top', 'width', 'height', 'minWidth', 'minHeight',
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
    'leftUnit', 'topUnit', 'widthUnit', 'heightUnit',
    'position', 'display', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignContent',
    'borderRadius', 'borderWidth', 'borderColor', 'borderStyle', 
    'backgroundColor', 'color',
    'textAlign', 'fontFamily', 'fontWeight', 'fontSize', 'fontStyle', 'textDecoration',
    'boxShadow', 'backdropFilter',
]
const styleJson = {}
styleProperty.forEach(property => styleJson[property] = primitive())
styleJson.locked = list()
createModelSchema(Style, styleJson)

createModelSchema(Animation, {
    name: primitive(),
    target: primitive(),
    duration: primitive(),
    timing: primitive(),
    easingFunction: primitive(),

    imageSrc:primitive(),
    imageWidth: primitive(),
    imageHeight:primitive(),
    cursor: primitive(),

    bright:primitive(),
    blur:primitive(),
    maxLetterSpacing: primitive(),
    height: primitive(),
    afterText: primitive(),

    color:primitive(),
    backgroundColor: primitive(),

    gap: primitive(),
    cutCount: primitive(),

    start:primitive(),
    end:primitive(),
})

createModelSchema(Animations, {
    view: object(Animation),
    scroll: object(Animation),
    hover: object(Animation),
    click: object(Animation),
    dblclick: object(Animation),
})

createModelSchema(Element, {
    tag: primitive(),
    id: primitive(),
    className: list(),
    innerText: primitive(),
    style: object(Style),
    animation: object(Animations),
    src:primitive(),
    isSelect: primitive(),
    children: list(object(Element)),
    resizeHandler: primitive(),
    contextMenu: primitive(),
    introSrc:primitive(),
    videoType:primitive(),
    scrollStart:primitive(),
    scrollEnd:primitive(),
    
    frameCount:primitive(),
    isLock: primitive(),

})
export const toJSON = (obj) => {
    const json = serialize(Element, obj)
    return json
}

export const toOBJ = (json) => {
    const obj = deserialize(Element, json)
    return obj
}