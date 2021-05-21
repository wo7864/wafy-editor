import styles from "../static/css/ElementTree.module.css"

export const dragStart = (ref) => {
    const target = ref.current;
    target.classList.add(styles.dragStart);
}


export const dragOver = (e) => {
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}
export const dragEnter = (ref) => {
    const target = ref.current;
    if(target.dataset.tag === "section" || target.dataset.type === "between"){
        target.classList.add(styles.over);
    }
}

export const dragLeave = (ref) => {
    const target = ref.current;
    target.classList.remove(styles.over);
}

export const drop = (e, ref, elementStore) => {
    const move = elementStore.move;
    const parentDOM = ref.current;
    parentDOM.classList.remove(styles.over);

    const elementDOM = document.querySelector('.'+styles.dragStart);
    elementDOM.classList.remove(styles.dragStart);
    const element = elementStore.findElement(elementStore, elementDOM.dataset.id)
    const parent = elementStore.findElement(elementStore, parentDOM.dataset.id)
    move.append(element, parent)
}

export const betweenDrop = (e, ref, elementStore, child, location) => {
    const move = elementStore.move;
    const betweenDom = ref.current;
    const elementDOM = document.querySelector('.'+styles.dragStart);
    betweenDom.classList.remove(styles.over)
    elementDOM.classList.remove(styles.dragStart);

    const element = elementStore.findElement(elementStore, elementDOM.dataset.id)

    if(location === "bottom")
        move.after(element, child)
    else if(location === "top")
        move.before(element, child)
    else
        console.error('Invalid location value.')
}