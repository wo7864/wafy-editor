import { action, makeObservable, observable } from "mobx";
import styles from '../static/css/Elements.module.css';
import { forwardRef } from 'react';
import { Style } from "./Style";
import { Animations } from "./Animation";

const randomText = ["안녕하세요", "텍스트", "iPhone12", "타다다닥", "타이핑", "한글",
    "English"]



export class Element {
    static idList = [];

    id;
    tag;
    props;

    level;
    children;
    parent;

    isSelect = false;
    children= undefined
    isUpdateParentArea = undefined
    contentEditable = undefined
    innerText = undefined
    tmpText = undefined
    src = undefined
    introSrc= undefined
    videoType = undefined
    scrollStart= undefined
    scrollEnd = undefined
    frameCount = undefined
    constructor(props = {}) {
        this.tag = props.tag;
        this.class = Element;
        this.setNewId();
        this.className = props.className ?? [this.tag];

        if (this.tag === 'text' || this.tag === 'button')
            this.innerText = randomText[Math.floor(Math.random() * randomText.length)];

        // style
        this.style = new Style(props.style, this.tag)

        /*****Animation*****/
        this.animation = new Animations();


        this.isSelect = false;

        //edit options
        this.resizeHandler = null;
        this.contextMenu = null;
        this.isLock = false;

        this.initPropertyOnTag(props);
        this.initObservableyOnTag();
    }

    initPropertyOnTag(props) {

        if (this.tag === 'section') {
            this.children = [];
            this.isUpdateParentArea = false;
        }
        else if(this.tag === 'text'){
            this.contentEditable = false
        }
        else if(this.tag === 'button'){
            this.contentEditable = false
        }
        else if (this.tag === 'image') {
            this.src = props.src
        }
        else if (this.tag === 'video') {
            this.src = props.src
            this.introSrc = props.introSrc
            this.frameCount = props.frameCount
            this.videoType = 'normal'
            this.scrollStart = 0
            this.scrollEnd = 500

        }
    }

    initObservableyOnTag = () => {
        const observableJson = {
            tag: observable,
            isSelect: observable,
            setProperty: action,
            setInnerText:action,
            showUpdateParentArea:action,
            hideUpdateParentArea:action,
        }
        const array = [
            'id',
            'innerText',
            'children',
            'contentEditable',
            'videoType',
            'frameCount',
            'scrollStart',
            'scrollEnd',
            'isUpdateParentArea',
        ]

        array.forEach(attr => {
                observableJson[attr] = observable
        })
        makeObservable(this, observableJson);
    }
    
 

    setNewId() {
        let id = 0;
        while (1) {
            if (!document.body.querySelector(`#${this.tag}-${id}`)) {
                this.id = `${this.tag}-${id}`;
                return;
            }
            id++;
            if (id >= 1_000_000)
                return alert("요소가 너무 많습니다.")
        }
    }


    select() {
        if (this.tag === 'text' || this.tag === 'button') {
            const innerText = document.body.querySelector(`#${this.id}>.inner-text`);
            if (innerText && innerText.contentEditable === "true") return;
        }
        this.isSelect = true;


    }
    deselect() {
        this.contextMenu = null;
        this.isSelect = false;

        if (this.tag === 'text' || this.tag === 'button') {
            this.contentEditable = false
            this.setMinRect();
        }
    }

    dblClick() {
        if (this.tag === 'text' || this.tag === 'button') {
            this.contentEditable = true;
            this.tmpText = this.innerText
            
        }
    }

    setProperty(key, value) {
        this[key] = value
        if (key === 'videoType' && value === 'scroll') {
            this.style.setStyle('position', 'sticky');
            this.style.lock('position');
        } else if (key === 'videoType' && value === 'normal') {
            this.style.unlock('position');
        }
    }

    setMinRect(){
        const innerText = document.querySelector(`#${this.id} .inner-text`)
        if(innerText){
            const {width, height} = innerText.getBoundingClientRect();
            this.style.setStyle('minWidth', width);
            this.style.setStyle('minHeight', height);
        }
    }

    isCursorOnElement(pos, isPadding=false) {
        const padding = isPadding ? 5 : 0
        const clientElement = document.querySelector(`#${this.id}`).getBoundingClientRect();
        if ((clientElement.left+padding < pos.x && clientElement.right-padding >= pos.x) &&
            (clientElement.top+padding < pos.y && clientElement.bottom-padding >= pos.y)) {
            return true;
        }
    }

