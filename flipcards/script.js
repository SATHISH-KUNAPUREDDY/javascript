const EMOJIS = ["🍎","🍌","🍇","🍉","🍓","🍒","🍑","🍍","🥝","🍋","🥥","🍐","🍊","🍈","🥭","🍅","🥑","🍆","🌽","🥕","🌶️","🍄","🥔","🍞","🧀","🍗","🍤","🍩","🍪","🍰","🍫","🍿"];

    const gridEl = document.getElementById('grid');
    const movesEl = document.getElementById('moves');
    const timerEl = document.getElementById('timer');
    const matchesEl = document.getElementById('matches');
    const bestEl = document.getElementById('bestScore');
    const restartBtn = document.getElementById('restart');
    const difficultySelect = document.getElementById('difficulty');

    let gridSize = 4; 
    let totalCards = gridSize * gridSize;
    let firstCard = null, secondCard = null;
    let lockBoard = false;
    let moves = 0, matches = 0;
    let timer = null, seconds = 0;

    function resetState() {
      firstCard = null; secondCard = null; lockBoard = false;
      moves = 0; matches = 0; seconds = 0; clearInterval(timer);
      movesEl.textContent = '0'; timerEl.textContent = '00:00'; matchesEl.textContent = '0';
    }

    function startTimer(){
      clearInterval(timer);
      timer = setInterval(()=>{
        seconds++;
        timerEl.textContent = formatTime(seconds);
      },1000);
    }
    function formatTime(s){
      const m = Math.floor(s/60).toString().padStart(2,'0');
      const sec = (s%60).toString().padStart(2,'0');
      return `${m}:${sec}`;
    }

    function shuffle(array){
      for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
      }
      return array;
    }

    function buildDeck(){
      gridSize = parseInt(difficultySelect.value,10);
      totalCards = gridSize*gridSize;

      const pairCount = totalCards/2;
      const emojis = EMOJIS.slice();
      if(pairCount > emojis.length) throw new Error('Not enough emoji variety for this grid');
      const chosen = shuffle(emojis).slice(0,pairCount);
      const deck = shuffle([...chosen, ...chosen]);
      return deck;
    }

    function createCardContent(symbol){
      return `
        <div class="card">
          <div class="card-inner">
            <div class="face front"></div>
            <div class="face back"><span class="emoji">${symbol}</span></div>
          </div>
        </div>`;
    }

    function renderGrid(){
      resetState();
      gridEl.innerHTML='';
      gridEl.className = 'grid size-' + gridSize;
      const deck = buildDeck();
      deck.forEach((sym, idx)=>{
        const wrapper = document.createElement('div');
        wrapper.innerHTML = createCardContent(sym);
        const cardEl = wrapper.firstElementChild;
        cardEl.dataset.symbol = sym;
        cardEl.dataset.index = idx;
        cardEl.setAttribute('role','button');
        cardEl.setAttribute('aria-label','Memory card');
        cardEl.addEventListener('click', onCardClick);
        gridEl.appendChild(cardEl);
      });
      
      gridEl.addEventListener('click', startTimerOnFirst, {once:true});
      loadBest();
    }

    function startTimerOnFirst(){ startTimer(); }

    function onCardClick(e){
      const card = e.currentTarget;
      if(lockBoard) return;
      if(card === firstCard) return; 
      flipCard(card);
      if(!firstCard){ firstCard = card; return; }
      secondCard = card;
      moves++;
      movesEl.textContent = moves;
      checkForMatch();
    }

    function flipCard(card){
      card.classList.add('flipped');
    }
    function unflip(card){ card.classList.remove('flipped'); }

    function checkForMatch(){
      const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
      if(isMatch){
        disableMatched();
        matches++;
        matchesEl.textContent = matches;
        firstCard.classList.add('matched'); secondCard.classList.add('matched');
        firstCard.removeEventListener('click', onCardClick);
        secondCard.removeEventListener('click', onCardClick);
        resetPick();
        if(matches === (totalCards/2)) gameWon();
      } else {
        lockBoard = true;
        setTimeout(()=>{
          unflip(firstCard); unflip(secondCard); resetPick(); lockBoard=false;
        },700);
      }
    }
    function disableMatched(){  }

    function resetPick(){ firstCard=null; secondCard=null; }

    function gameWon(){
      clearInterval(timer);
      const score = {moves, time: seconds, grid: gridSize};
      saveBest(score);
      setTimeout(()=>{
        alert(`You won! Moves: ${moves}, Time: ${formatTime(seconds)}.`);
      },200);
    }

    function loadBest(){
      const key = 'memory_best_' + gridSize;
      const raw = localStorage.getItem(key);
      if(!raw){ bestEl.textContent = '—'; return; }
      try{ const obj = JSON.parse(raw); bestEl.textContent = `${obj.moves} moves • ${formatTime(obj.time)}` }catch(e){ bestEl.textContent = '—' }
    }
    function saveBest(score){
      const key = 'memory_best_' + score.grid;
      const raw = localStorage.getItem(key);
      if(!raw) { localStorage.setItem(key, JSON.stringify(score)); loadBest(); return; }
      const prev = JSON.parse(raw);
      const better = (score.moves < prev.moves) || (score.moves === prev.moves && score.time < prev.time);
      if(better){ localStorage.setItem(key, JSON.stringify(score)); loadBest(); }
    }
    restartBtn.addEventListener('click', ()=>{
      clearInterval(timer); seconds=0; renderGrid();
    });
    difficultySelect.addEventListener('change', ()=>{
      renderGrid();
    });
    renderGrid();