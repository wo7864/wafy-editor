import { action, makeObservable, observable } from "mobx";
import { Element } from '../element/Element';
import { toJSON, toOBJ } from '../element/serializer'
import History from './History'
import Clipboard from './Clipboard'
import Move from './Move'
import Resize from './Resize'
import { saveProject } from "../api";

import stageStyles from '../static/css/Stage.module.css';

export class ElementStore {
    rootStore;

    history;
    clipboard;
    move;
    resize;

    level = 0;
    children = [];
    selectedElem = null;
    tmpMousePos = {};



    isContextMenu = false;
    isEditText = false;

    constructor(root) {
        makeObservable(this, {
            children: observable,
            selectedElem: observable,
            isContextMenu: observable,
            select: action,
            deselect: action,
            add: action,
            remove: action,
            dblClick: action,

            contextMenu: action,

            closeContextMenu: action,
            lock: action,

            save: action,
            load: action,

            undo: action,
            redo: action,
            onDelete:action,
        });


        this.rootStore = root;

        this.children = [

        ]

        this.move = new Move(this)

        this.resize = new Resize({
        })

        this.history = new History()

        this.clipboard = new Clipboard({
            remove: this.remove,
            add: this.add,
        })

        this.setHotkey();

    }


    undo() {
        const data = this.history.undo();
        if (data) {
            this.children.length = 0;
            this.children.push(...data)
            this.selectedElem = data.filter(elem => elem.isSelect)[0]
        }
    }

    redo() {
        const data = this.history.redo();
        if (data) {
            this.children.length = 0;
            this.children.push(...data)
            this.selectedElem = data.filter(elem => elem.isSelect)[0]
        }
    }
    
    onDelete(){
        const {tagName, type, className} = document.activeElement
        if((tagName === 'INPUT' && type ==='text') ||
            className === 'inner-text')
            return

        this.remove(this.selectedElem)
        this.selectedElem = null
    }


    setHotkey() {
        document.addEventListener('keydown', e => {

            // 잘라내기
            if (e.code === 'KeyX' && e.ctrlKey)
                this.clipboard.cut(this.selectedElem)

            // 복사
            if (e.code === 'KeyC' && e.ctrlKey)
                this.clipboard.copy(this.selectedElem)

            // 붙여넣기
            if (e.code === 'KeyV' && e.ctrlKey)
                this.clipboard.paste()

            // 실행 취소
            if (e.code === 'KeyZ' && e.ctrlKey && !e.shiftKey)
                this.undo()

            // 실행 재 취소
            if (e.code === 'KeyZ' && e.ctrlKey && e.shiftKey)
                this.redo()

            // 삭제
            if (e.code === "Delete")
                this.onDelete()
            
        })
    }


    async save(id, project_id) {
        if (this.selectedElem) {
            this.selectedElem.deselect();
            this.selectedElem = null;
        }
        this.isEditText = false;
        const json = JSON.stringify(toJSON(this.children));
        await saveProject(id, project_id, json)
    }

    load(json_data) {
        if (!json_data) console.error('no data!');

        const data = toOBJ(json_data)        
        this.children.length = 0;
        this.children.push(...data)
        this.selectedElem = data.filter(elem => elem.isSelect)[0]
    }



    select(element, e) {
        if (e !== undefined) {
            e.stopPropagation()
            if (e.target.classList.contains('resize-handle')) return;
            if (e.target.parentNode.className === "context-menu-container") return;
        }
        if (!element) return;
        if (element.isLock) return;

        this.isContextMenu = null;
        // 선택 취소
        if (this.selectedElem) {
            if (this.selectedElem === element && this.isEditText) return;
            this.selectedElem.deselect();
            this.selectedElem = null;
        }

        // 선택
        this.selectedElem = element;
        this.selectedElem.select();

        if (e) {
            if (e.button === 2) return;
            this.move.init(this.selectedElem, e)
        }

    }

    deselect(e) {

        // 타겟이 Stage 빈 칸이 아니라면 함수 중단
        if (e.target !== document.querySelector(`.${stageStyles.stage}`)) return;
        this.isContextMenu = null;

        // 현재 선택된 요소가 없으면 함수 중단
        if (!this.selectedElem) return;

        // 선택 해제
        this.selectedElem.deselect();
        this.selectedElem = null;
        this.isEditText = false;

    }

    add = (element, parent, index) => {
        if (this.selectedElem) this.selectedElem.deselect();
        if (!parent) parent = this
        if (!element.id)
            element = new Element(element)

        element.select();
        this.selectedElem = element;
        if (index == null) {
            parent.children.push(element)
        } else {
            parent.children.splice(index, 0, element);
        }
        this.history.act(this.children);
    }


    remove = element => {
        if (!element) { console.error('remove // need element'); return; }
        const preParent = this.findParent(this, element.id).children
        const data = preParent.filter(child => child.id !== element.id);
        preParent.length = 0
        preParent.push(...data)

        return preParent
    }

    // Etc...
    dblClick() {
        this.selectedElem.dblClick();
        if (this.selectedElem.hasOwnProperty('innerText'))
            this.isEditText = true;
    }




    contextMenu(e) {
        e.stopPropagation()
        e.preventDefault();
        if (!this.selectedElem) {
            this.isContextMenu = {
                x: e.clientX,
                y: e.clientY,
            }
        }
        else {
            this.selectedElem.setContextMenu({
                x: e.clientX,
                y: e.clientY,
            });
            this.isContextMenu = true;


        }
    }

    ContextMenuComponent({ elementStore }) {
        const paste = () => {
            elementStore.paste();

        }
        return (
            elementStore.isContextMenu.x > -1 ?
                <div className="context-menu-container"

                    style={{
                        left: `${elementStore.isContextMenu.x}px`,
                        top: `${elementStore.isContextMenu.y}px`
                    }}>

                    <div
                        className={elementStore.clipboard.element ? "" : "deactivate"}
                        onClick={paste}>
                        <span>붙여넣기</span>
                        <small>Ctrl + V</small>
                    </div>
                </div>
                : <></>

        )
    }
    traverse = (element, func) => {

        if (!element.children) return;
        element.children.forEach(child => {
            func(child, element);
            this.traverse(child, func);
        })
    }

    
    // findElement = (root, id) => {
    //     let target;
    //     this.traverse(root, (child) => {
    //         
    //         if (child.id === id) {
    //             target = child
    //         }
    //     })
    //     if (target)
    //         return target
    //     return null
    // }
    findElement = (element, id) => {
        if (!element.children) return;
        let result = element.children.filter(child => child.id === id)
        if(result.length === 0){
            result = element.children.map(child => this.findElement(child, id)).filter(item => item !== undefined)
        }

        return result[0]
    }

    findParent = (root, id) => {
        let parent;
        this.traverse(root, (child, element) => {
            if (child.id === id) {
                parent = element
            }
        })
        if (parent)
            return parent
        return root
    }



    closeContextMenu() {
        this.isContextMenu = null;
    }

    addAnimation(event, anima) {
        this.selectedElem.animation.setAnimation(event, anima);
        this.history.act(this.children);

    }

    lock() {
        this.selectedElem.isLock = true;
        this.selectedElem.contextMenu = false;
        this.selectedElem.deselect();
        this.selectedElem = null;
        this.history.act(this.children);
    }

    unLock() {
        this.selectedElem.isLock = false;
        this.selectedElem.contextMenu = false;
        this.history.act(this.children);
    }

}