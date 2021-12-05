class Resizer {
  constructor(elements, bars, barPixelSize, reservedPixelSize, resizeVertical) {
    this.elements = elements;
    this.dims = new Array(this.elements.length);
    this.dims.fill(0);
    this.bars = bars;

    this.barPixelSize = barPixelSize;
    this.reservedPixelSize = reservedPixelSize;
    this.resizeVertical = resizeVertical;
    this.lastPos = 0;
    this.limitTopLeft = 15;
    this.limitBottomRight = 15; // 15+20, wenn nicht overflow:hidden wg. scrollbar

    this.clickListener = (e) => this._click(e);
    this.mouseDownListener = (e) => this._mouseDown(e);
    this.mouseMoveListener = (e) => this._mouseMove(e);
    this.mouseUpListener = (e) => this._mouseUp(e);
  }

  init() {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].setAttribute('elementIndex', i);
    }
    for (let i = 0; i < this.bars.length; i++) {
      this.bars[i].setAttribute('barIndex', i);
      this.bars[i].addEventListener('mousedown', this.mouseDownListener, false);
    }
  }

  getStatus() {
    let ret = `{ pos=${this.lastPos}`;
    this.dims.forEach(dim => { ret += `, ${dim}` });
    ret += '}'
    return ret;
  }

  _mouseDown(e) {
    let index1 = this._getIndex('_mouseMove', e);
    // console.log('>>> _mouseMove >>> ' + e.target.id + ' ' + index1);
    if (index1 < 0) {
      return;
    }
    this._storePos(this.resizeVertical ? e.clientY : e.clientX, index1, index1 + 1);
    this._signalBarDown(index1);
    this._addEventListeners();
  }

  _mouseMove(e) {
    let delta;
    let pos;
    if (this.resizeVertical) {
      pos = e.clientY;
      delta = e.clientY - this.lastPos;
    } else {
      pos = e.clientX;
      delta = e.clientX - this.lastPos;
    }
    let index1 = this._getIndex('_mouseMove', e, delta);
    if (index1 < 0) {
      this._removeEventListeners();
      return;
    }
    let index2 = index1 + 1;

    const elem1Dim = this.dims[index1] + delta;
    if (elem1Dim < this.limitTopLeft) {
      console.log('Blocked, because to small!');
      this._signalBarUp(index1);
      return;
    }
    const elem2Dim = this.dims[index2] - delta;
    if (elem2Dim - this.reservedPixelSize < this.limitBottomRight) {
      console.log('Blocked, because to large!');
      this._signalBarUp(index1);
      return;
    }

    if (this.resizeVertical) {
      this.elements[index1].style.height = elem1Dim + 'px';
      this.bars[index1].style.top = elem1Dim + 'px';
      this.elements[index2].style.top = elem1Dim + this.barPixelSize + 'px';
      this.elements[index2].style.height = elem2Dim + 'px';
    } else {
      this.elements[index1].style.width = elem1Dim + 'px';
      this.bars[index1].style.left = elem1Dim + 'px';
      this.elements[index2].style.left = elem1Dim + this.barPixelSize + 'px';
      this.elements[index2].style.width = elem2Dim + 'px'; 
    }
    
    this._storePos(pos, index1, index2);
    console.log(this.getStatus());
  }

  _mouseUp(e) {
    let index1 = this._getIndex('_mouseUp', e);
    if (index1 < 0) {
      this._removeEventListeners();
      return;
    }
    this._signalBarUp(index1);
  }

  _signalBarDown(index1) {
    this.bars[index1].style.backgroundColor = 'red';
  }
  _signalBarUp(index1) {
    if (index1 < this.bars.length) {
      this.bars[index1].style.backgroundColor = 'grey';
    }
    this._removeEventListeners();
  }

  _addEventListeners() {
    document.documentElement.addEventListener(
      'mousemove',
      this.mouseMoveListener,
      false
    );
    document.documentElement.addEventListener(
      'mouseup',
      this.mouseUpListener,
      false
    );
  }
  _removeEventListeners() {
    document.documentElement.removeEventListener(
      'mousemove',
      this.mouseMoveListener,
      false
    );
    document.documentElement.removeEventListener(
      'mouseup',
      this.mouseUpListener,
      false
    );
  }

  _storePos(pos, index1, index2) {
    // console.log('>>> _storePos >>> ' + pos + ' ' + index1 + ' ' + index2);
    this.lastPos = pos;
    if (this.resizeVertical) {      
      const cssOf1 = document.defaultView.getComputedStyle(this.elements[index1]);
      this.dims[index1] = parseInt(cssOf1.height, 10);
      const cssOf2 = document.defaultView.getComputedStyle(this.elements[index2]);
      this.dims[index2] = parseInt(cssOf2.height, 10);  
    } else {
      const cssOf1 = document.defaultView.getComputedStyle(this.elements[index1]);
      this.dims[index1] = parseInt(cssOf1.width, 10);
      const cssOf2 = document.defaultView.getComputedStyle(this.elements[index2]);
      this.dims[index2] = parseInt(cssOf2.width, 10);
    }
    this.lastPos = pos;
    return index1;
  }

  _getIndex(context, e, delta) {
    // console.log('>>> ' + context + ' >>> ' + e.target.id + ' ' + e.target.getAttribute('barIndex') + ' ' + e.target.getAttribute('elementIndex') + ' ' + delta);
    let index = e.target.getAttribute('barIndex');
    if (index) {
      return parseInt(index, 10);
    }
    index = e.target.getAttribute('elementIndex');
    if (!index) {
      console.log(context + ': Target ' + e.target + ' had no attribute barIndex or elementIndex!');
      return -1;
    }
    let index1 = parseInt(index, 10);
    if (delta > 0 && index1 > 0) {
      index1--;
    }
    return index1;
  }
}