    isCursorNearElement(pos) {
        const clientElement = document.querySelector(`#${this.id}`).getBoundingClientRect();
        const left = Math.abs(clientElement.left - pos.x) <= 5 &&
            (clientElement.top < pos.y && clientElement.bottom >= pos.y);
        const right = Math.abs(clientElement.right - pos.x) <= 5 &&
            (clientElement.top < pos.y && clientElement.bottom >= pos.y);
        const top = Math.abs(clientElement.top - pos.y) <= 5 &&
            (clientElement.left < pos.x && clientElement.right >= pos.x);
        const bottom = Math.abs(clientElement.bottom - pos.y) <= 5 &&
            (clientElement.left < pos.x && clientElement.right >= pos.x);

        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
        }
    }

    setContextMenu = (pos) => {
        this.contextMenu = pos;
    }

    ResizeHandler = ({ elementStore }) => {
        return (
            <>
                <span className={[styles.resizeHandle, styles.nw].join(' ')}
                    style={{
                        left: this.style.borderWidth * -1,
                        top: this.style.borderWidth * -1,
                    }}
                    onMouseDown={(e) => elementStore.resize.init(this, e, 'nw')}></span>
                <span className={[styles.resizeHandle, styles.n].join(' ')}
                    style={{
                        left: '50%',
                        top: this.style.borderWidth * -1,
                    }}
                    onMouseDown={(e) => elementStore.resize.init(this, e, 'n')}></span>
                <span className={[styles.resizeHandle, styles.ne].join(' ')}
                    style={{
                        left: `calc(100% + ${this.style.borderWidth}px)`,
                        top: this.style.borderWidth * -1,
                    }}
                    onMouseDown={(e) => elementStore.resize.init(this, e, 'ne')}></span>
                <span className={[styles.resizeHandle, styles.w].join(' ')}
                    style={{
                        left: this.style.borderWidth * -1,
                        top: "50%",
                    }}
                    onMouseDown={(e) => elementStore.resize.init(this, e, 'w')}></span>
                <span className={[styles.resizeHandle, styles.e].join(' ')}
                    style={{
                        left: `calc(100% + ${this.style.borderWidth}px)`,
                        top: "50%",
                    }}
                    onMouseDown={(e) => elementStore.resize.init(this, e, 'e')}></span>
                <span className={[styles.resizeHandle, styles.sw].join(' ')}
                    style={{
                        left: this.style.borderWidth * -1,
                        top: `calc(100% + ${this.style.borderWidth}px)`,
                    }}
                    onMouseDown={(e) => elementStore.resize.init(this, e, 'sw')}></span>
                <span className={[styles.resizeHandle, styles.s].join(' ')}
                    style={{
                        left: '50%',
                        top: `calc(100% + ${this.style.borderWidth}px)`,
                    }}
                    onMouseDown={(e) => elementStore.resize.init(this, e, 's')}></span>
                <span className={[styles.resizeHandle, styles.se].join(' ')}
                    style={{
                        left: `calc(100% + ${this.style.borderWidth}px)`,
                        top: `calc(100% + ${this.style.borderWidth}px)`,
                    }}
                    onMouseDown={(e) => elementStore.resize.init(this, e, 'se')}></span>
                
                <span className={[styles.outline, styles.left].join(' ')}
                    style={{
                        left: this.style.borderWidth * -1,
                        top: this.style.borderWidth * -1,
                        height:`calc(100% + ${this.style.borderWidth*2}px)`
                    }}></span>
                <span className={[styles.outline, styles.right].join(' ')}
                    style={{
                        left: `calc(100% + ${this.style.borderWidth}px)`,
                        top: this.style.borderWidth * -1,
                        height:`calc(100% + ${this.style.borderWidth*2}px)`
                    }}></span>
                <span className={[styles.outline, styles.top].join(' ')}
                    style={{
                        left: this.style.borderWidth * -1,
                        top: this.style.borderWidth * -1,
                        width:`calc(100% + ${this.style.borderWidth*2}px)`
                    }}></span>
                <span className={[styles.outline, styles.bottom].join(' ')}
                    style={{
                        left: this.style.borderWidth * -1,
                        top: `calc(100% + ${this.style.borderWidth}px)`,
                        width:`calc(100% + ${this.style.borderWidth*2}px)`
                    }}></span>
            </>


        )
    }


    ContextMenu = forwardRef(({ elementStore, windowStore }, ref) => {
        if (!this.contextMenu) return <></>;

        const cut = () => {
            elementStore.cut(this);
            this.contextMenu = false;
        }

        const copy = () => {
            elementStore.copy(this);
            this.contextMenu = false;
        }

        const paste = () => {
            elementStore.paste();
            this.contextMenu = false;
        }

        const animation = () => {
            windowStore.toggle('animationComponent', true);
            this.contextMenu = false;
            elementStore.closeContextMenu();
        }

        const lock = () => {
            elementStore.lock();
        }

        return (
            <div className={styles.contextMenuContainer}
                ref={ref}
                style={{
                    left: `${this.contextMenu.x}px`,
                    top: `${this.contextMenu.y}px`
                }}>
                <div onClick={animation}>
                    <span>애니메이션</span>
                    <small>Ctrl + M</small>
                </div>
                <div onClick={cut}>
                    <span>잘라내기</span>
                    <small>Ctrl + X</small>
                </div>
                <div onClick={copy}>
                    <span>복사</span>
                    <small>Ctrl + C</small>
                </div>

                <div
                    className={elementStore.clipboard.element ? "" : "deactivate"}
                    onClick={paste}>
                    <span>붙여넣기</span>
                    <small>Ctrl + V</small>
                </div>

                <div onClick={lock}>
                    <span>잠그기</span>
                    <small> </small>

                </div>
            </div>
        )
    })

    addAnimation = (event, animation) => {
        this.animation[event] = animation;
    }

    divToBr = (e) => {
        // if (e.key === 'Enter') {
        //     e.preventDefault();
        //     document.execCommand('insertHTML', false, '<br/>');
        // }
    }
    setInnerText = (e) =>{
        this.innerText = e.target.innerText
    }

    showUpdateParentArea(){
        this.isUpdateParentArea = true;
    }
    hideUpdateParentArea(){
        this.isUpdateParentArea = false;
    }

}

