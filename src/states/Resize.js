

export default class Resize {
    direction
    element
    mouse
    rect

    init = (element, mouse, direction) => {
        this.direction = direction
        this.element = element
        this.mouse = mouse
        this.rect = {
            x: element.style.left,
            y: element.style.top,
            width: element.style.width,
            height: element.style.height,
        }
        document.body.addEventListener('mousemove', this.resize, true);
        document.body.addEventListener('mouseup', this.resizeEnd, { once: true })
        document.body.style.cursor = `${this.direction}-resize`;
    }


    resize = (e) => {
        
        const isMinHeight = (height) => {
            return height < this.element.style.minHeight ?
                this.element.style.minHeight : height
        }
        const isMinWidth = (width) => {
            return width < this.element.style.minWidth ?
                this.element.style.minWidth : width
        }

        if (this.direction.includes('w')) {
            if (this.element.style.position === 'absolute')
                this.element.style.setStyle('left', e.clientX - (this.mouse.clientX - this.rect.x))

            const width = this.rect.width - (e.clientX - this.mouse.clientX);
            this.element.style.setStyle('width', isMinWidth(width))
        }
        else if (this.direction.includes('e')) {
            
            const width = this.rect.width + (e.clientX - this.mouse.clientX);
            this.element.style.setStyle('width', isMinWidth(width))
        }

        if (this.direction.includes('n')) {
            if (this.element.style.position === 'absolute')
                this.element.style.setStyle('top', e.clientY - (this.mouse.clientY - this.rect.y))

            const height = this.rect.height - (e.clientY - this.mouse.clientY);
            this.element.style.setStyle('height', isMinHeight(height))

        } else if (this.direction.includes('s')) {
            const height = this.rect.height + (e.clientY - this.mouse.clientY);
            this.element.style.setStyle('height', isMinHeight(height))

        }


    }

    resizeEnd = () => {
        document.body.removeEventListener('mousemove', this.resize, true);
        this.direction = 'default';
        if (this.element.style.position === "relative") {
            this.element.style.setStyle('left', 0)
            this.element.style.setStyle('top', 0)

        }
        document.body.style.cursor = `default`;
    }


}