class Calculator {
  constructor(calc) {
    this._calc = calc;
    this._previousOperator = null;
    this._operator = null;
    this._argument = null;
    this._result = 0;
    this._clearInput = false;
    this._enterArgumentBefore = false;
    this._enterEqualBefore = false;

    this._render();

    this._display = this._calc.querySelector('#display');

    this._calc.addEventListener('click', this._start.bind(this));

    this._calc.onmousedown = this._moveCalculator.bind(this._calc);
  }


  _render(){

    this._calc.innerHTML = `
      <tr>
        <td colspan="5" >
        <input type="text" id="display" value='0'>
        </td>
      </tr>
      <tr>
        <td>7</td>
        <td>8</td>
        <td>9</td>
        <td>/</td>
        <td>+/-</td>
      </tr>
      <tr>
        <td>4</td>
        <td>5</td>
        <td>6</td>
        <td>*</td>
        <td>C</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>-</td>
        <td rowspan="2">=</td>
      </tr>
      <tr>
        <td colspan="2">0</td>
        <td>.</td>
      <td>+</td>
      </tr>`;
  }

  _start(e) {
    let target = e.target;
    let button = target.textContent;

    if (target == this._calc ) return;

    if ((!isNaN(+button) || button == '.')) {
      this._enterNumber(e);
    }

    if ((isNaN(+button) && button != '.')) {
      this._enterOperator(e);
    }

  }

  _enterNumber(e) {
    let target = e.target;
    let button = target.textContent;

    if (this._enterEqualBefore) {
      this._clearMemory()
    }

    if (this._clearInput) {
      this._display.value = 0;
      this._clearInput = false;
    }

    if (button != '.' && this._display.value == '0') this._display.value = '';
    if (button == '.' && ~this._display.value.indexOf('.')) return;

    this._display.value += button;
    this._argument = +this._display.value;
    this._enterArgumentBefore = true;
  }

  _enterOperator(e) {
    let target = e.target;
    let button = target.textContent;
    if (button == 'C') {
      this._clearMemory();
      return;
    }

    if (button == '+/-' && this._display.value != 0) {
      this._changeSign(e);
      return;
    }

    if (button == '=') {
      this._processEqualSign(e);
      return;
    }

    this._processOperator(e)
  }

  _processOperator(e) {
    let target = e.target;
    this._operator = target.textContent;

    if (!this._enterArgumentBefore) this._argument = +this._display.value;

    if (this._enterArgumentBefore && this._previousOperator) {
      this._calculate(this._previousOperator);
    }

    this._result = +this._display.value;
    this._previousOperator = this._operator;

    this._enterArgumentBefore = false;
    this._clearInput = true;
    this._enterEqualBefore = false;

  }

  _processEqualSign() {

    this._enterArgumentBefore = false;
    this._clearInput = true;
    this._enterEqualBefore = true;

    if (this._previousOperator) this._calculate(this._previousOperator);
  }

  _calculate(operator) {
    switch (operator) {
      case '+':
        this._result = this._result + +this._argument;
        this._display.value = this._result;
        break;
      case '-':
        this._result = this._result - +this._argument;
        this._display.value = this._result;
        break;
      case '/':
        this._result = this._result / +this._argument;
        this._display.value = this._result;
        break;
      case '*':
        this._result = this._result * +this._argument;
        this._display.value = this._result;
        break;
    }
  }

  _clearMemory() {
    this._display.value = 0;
    this._result = 0;
    this._enterEqualBefore = false;
    this._previousOperator = null;
  }

  _changeSign() {
    if (this._display.value > 0) this._display.value = -this._display.value; //
    else this._display.value = +this._display.value.slice(1);
    this._argument = +this._display.value;
    // this._display.value > 0 ? this._display.value = -this._display.value: +this._display.value.slice(1); ???
  }

  _moveCalculator(e) {
    let self = this;
    let coords = getCoords(this);
    let shiftX = e.pageX - coords.left;
    let shiftY = e.pageY - coords.top;

    this.style.position = 'absolute';
    moveAt.call(this, e);

    this.style.zIndex = 1000; // над другими элементами

    function moveAt(e) {
      this.style.left = e.pageX - shiftX + 'px';
      this.style.top = e.pageY - shiftY + 'px';
    }

    document.onmousemove = function(e) {
      moveAt.call(self, e);
    };

    this.onmouseup = function() {
      document.onmousemove = null;
      this.onmouseup = null;
    };

    this.ondragstart = function() {
      return false;
    };

    function getCoords(elem) {
      let box = elem.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };

    }
  }

}