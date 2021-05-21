
export class Animation{

    constructor(props){
        this.icon = props.icon ?? "undefined";
        this.name = props.name ?? "undefined";

        this.target = props.target ?? "self"
        this.event = props.event ?? undefined
        this.duration = props.duration ?? 1;
        this.delay = props.delay ?? 0;
        this.repeat = props.repeat ?? 1;

        this.value = props.value1 ?? 100;

        if(!props.attr) console.error('attr이 없습니다.')
        this.attr = props.attr;

        this.timingFunction = props.timingFunction ?? "linear";

        this.func = props.func;
        this.restoreFunc = props.restoreFunc;
    }

    setTarget(target){this.target = target}
    setEvent(event){this.event = event}
    setAttr(attr, value){this[attr] = value}
    animate(){
        return `
        ${this.name}({
            target:'#${this.target}',
            event:'${this.event}',
            ${this.attr.map(key => {
                if(key.name === "timingFunction") return
                const value = typeof key.value === "string" ? `"${key.value}"` : key.value;
                return `${key.name}:${value}`
            })}
        });\n`;
    }
    restoreAnimate(doc){
        const anima = {
            target:doc.querySelector(`#${this.target}`),
            duration:this.duration,
            value1:this.value1,
        }
        this.restoreFunc(anima);
    }
}
