import styles from '../static/css/Elements.module.css'
export default class Move {
    mouse
    rect
    element
    parent
    action = {
        state: "default",
        target: null,
        position: null,
        virtualGrid: {
            x: [],
            y: [],
        },
    }

    updateArray = []


    constructor(elementStore) {
        this.elementStore = elementStore;
    }

    initAction = () => {
        this.action = {
            state: "default",
            target: null,
            position: null,
            virtualGrid: {
                x: [],
                y: [],
            },
        }
    }

    init = (element, mouse) => {
        if (element.style.position === "sticky") return;
        if (mouse.target.classList.contains(styles.resizeHandle)) return;
        this.parent = this.elementStore.findParent( this.elementStore , element.id)
        this.element = element
        this.mouse = mouse
        this.rect = {
            x: element.style.left,
            y: element.style.top,
        }
        if (this.element.style.position === 'absolute') {
            this.createVirtualGrid()
            this.createUpdateParentArea();
        }


        document.body.addEventListener('mousemove', this.move, true);
        document.body.addEventListener('mouseup', this.end, { once: true })

    }

    move = (e) => {
        //requestAnimationFrame(() => {
        //this.action.target = null;
        if (!this.element) return
        this.element.style.setStyle('pointerEvents', 'none') 
        this.element.style.setStyle('left', e.clientX - (this.mouse.clientX - this.rect.x))
        this.element.style.setStyle('top', e.clientY - (this.mouse.clientY - this.rect.y))

        switch (this.element.style.position) {
            case "absolute":
                this.absolute(e)
                break;
            case "relative":

                this.relative(e)
                break;

            default:
                break;
        }


        //})
    }

    end = () => {
        if (!this.element) return
        this.element.style.setStyle('pointerEvents', 'auto')
        document.body.removeEventListener('mousemove', this.move, true);
        switch (this.element.style.position) {
            case "absolute":
                this.endAbsolute()
                this.resetAbsolute()
                break;
            case "relative":
                this.endRelative()
                this.resetRelative()
                break;

            default:
                break;
        }
        this.action.state = 'default';
    }


    async relative(e) {
        const findSection = (element) => {
            if (element === this.element) return;
            if (element.children === undefined) return;
            if (!element.isCursorOnElement(mousePos, true)) return;

            target = element;
        }
        const createNearLine = (direction, child) => {
            const domChild = document.querySelector(`#${child.id}`);
            const nearCursor = document.createElement('div')
            nearCursor.className = `near-cursor ${direction}`;
            domChild.appendChild(nearCursor);
            this.action.position = direction;
            this.action.state = "moveLocation"
            return child
        }

        let target = null;
        this.resetRelative()
        const mousePos = {
            x: e.clientX,
            y: e.clientY
        }



        try {
            await this.elementStore.traverse({ children: this.elementStore.children }, findSection);
        }
        catch (error) {
            console.error(error)
        }

        // 현재 부모가 같다면 같은 부모 내에서 순서바꾸기
        if (target === this.parent || (!this.parent.id && !target)) {
            const parent = target ?
                target.children : this.elementStore.children;
            parent.some(child => {
                if (this.element === child) return false;
                const near = child.isCursorNearElement(mousePos);
                if ((this.parent.style && this.parent.style.flexDirection === 'column') ||
                    !this.parent.id) {
                    if (near.bottom) {
                        target = createNearLine('bottom', child);
                        return true;
                    } else if (near.top) {
                        target = createNearLine('top', child);
                        return true;
                    }
                } else {
                    if (near.left) {
                        target = createNearLine('left', child);
                        return true;
                    } else if (near.right) {
                        target = createNearLine('right', child);
                        return true;
                    }
                }

                return false;
            })
            this.action.target = target;
        }
        // 부모가 있다면
        else if (target || this.parent.id) {
            const id = target ?
                target.id : 'stage';
            const hoverDomElem = document.body.querySelector(`#${id}`);
            const hover = document.createElement('div');
            hover.className = "hover";
            hoverDomElem.appendChild(hover);
            this.action.target = target;
            this.action.state = "updateParent"
        }





    }

