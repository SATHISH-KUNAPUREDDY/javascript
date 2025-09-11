/* Typing Speed Tester - Vanilla JS
   - Single-file
   - Starts on first printable key
   - Supports backspace with correction
*/

const PASSAGES = [
`The quick brown fox jumps over the lazy dog.`,
`Learning to type quickly improves productivity and opens up opportunities in coding and communication.`,
`Practice consistently, and you'll notice your words per minute increase over time.`,
`Small daily goals compound into big improvements; spend fifteen minutes practicing typing every day.`
];

const passageEl = document.getElementById('passage');
const durationSel = document.getElementById('duration');
const newPassBtn = document.getElementById('newPass');
const restartBtn = document.getElementById('restart');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const cpmEl = document.getElementById('cpm');
const accEl = document.getElementById('acc');
const mistakesEl = document.getElementById('mistakes');
const progressEl = document.getElementById('progress');
const copyBtn = document.getElementById('copyResult');
const bestRecordEl = document.getElementById('bestRecord');
const finalArea = document.getElementById('finalArea');

let duration = parseInt(durationSel.value,10);
let target = '';
let chars = []; // array of span elements representing chars
let index = 0;
let started = false;
let timer = null;
let secondsLeft = duration;
let elapsed = 0;
let correctCount = 0;
let mistakeCount = 0;

function pickPassage(){
  const p = PASSAGES[Math.floor(Math.random()*PASSAGES.length)];
  return p;
}

function renderPassage(text){
  passageEl.innerHTML = '';
  chars = [];
  for(let i=0;i<text.length;i++){
    const span = document.createElement('span');
    span.className = 'char';
    // preserve whitespace visually
    span.textContent = text[i];
    passageEl.appendChild(span);
    chars.push(span);
  }
  // set current highlight
  index = 0;
  updateCurrent();
}

function updateCurrent(){
  chars.forEach((s,i)=>{
    s.classList.remove('current','correct','incorrect');
    if(i < index){
      // already typed: classes set elsewhere
    }
  });
  if(chars[index]) chars[index].classList.add('current');
  updateProgress();
}

function startTimer(){
  if(started) return;
  started = true;
  secondsLeft = duration;
  elapsed = 0;
  updateTimeDisplay();
  timer = setInterval(()=>{
    secondsLeft--;
    elapsed++;
    updateTimeDisplay();
    updateStats();
    if(secondsLeft <= 0){
      finishTest();
    }
  },1000);
}

function stopTimer(){
  clearInterval(timer);
  timer = null;
  started = false;
}

function updateTimeDisplay(){
  const mm = Math.floor(secondsLeft/60).toString().padStart(2,'0');
  const ss = (secondsLeft%60).toString().padStart(2,'0');
  timeEl.textContent = `${mm}:${ss}`;
}

function updateStats(){
  const minutes = Math.max(1, elapsed)/60; // avoid divide by zero; use elapsed for WPM; if elapsed=0 WPM 0
  const wpm = Math.round((correctCount/5) / (minutes));
  const cpm = Math.round((correctCount) / (minutes));
  const totalTyped = correctCount + mistakeCount;
  const acc = totalTyped === 0 ? 100 : Math.max(0, Math.round((correctCount / totalTyped) * 100));
  wpmEl.textContent = (elapsed === 0) ? 0 : wpm;
  cpmEl.textContent = (elapsed === 0) ? 0 : cpm;
  accEl.textContent = acc + '%';
  mistakesEl.textContent = mistakeCount;
  progressEl.textContent = Math.round((index / chars.length) * 100) + '%';
}

function finishTest(){
  stopTimer();
  // ensure final stats update
  updateStats();
  showResults();
  saveBestIfBetter();
}

