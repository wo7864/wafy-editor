import {  action, makeObservable, observable } from "mobx";

const paramsAttrProperty = [
    'required',
    'default',
    'detail',
    'example',
    'Unit',
    'type',
    'value',
]

const animationAttrProperty = [
    'target',
    'duration',
    'timing',
    'easingFunction',

    'imageSrc',
    'imageWidth',
    'imageHeight',
    'cursor',

    'bright',
    'blur',
    'maxLetterSpacing',
    'height',
    'afterText',

    'color',
    'backgroundColor',

    'gap',
    'cutCount',
]
const animationsAttrProperty = [
    'view',
    'scroll',
    'hover',
    'click',
    'dblclick',
]


export class ParamsAttr {
    constructor(){
        const observableJson = {}
        paramsAttrProperty.forEach(attr => {
            this[attr] = null
            observableJson[attr] = observable
        })
        makeObservable(this, observableJson);

    }
    
}

export class Animation {
    constructor(){
        const observableJson = {}
        animationAttrProperty.forEach(attr => {
            this[attr] = null
            observableJson[attr] = observable
        })
        makeObservable(this, observableJson);

    }

}

export class Animations {
    
    constructor(){
        const observableJson = {
            setAnimation:action
        }
        animationsAttrProperty.forEach(attr => {
            this[attr] = null
            observableJson[attr] = observable
        })
        makeObservable(this, observableJson);

    }

    setAnimation(event, anima){
        this[event] = anima;
    }
}

