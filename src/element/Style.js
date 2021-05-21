import { action, makeObservable, observable } from "mobx";

const styleProperty = [
    'left', 'top', 'width', 'height','minWidth', 'minHeight',
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
    'leftUnit', 'topUnit', 'widthUnit', 'heightUnit',
    'position', 'display', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignContent',
    'borderRadius', 'borderWidth', 'borderColor', 'borderStyle',
    'backgroundColor', 'color',
    'textAlign', 'fontFamily', 'fontWeight', 'fontSize', 'fontStyle', 'textDecoration',
    'boxShadow', 'backdropFilter',
]


const defaultStyle = {
    common: {
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        minWidth:1,
        minHeight:1,

        leftUnit: 'px',
        topUnit: 'px',
        widthUnit: 'px',
        heightUnit: 'px',
        position: 'relative',
        
        borderRadius: 0,
        borderWidth: 0,
        borderColor: 'rgba(255, 255, 255, 0)',
        borderStyle: 'solid',

    },

    section: {
        width: 400,
        height: 200,

        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',


        backgroundColor: 'rgba(255, 255, 255, 0)',

        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0)",
        backdropFilter: `blur(0px)`,
    },
    text: {
        display: 'inline-block',
        width: 90,
        height: 21,
        minWidth:-1,
        minHeight:-1,
        fontFamily: 'Noto Sans KR',

        color: '#000',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'none',
        fontStyle: 'none',
        textDecoration: 'none',
    },
    button: {
        width: 100,
        height: 40,
        minWidth:-1,
        minHeight:-1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        color: '#fff',
        backgroundColor: '#343434',

        fontFamily: 'Noto Sans KR',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'none',
        fontStyle: 'none',
        textDecoration: 'none',

        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0)"
    },
    image: {
        width: 400,
        height: 200,

        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0)",

    },
    video: {
        width: 400,
        height: 200,
    }

}
export class Style {


    locked = [];

    constructor(styles = {}, tag) {


        
        const observableJson = {
            locked:observable,
            setStyle:action,
            lock:action,
            unlock:action,
        }

        styleProperty.forEach(attr => {
            this[attr] = null
            observableJson[attr] = observable;
        })

        Object.keys(defaultStyle.common).forEach(attr => {
            
            this[attr] = defaultStyle.common[attr]
        })

        if (tag) {
            Object.keys(defaultStyle[tag]).forEach(attr => {
                this[attr] = defaultStyle[tag][attr]
            })
        }

        if (styles) {
            Object.keys(styles).forEach(attr => {
                this[attr] = styles[attr]
            })
        }

        
        makeObservable(this, observableJson);

        
    }


    setStyle = (attr, value) => this[attr] = value

    lock = (attr) => {
        if (!this.locked.includes(attr)) this.locked.push(attr)
    }
    unlock = (attr) => {
        const index = this.locked.indexOf(attr)
        if (index > -1) this.locked.splice(index, 1)
    }

}

