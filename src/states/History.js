import { toJSON, toOBJ } from '../element/serializer'

const MAX_HISTORY_COUNT = 50

export default class History {

    history = [[]]
    returnValue = null;
    pointer = 0

    act(data) {
        if(!data) return;
        const json = toJSON(data);
        if (this.history.length >= this.pointer + 1)
            this.history = this.history.slice(0, this.pointer + 1)

        this.history.push(json)
        this.pointer++

        if (this.history.length > MAX_HISTORY_COUNT) {
            this.history.shift();
            this.pointer--
        }

    }

    undo() {
        if (this.pointer <= 1) return;
        this.pointer--;
        return this.updateHistory();
    }

    redo() {
        if (this.pointer + 1 >= this.history.length) return;
        this.pointer++;
        return this.updateHistory();
    }
    updateHistory() {
        const json = this.history[this.pointer]
        if (!json) {
            return [];
        }
        return toOBJ(json)
    }
}
