class Resizer {
  constructor (elementToResize) {
    this.element = elementToResize;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.clickListener = (e) => this._click(e);
    this.mouseDownListener = (e) => this._mouseDown(e);
    this.mouseMoveListener = (e) => this._mouseMove(e);
    this.mouseUpListener = (e) => this._mouseUp(e);
  }

  _click(e) {
    this.element.removeEventListener('click', this.clickListener, false);
    this.element.className = this.element.className + ' resizable';
    var resizeHandle = document.createElement('div');
    resizeHandle.className = 'resizeHandle';
    this.element.appendChild(resizeHandle);
    resizeHandle.addEventListener('mousedown', this.mouseDownListener, false);
  }

  _mouseDown(e) {
    this.x = e.clientX;
    this.y = e.clientY;
    const cssValues = document.defaultView.getComputedStyle(this.element);
    this.width = parseInt(cssValues.width, 10);
    this.height = parseInt(cssValues.height, 10);
    document.documentElement.addEventListener('mousemove', this.mouseMoveListener, false);
    document.documentElement.addEventListener('mouseup', this.mouseUpListener, false);
  }

  _mouseMove(e) {
    this.element.style.width = (this.width + e.clientX - this.x) + 'px';
    this.element.style.height = (this.height + e.clientY - this.y) + 'px';
  }
  
  _mouseUp(e) {
     document.documentElement.removeEventListener('mousemove', this.mouseMoveListener, false);
     document.documentElement.removeEventListener('mouseup', this.mouseUpListener, false);
  }
  
  getStatus() {
    return `{ id=${this.element.id}, x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height} }`
  }

  init() {
    this.element.addEventListener('click', this.clickListener, false);
  }
}