    createVirtualGrid() {
        const parent = this.elementStore.findParent(this.elementStore, this.element.id).children

        const gridX = [];
        const gridY = [];

        parent.forEach(child => {
            if (this.element === child) return;
            const clientElement = document.querySelector(`#${child.id}`).getBoundingClientRect();
            gridX.push(clientElement.top);
            gridX.push(clientElement.bottom);
            gridY.push(clientElement.left);
            gridY.push(clientElement.right);
        })

        this.action.virtualGrid.x = [...new Set(gridX)];
        this.action.virtualGrid.y = [...new Set(gridY)];

    }

    // Absolute 일 때, 자식 노드를 추가하기 위한 인터페이스 
    createUpdateParentArea() {
        const clientElement = document.querySelector(`#${this.element.id}`).getBoundingClientRect();
        const top = clientElement.top - window.innerHeight / 2
        const bottom = clientElement.bottom + window.innerHeight / 2
        this.elementStore.traverse({ children: this.elementStore.children }, (child) => {
            if (child.tag !== 'section') return;
            if (child === this.element) return;
            if (this.parent === child) return;
            const childRect = document.querySelector(`#${child.id}`).getBoundingClientRect();
            const childCenter = childRect.bottom - childRect.top
            if (top < childCenter && childCenter < bottom) {
                child.showUpdateParentArea();
                this.updateArray.push(child);
            }
        });
    }


    async absolute(e) {
        this.resetAbsolute()

        const mousePos = {
            x: e.clientX,
            y: e.clientY
        }

        const stage = document.body.querySelector('#stage');
        const clientStage = stage.getBoundingClientRect();
        const left = e.clientX - (this.mouse.clientX - this.rect.x)
        const top = e.clientY - (this.mouse.clientY - this.rect.y)

        this.action.virtualGrid.x.forEach(line => {
            if (Math.abs(top - (line - clientStage.top)) <= 5) {
                this.element.style.setStyle('top', line - clientStage.top)
                const xGuide = document.createElement('div');
                xGuide.className = 'x-guide';
                xGuide.style.width = `${this.element.style.width / 2}px`;
                xGuide.style.left = `${this.element.style.left - (this.element.style.width / 2)}px`;
                xGuide.style.top = `${this.element.style.top}px`;
                stage.appendChild(xGuide)
            }
            if (Math.abs((top + this.element.style.height) - (line - clientStage.top)) <= 5) {
                this.element.style.setStyle('top', (line - clientStage.top) - this.element.style.height)
                const xGuide = document.createElement('div');
                xGuide.className = 'x-guide';
                xGuide.style.width = `${this.element.style.width / 2}px`;
                xGuide.style.left = `${this.element.style.left - (this.element.style.width / 2)}px`;
                xGuide.style.top = `${this.element.style.top + this.element.style.height}px`;
                stage.appendChild(xGuide)
            }
        })

        this.action.virtualGrid.y.forEach(line => {
            if (Math.abs(left - (line - clientStage.left)) <= 5) {
                this.element.style.setStyle('left', line - clientStage.left)
                const yGuide = document.createElement('div');
                yGuide.className = 'y-guide';
                yGuide.style.height = `${this.element.style.height / 2}px`;
                yGuide.style.top = `${this.element.style.top - (this.element.style.height / 2)}px`;
                yGuide.style.left = `${this.element.style.left}px`;
                stage.appendChild(yGuide)
            }
            if (Math.abs((left + this.element.style.width) - (line - clientStage.left)) <= 5) {
                this.element.style.setStyle('left', (line - clientStage.left) - this.element.style.width)
                const yGuide = document.createElement('div');
                yGuide.className = 'y-guide';
                yGuide.style.height = `${this.element.style.height / 2}px`;
                yGuide.style.top = `${this.element.style.top - (this.element.style.height / 2)}px`;
                yGuide.style.left = `${this.element.style.left + this.element.style.width}px`;
                stage.appendChild(yGuide)
            }
        })


        const yGuide = document.createElement('div');
        yGuide.className = 'height-guide';

        const checkLocation = (element) => {
            if (element === this.element) return;
            if (!element.isCursorOnElement(mousePos)) return;
        }

        await this.elementStore.traverse({ children: this.elementStore.children }, checkLocation);
    }

