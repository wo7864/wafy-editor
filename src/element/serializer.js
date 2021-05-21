import {
    createModelSchema,
    primitive,
    list,
    object,
    serialize,
    deserialize,
} from "serializr"
import {Element} from './Element'
import {Animations, Animation, ParamsAttr} from './Animation'
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

createModelSchema(ParamsAttr, {
    required: primitive(),
    default: primitive(),
    value: primitive(),
    detail: primitive(),
    Unit: primitive(),
    type: primitive(),
})

createModelSchema(Animation, {
    name: primitive(),
    target: object(ParamsAttr),
    duration: object(ParamsAttr),
    timing: object(ParamsAttr),
    easingFunction: object(ParamsAttr),

    imageSrc: object(ParamsAttr),
    imageWidth: object(ParamsAttr),
    imageHeight: object(ParamsAttr),
    cursor: object(ParamsAttr),

    bright: object(ParamsAttr),
    blur: object(ParamsAttr),
    maxLetterSpacing: object(ParamsAttr),
    height: object(ParamsAttr),
    afterText: object(ParamsAttr),

    color: object(ParamsAttr),
    backgroundColor: object(ParamsAttr),

    gap: object(ParamsAttr),
    cutCount: object(ParamsAttr),

    start:object(ParamsAttr),
    end:object(ParamsAttr),
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
    isSelect: primitive(),
    childElements: list(object(Element)),
    resizeHandler: primitive(),
    contextMenu: primitive(),
    src:primitive(),
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