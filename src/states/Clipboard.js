import {toJSON, toOBJ} from '../element/serializer'
export default class Clipboard {

    clipboard = {
        element: null,
    }

    constructor({remove, add}){
        this.remove = remove
        this.add = add
    }

    cut(element) {
        if(!element) return;
        this.remove(element);
        this.copy(element);
    }

    copy(element) {
        if(!element) return;
        const json = toJSON(element)
        this.clipboard.element = json;

    }
    paste() {
        if (!this.clipboard.element) return;
        const element = toOBJ(this.clipboard.element)
        element.setNewId()
        this.add(element)
    }

    


}