    resetRelative() {
        const preHover = document.body.querySelector('.hover');
        const preNearCursor = document.body.querySelector('.near-cursor');
        if (preHover) preHover.parentNode.removeChild(preHover);
        if (preNearCursor) preNearCursor.parentNode.removeChild(preNearCursor)
        this.action = {
            state: "default",
            target: null,
            position: null,
            virtualGrid: {
                x: [],
                y: [],
            },
        }
    }

    resetAbsolute() {
        const xGuides = document.body.querySelectorAll('.x-guide');
        const yGuides = document.body.querySelectorAll('.y-guide');
        xGuides.forEach(xGuide => xGuide.parentNode.removeChild(xGuide))
        yGuides.forEach(yGuide => yGuide.parentNode.removeChild(yGuide))
    }

    endRelative = () => {

        this.element.style.setStyle('left', 0)
        this.element.style.setStyle('top', 0)

        if (this.action.state === "moveLocation") {
            if (this.action.target) {
                if (this.action.position === "bottom" ||
                    this.action.position === "right") {
                    this.elementStore.remove(this.element);
                    const index = this.parent.children.indexOf(this.action.target) + 1;
                    this.elementStore.add(this.element, this.parent, index)
                }
                else if (this.action.position === "top" ||
                    this.action.position === "left") {
                    this.elementStore.remove(this.element);
                    const index = this.parent.children.indexOf(this.action.target);
                    this.elementStore.add(this.element, this.parent, index)
                }
            };
        }
        else if (this.action.state === "updateParent") {
            this.elementStore.remove(this.element)
            this.elementStore.add(this.element, this.action.target)
        }
    }

    endAbsolute() {
        this.updateArray.forEach(element => element.hideUpdateParentArea())

        if (this.action.state === "updateParent") {
            const target = this.action.target;
            this.append(this.element, target)
            const left = (target.style.width / 2) - (this.element.style.width / 2);
            const top = (target.style.height / 2) - (this.element.style.height / 2);
            this.element.style.setStyle('left', left)
            this.element.style.setStyle('top', top)
        }


    }


    setUpdateParent(element) {
        this.action.state = "updateParent";
        this.action.target = element;
    }
    unSetUpdateParent() {
        this.initAction()
    }

    checkEqualElements(element, target){
        if(element === target) {
            console.error('You can`t run append on the same two elements.')
            return true;
        }
        return false
    }
    checkIsSetChildElements(target){
        if(!target.children){
            console.error('You can`t run changParent on an element that does not have child elements.')
            return true;
        }
        return false
    }

    checkIsChild(element, target){
        if(target.children){
            const isParent = this.elementStore.findElement(element, target.id)
            if(isParent){
                console.error('Parent elements cannot be inserted below child elements.')
                return true;
            }
        }
        return false;
    }

    append(element, target, idx) {

        if(this.checkEqualElements(element, target)) return;
        if(this.checkIsSetChildElements(target)) return;
        if(this.checkIsChild(element, target)) return;

        this.elementStore.remove(element);
        this.elementStore.add(element, target, idx);
    }

    before(element, target){
        if(this.checkEqualElements(element, target)) return;
        if(this.checkIsChild(element, target)) return;

        const parent = this.elementStore.findParent( this.elementStore , target.id)
        this.elementStore.remove(element);
        const index = parent.children.indexOf(target);
        this.elementStore.add(element, parent, index)
    }

    after(element, target){
        if(this.checkEqualElements(element, target)) return;
        if(this.checkIsChild(element, target)) return;

        const parent = this.elementStore.findParent( this.elementStore , target.id)
        this.elementStore.remove(element);
        const index = parent.children.indexOf(target);
        this.elementStore.add(element, parent, index+1)
    }

}