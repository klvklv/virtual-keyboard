/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
import jsonKeyboardEn from './dataEn.js';
import jsonKeyboardRu from './dataRu.js';

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
const keyboard = document.querySelector('#keyboard');
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

let lang = 'en';
let shiftState = 0;
let altState = 0;

function findKey(code) {
  for (let i = 0; i < jsonKeyboard.length; i += 1) {
    for (let j = 0; j < jsonKeyboard[i].length; j += 1) {
      if (jsonKeyboard[i][j].code === code) return jsonKeyboard[i][j];
    }
  }
  return null;
}

function changeLetters() {
  btnSymbols.forEach((el) => {
    const elt = el;
    if (shiftState === 0) {
      elt.innerHTML = findKey(elt.id).name;
    } else {
      elt.innerHTML = findKey(elt.id).nameShift;
    }
  });
}

function setLang(langT) {
  switch (langT) {
    case 'en':
      jsonKeyboard = jsonKeyboardEn;
      break;
    case 'ru':
      jsonKeyboard = jsonKeyboardRu;
      break;

    default:
      break;
  }
  changeLetters();
}

function setLocalStorage() {
  localStorage.setItem('lang', lang);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang');
    setLang(lang);
  }
}
window.addEventListener('load', getLocalStorage);

function getCursorPosition() {
  let position = 0;
  if ((inputText.selectionStart != null) && (inputText.selectionStart !== undefined)) {
    position = inputText.selectionStart;
  }
  return position;
}

function insertSymbols(str) {
  const position = getCursorPosition();
  const leftPart = inputText.value.substring(0, position);
  const rightPart = inputText.value.substring(position);
  let strLen = str.length;
  if (str === '\r\n') strLen = 1;
  inputText.value = leftPart + str + rightPart;
  inputText.focus();
  inputText.setSelectionRange(position + strLen, position + strLen);
}

function btnsClicked(event) {
  const { id } = event.currentTarget;
  if (findKey(id).location > 0) return;
  if (id === 'Enter' || id === 'Tab' || id === 'Space') return;
  insertSymbols(event.currentTarget.innerHTML);
}

function enterClicked() {
  insertSymbols('\r\n');
}

function tabClicked() {
  insertSymbols('    ');
}

function spaceClicked() {
  insertSymbols(' ');
}

function delClicked() {
  const position = getCursorPosition();
  inputText.value = inputText.value.substring(0, position)
    + inputText.value.substring(position + 1);
  inputText.focus();
  inputText.setSelectionRange(position, position);
}

function backspaceClicked() {
  const position = getCursorPosition();
  if (position > 0) {
    inputText.value = inputText.value.substring(0, position - 1)
    + inputText.value.substring(position);
    inputText.focus();
    inputText.setSelectionRange(position - 1, position - 1);
  }
}

function capslockClicked() {
  if (shiftState === 0) shiftState = 1;
  else shiftState = 0;
  changeLetters();
  btnCapsLock.classList.toggle('pressed');
  btnCapsLock.classList.toggle('dark');
}
let langswitched = false;
function shiftClicked(event) {
  if (langswitched) {
    if (event === 'up') langswitched = false;
    return;
  }
  if (altState === 1) {
    langswitched = true;
    if (event === 'down') {
      switch (lang) {
        case 'en':
          lang = 'ru';
          break;
        case 'ru':
          lang = 'en';
          break;

        default:
          break;
      }
      setLang(lang);
    }
  } else {
    if (shiftState === 0) shiftState = 1;
    else shiftState = 0;
    changeLetters();
  }
}

function shiftUp(event) {
  if (langswitched) {
    if (event === 'up') langswitched = false;
    return;
  }
  if (shiftState === 0) shiftState = 1;
  else shiftState = 0;
  changeLetters();
}

function ctrlClicked() {

}

function altClicked() {
  altState = 1;
}

function altUp() {
  altState = 0;
}

function keyDown(event) {
  event.preventDefault();
  const k = findKey(event.code);
  if (k === null) return;
  if (k.key !== 'CapsLock') document.querySelector(`#${event.code}`).classList.add('pressed');
  if (k.property === 'printable') {
    let s;
    if (shiftState === 0) s = k.name;
    else s = k.nameShift;
    insertSymbols(s);
  } else {
    switch (k.key) {
      case 'Shift':
        if (!event.repeat) shiftClicked();
        break;
      case 'Alt':
        if (!event.repeat) altClicked();
        break;
      case 'CapsLock':
        if (!event.repeat) capslockClicked();
        break;
      case ' ':
        spaceClicked();
        break;
      case 'Enter':
        enterClicked();
        break;
      case 'Delete':
        delClicked();
        break;
      case 'Backspace':
        backspaceClicked();
        break;
      case 'Tab':
        tabClicked();
        break;

      default:
        break;
    }
  }
}

function keyUp(event) {
  event.preventDefault();
  const k = findKey(event.code);
  if (k === null) return;
  if (k.key !== 'CapsLock') document.querySelector(`#${event.code}`).classList.remove('pressed');
  if (k.property !== 'printable') {
    switch (k.key) {
      case 'Shift':
        shiftUp();
        break;
      case 'Alt':
        altUp();
        break;

      default:
        break;
    }
  }
}

inputText.addEventListener('keydown', keyDown);
inputText.addEventListener('keyup', keyUp);
keyboard.addEventListener('keydown', keyDown);
keyboard.addEventListener('keyup', keyUp);
btnEnter.addEventListener('click', enterClicked);
btnTab.addEventListener('click', tabClicked);
btnDel.addEventListener('click', delClicked);
btnBackspace.addEventListener('click', backspaceClicked);
btnCapsLock.addEventListener('click', capslockClicked);
btnShiftL.addEventListener('mousedown', shiftClicked);
btnShiftL.addEventListener('mouseup', shiftUp);
btnShiftR.addEventListener('mousedown', shiftClicked);
btnShiftR.addEventListener('mouseup', shiftUp);
btnCtrlL.addEventListener('click', ctrlClicked);
btnCtrlR.addEventListener('click', ctrlClicked);
btnAltL.addEventListener('mousedown', altClicked);
btnAltR.addEventListener('mousedown', altClicked);
btnAltL.addEventListener('mouseup', altUp);
btnAltR.addEventListener('mouseup', altUp);
btnSpace.addEventListener('click', spaceClicked);
btnSymbols.forEach((el) => el.addEventListener('click', btnsClicked));