function showResults(){
  finalArea.innerHTML = '';
  finalArea.style.display = 'flex';
  finalArea.setAttribute('aria-hidden','false');
  const totalTyped = correctCount + mistakeCount;
  const accuracy = totalTyped===0 ? 100 : Math.round((correctCount/totalTyped)*100);
  const minutes = Math.max(1, elapsed)/60;
  const wpm = Math.round((correctCount/5)/minutes);
  const cpm = Math.round((correctCount)/minutes);

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="stat">Final — WPM: <strong>${wpm}</strong></div>
    <div class="stat">CPM: <strong>${cpm}</strong></div>
    <div class="stat">Accuracy: <strong>${accuracy}%</strong></div>
    <div class="stat">Mistakes: <strong>${mistakeCount}</strong></div>
  `;
  finalArea.appendChild(div);
}

function resetAll(newPass=false){
  stopTimer();
  correctCount = 0; mistakeCount = 0; elapsed = 0; secondsLeft = duration;
  timeEl.textContent = (duration>=60? (Math.floor(duration/60).toString().padStart(2,'0') + ':' + (duration%60).toString().padStart(2,'0')) : ('00:' + duration.toString().padStart(2,'0')));
  wpmEl.textContent = 0; cpmEl.textContent = 0; accEl.textContent = '100%'; mistakesEl.textContent = 0; progressEl.textContent = '0%';
  finalArea.innerHTML = ''; finalArea.style.display = 'none';
  started = false;
  if(newPass){
    target = pickPassage();
    renderPassage(target);
  } else {
    // reset highlights and current
    chars.forEach(s => s.className = 'char');
    index = 0; updateCurrent();
  }
  loadBest();
}

function handleKeyDown(e){
  // don't do anything if focus is on input-like elements (we don't have any, but safe)
  const active = document.activeElement;
  if(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

  // handle starting
  if(!started){
    // allowed to start on printable keys or Backspace (don't start on Shift/Ctrl etc)
    if(e.key.length === 1 || e.key === 'Backspace') startTimer();
  }

  if(e.key === 'Backspace'){
    e.preventDefault();
    if(index === 0) return;
    // undo last typed char
    const prev = chars[index-1];
    // adjust counts based on prev class
    if(prev.classList.contains('incorrect')){
      mistakeCount = Math.max(0, mistakeCount - 1);
    } else if(prev.classList.contains('correct')){
      correctCount = Math.max(0, correctCount - 1);
    }
    prev.classList.remove('correct','incorrect');
    index--;
    updateCurrent();
    updateStats();
    return;
  }

  // ignore control keys
  if(e.key.length !== 1) return;

  // printable char
  e.preventDefault();

  // if we've finished passage, ignore extra input
  if(index >= chars.length) return;

  const expected = chars[index].textContent;
  const typed = e.key;

  // map Enter -> newline if the passage had newline (rare here)
  const compareTyped = (typed === 'Enter') ? '\n' : typed;

  if(compareTyped === expected){
    chars[index].classList.add('correct');
    correctCount++;
  } else {
    chars[index].classList.add('incorrect');
    mistakeCount++;
  }
  chars[index].classList.remove('current');
  index++;
  if(chars[index]) chars[index].classList.add('current');
  updateStats();

  // if reached end of text, finish
  if(index >= chars.length){
    finishTest();
  }
}

function saveBestIfBetter(){
  const key = 'typing_best_' + duration;
  const stored = localStorage.getItem(key);
  const minutes = Math.max(1, elapsed)/60;
  const wpm = Math.round((correctCount/5)/minutes);
  const acc = (correctCount + mistakeCount) === 0 ? 100 : Math.round((correctCount/(correctCount+mistakeCount))*100);
  const record = {wpm, acc, mistakes: mistakeCount, time: elapsed, date: new Date().toISOString()};
  if(!stored){
    localStorage.setItem(key, JSON.stringify(record));
    loadBest();
    return;
  }
  try{
    const prev = JSON.parse(stored);
    // better if higher WPM; tie-breaker higher accuracy; then fewer mistakes
    const better = (record.wpm > prev.wpm) || (record.wpm === prev.wpm && record.acc > prev.acc) || (record.wpm === prev.wpm && record.acc === prev.acc && record.mistakes < prev.mistakes);
    if(better){
      localStorage.setItem(key, JSON.stringify(record));
      loadBest();
    }
  }catch(err){}
}

function loadBest(){
  const key = 'typing_best_' + duration;
  const stored = localStorage.getItem(key);
  if(!stored){ bestRecordEl.textContent = 'Best: —'; return; }
  try{
    const obj = JSON.parse(stored);
    bestRecordEl.textContent = `Best: ${obj.wpm} WPM • ${obj.acc}% • ${obj.mistakes} mistakes`;
  }catch(err){
    bestRecordEl.textContent = 'Best: —';
  }
}

function copyResultToClipboard(){
  const minutes = Math.max(1, elapsed)/60;
  const wpm = Math.round((correctCount/5)/minutes);
  const acc = (correctCount + mistakeCount) === 0 ? 100 : Math.round((correctCount/(correctCount+mistakeCount))*100);
  const text = `Typing Test Result (${duration}s): ${wpm} WPM, ${acc}% accuracy, ${mistakeCount} mistakes.`;
  navigator.clipboard?.writeText(text).then(()=> alert('Result copied to clipboard'), ()=> alert(text));
}

/* init */
durationSel.addEventListener('change', ()=> {
  duration = parseInt(durationSel.value,10);
  resetAll(true);
});
newPassBtn.addEventListener('click', ()=> {
  resetAll(true);
});
restartBtn.addEventListener('click', ()=> {
  resetAll(false);
});
copyBtn.addEventListener('click', copyResultToClipboard);
window.addEventListener('keydown', handleKeyDown);

// initial load
target = pickPassage();
renderPassage(target);
resetAll(false);
loadBest();
updateStats();