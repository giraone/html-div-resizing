class Resizer {
  constructor(element1, element2, bar, barPixelSize, reservedPixelSize, resizeVertical) {
    this.element1 = element1;
    this.element2 = element2;
    this.bar = bar;
    this.barPixelSize = barPixelSize;
    this.reservedPixelSize = reservedPixelSize;
    this.resizeVertical = resizeVertical;
    this.lastPos = 0;
    this.dim1 = 0;
    this.dim2 = 0;
    this.limitTopLeft = 15;
    this.limitBottomRight = 15; // 15+20, wenn nicht overflow:hidden wg. scrollbar
    this.clickListener = (e) => this._click(e);
    this.mouseDownListener = (e) => this._mouseDown(e);
    this.mouseMoveListener = (e) => this._mouseMove(e);
    this.mouseUpListener = (e) => this._mouseUp(e);
  }

  init() {
    this.bar.addEventListener("mousedown", this.mouseDownListener, false);
  }

  getStatus() {
    return `{ pos=${this.lastPos}, dim1=${this.dim1}, dim2=${this.dim2} }`;
  }

  _mouseDown(e) {
    this._storePos(e);
    this.bar.style.backgroundColor = "red";
    document.documentElement.addEventListener(
      "mousemove",
      this.mouseMoveListener,
      false
    );
    document.documentElement.addEventListener(
      "mouseup",
      this.mouseUpListener,
      false
    );
  }

  _mouseMove(e) {
    if (this.resizeVertical) {
      const delta = e.clientY - this.lastPos;
      const elem1Dim = this.dim1 + delta;
      if (elem1Dim < this.limitTopLeft) {
        this._mouseUp();
        return;
      }
      const elem2Dim = this.dim2 - delta;
      if (elem2Dim - this.reservedPixelSize < this.limitBottomRight) {
        this._mouseUp();
        return;
      }
      this.element1.style.height = elem1Dim + "px";
      this.bar.style.top = elem1Dim + "px";
      this.element2.style.top = elem1Dim + this.barPixelSize + "px";
      this.element2.style.height = elem2Dim + "px";

    } else {
      const delta = e.clientX - this.lastPos;
      const elem1Dim = this.dim1 + delta;
      if (elem1Dim < this.limitTopLeft) {
        this._mouseUp();
        return;
      }
      const elem2Dim = this.dim2 - delta;
      if (elem2Dim - this.reservedPixelSize < this.limitBottomRight) {
        this._mouseUp();
        return;
      }
      this.element1.style.width = elem1Dim + "px";
      this.bar.style.left = elem1Dim + "px";
      this.element2.style.left = elem1Dim + this.barPixelSize + "px";
      this.element2.style.width = elem2Dim + "px";
    }
    this._storePos(e);
    console.log(this.getStatus());
  }

  _mouseUp(e) {
    this.bar.style.backgroundColor = "grey";
    document.documentElement.removeEventListener(
      "mousemove",
      this.mouseMoveListener,
      false
    );
    document.documentElement.removeEventListener(
      "mouseup",
      this.mouseUpListener,
      false
    );
  }

  _storePos(e) {
    if (this.resizeVertical) {
      this.lastPos = e.clientY;
      const cssOf1 = document.defaultView.getComputedStyle(this.element1);
      const cssOf2 = document.defaultView.getComputedStyle(this.element2);
      this.dim1 = parseInt(cssOf1.height, 10);
      this.dim2 = parseInt(cssOf2.height, 10);
    } else {
      this.lastPos = e.clientX;
      const cssOf1 = document.defaultView.getComputedStyle(this.element1);
      const cssOf2 = document.defaultView.getComputedStyle(this.element2);
      this.dim1 = parseInt(cssOf1.width, 10);
      this.dim2 = parseInt(cssOf2.width, 10);
    }
  }
}
