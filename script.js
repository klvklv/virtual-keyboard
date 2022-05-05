/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
import jsonKeyboardEn from './dataEn.js';
// import jsonKeyboardRu from './dataRu.js';

let jsonKeyboard = jsonKeyboardEn;
const body = document.querySelector('body');
const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');

const section1 = document.createElement('section');
section1.classList.add('header');
section1.id = 'header';

const h1 = document.createElement('h1');
h1.classList.add('title');
section1.appendChild(h1);
h1.textContent = 'RSS Виртуальная клавиатура';

wrapper.appendChild(section1);

const section2 = document.createElement('section');
section2.classList.add('input');
section2.id = 'input';

const textarea = document.createElement('textarea');
textarea.classList.add('input-area');
section2.appendChild(textarea);

wrapper.appendChild(section2);

const section3 = document.createElement('section');
section3.classList.add('keyboard');
section3.id = 'keyboard';

const div1 = document.createElement('div');
div1.classList.add('keyboard-body');

section3.appendChild(div1);

const div2 = document.createElement('div');
div2.classList.add('keyboard-buttons');

div1.appendChild(div2);

for (let i = 0; i < jsonKeyboard.length; i += 1) {
  const divRows = document.createElement('div');
  divRows.classList.add('button-row');
  for (let j = 0; j < jsonKeyboard[i].length; j += 1) {
    const button = document.createElement('button');
    button.classList.add(...jsonKeyboard[i][j].class.split(' '));
    button.innerHTML = jsonKeyboard[i][j].name;
    button.id = jsonKeyboard[i][j].code;
    button.setAttribute(jsonKeyboard[i][j].property, true);
    divRows.appendChild(button);
  }
  div2.appendChild(divRows);
}

wrapper.appendChild(section3);

const section4 = document.createElement('section');
section4.classList.add('notes');
section4.id = 'notes';

const div3 = document.createElement('div');
div3.classList.add('note-text');

const p1 = document.createElement('p');
div3.appendChild(p1);
p1.textContent = 'Клавиатура создана в операционной системе Windows';

const p2 = document.createElement('p');
p2.innerHTML = 'Для переключения языка воспользуйтесь комбинацией <span>Shift + Alt</span> (слева)';
const span = document.createElement('span');

p2.appendChild(span);

div3.appendChild(p2);

section4.appendChild(div3);

wrapper.appendChild(section4);

body.appendChild(wrapper);

const inputText = document.querySelector('textarea');
const btnEnter = document.querySelector('#Enter');
const btnTab = document.querySelector('#Tab');
const btnDel = document.querySelector('#Delete');
const btnBackspace = document.querySelector('#Backspace');
const btnCapsLock = document.querySelector('#CapsLock');
const btnShiftL = document.querySelector('#ShiftLeft');
const btnShiftR = document.querySelector('#ShiftRight');
const btnCtrlL = document.querySelector('#ControlLeft');
const btnCtrlR = document.querySelector('#ControlRight');
const btnAltL = document.querySelector('#AltLeft');
const btnAltR = document.querySelector('#AltRight');
const btnSpace = document.querySelector('#Space');
const btnSymbols = document.querySelectorAll('button[printable]');

let shiftState = 0;

function findKey(code) {
  for (let i = 0; i < jsonKeyboard.length; i += 1) {
    for (let j = 0; j < jsonKeyboard[i].length; j += 1) {
      if (jsonKeyboard[i][j].code === code) return jsonKeyboard[i][j];
    }
  }
  return null;
}

function enterClicked() {
  const t = inputText.value;
  inputText.value = `${t}\r\n`;
}

function tabClicked() {
  const t = inputText.value;
  inputText.value = `${t}    `;
}

function spaceClicked() {
  const t = inputText.value;
  inputText.value = `${t} `;
}

function delClicked() {

}

function backspaceClicked() {

}

function capslockClicked() {
  if (shiftState === 0) shiftState = 1;
  else shiftState = 0;
  btnSymbols.forEach((el) => {
    const elt = el;
    if (shiftState === 0) {
      elt.innerHTML = findKey(elt.id).name;
    } else {
      elt.innerHTML = findKey(elt.id).nameShift;
    }
  });
  btnCapsLock.classList.toggle('pressed');
  btnCapsLock.classList.toggle('dark');
}

function shiftClicked() {
  if (shiftState === 0) shiftState = 1;
  else shiftState = 0;
  btnSymbols.forEach((el) => {
    const elt = el;
    if (shiftState === 0) {
      elt.innerHTML = findKey(elt.id).name;
    } else {
      elt.innerHTML = findKey(elt.id).nameShift;
    }
  });
}

function ctrlClicked() {

}

function altClicked() {

}

function keyDown(event) {
  const k = findKey(event.code);
  document.querySelector(`#${event.code}`).classList.add('pressed');
  if (k.property === 'printable') {
    event.preventDefault();

    const t = inputText.value;
    let s;
    if (shiftState === 0) s = k.name;
    else s = k.nameShift;
    inputText.value = t + s;
  } else if (k.key === 'Shift' && !event.repeat) shiftClicked();
}

function keyUp(event) {
  const k = findKey(event.code);
  document.querySelector(`#${event.code}`).classList.remove('pressed');
  if (k.property === 'printable') {
    event.preventDefault();
  } else if (k.key === 'Shift') shiftClicked();
}

function btnsClicked(event) {
  const { id } = event.currentTarget;
  if (findKey(id).location > 0) return;
  if (id === 'Enter' || id === 'Tab' || id === 'Space') return;
  const t = inputText.value;
  inputText.value = t + event.currentTarget.innerText;
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
btnEnter.addEventListener('click', enterClicked);
btnTab.addEventListener('click', tabClicked);
btnDel.addEventListener('click', delClicked);
btnBackspace.addEventListener('click', backspaceClicked);
btnCapsLock.addEventListener('click', capslockClicked);
btnShiftL.addEventListener('mousedown', shiftClicked);
btnShiftL.addEventListener('mouseup', shiftClicked);
btnShiftR.addEventListener('mousedown', shiftClicked);
btnShiftR.addEventListener('mouseup', shiftClicked);
btnCtrlL.addEventListener('click', ctrlClicked);
btnCtrlR.addEventListener('click', ctrlClicked);
btnAltL.addEventListener('click', altClicked);
btnAltR.addEventListener('click', altClicked);
btnSpace.addEventListener('click', spaceClicked);
btnSymbols.forEach((el) => el.addEventListener('click', btnsClicked));
