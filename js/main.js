//Elementos
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');

const start = document.querySelector('.game-start');
const gamePause = document.querySelector('.game-pause')
const pauseButton = document.getElementById('pauseButton');
const gameOver = document.querySelector('.game-over');

const scoreDisplay = document.getElementById('score');

audioStart = new Audio('./sound/audio_theme.mp3')
audioGameOver = new Audio('./sound/audio_gameover.mp3');
audioCoin = new Audio('./sound/coin.mp3');
audioCoin.volume = 0.2; // Ajuste o volume para o valor desejado (0.0 a 1.0)
audioCoin.duration = 1000;

//Variáveis
let score = 0;
let hasPassedPipe = false;
let gameLoop;
let isPaused = false;



//Iniciar
const startGame = () => {
    pipe.classList.add('pipe-animation');
    start.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    hasPassedPipe = false;
    gameLoop = setInterval(gameLoopFunction, 10); // Inicie o loop do jogo

    // audio
    audioStart.play()
};

//Pausar
const pauseGame = () => {
    if (!isPaused) {
        clearInterval(gameLoop); // Pare o loop do jogo
        pipe.style.animationPlayState = 'paused'; // Pausa a animação do cano
        mario.style.animationPlayState = 'paused'; // Pausa a animação do Mario
        isPaused = true;
        gamePause.style.display = 'flex';
    } else {
        gameLoop = setInterval(gameLoopFunction, 10); // Continue o loop do jogo
        pipe.style.animationPlayState = 'running'; // Continue a animação do cano
        mario.style.animationPlayState = 'running'; // Continue a animação do Mario
        isPaused = false;
        gamePause.style.display = 'none';
    }
};


//Reiniciar
const restartGame = () => {
    if (!isPaused) {
        gameOver.style.display = 'none';
        pipe.style.left = '';
        mario.src = './images/mario.gif';
        mario.style.width = '9.375rem';
        mario.style.bottom = '0';
        mario.style.marginLeft = '0'
        start.style.display = 'none';
        pipe.style.animation = 'pipe-animation 2s infinite linear';

        audioGameOver.pause()
        audioGameOver.currentTime = 0;

        audioStart.play()
        audioStart.currentTime = 0;

        startGame(); // Reinicie o jogo ao pressionar Enter
    }
};

//Pulo do Mario
const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
};

//Lógica do loop e da pontuação
const gameLoopFunction = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        // Código para a colisão com o cano
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;
        mario.classList.remove('jump'); // Corrigido aqui
        mario.style.bottom = `${marioPosition}px`;
        mario.src = './images/game-over.png';
        mario.style.width = '4.688rem';
        mario.style.marginLeft = '50px';

        function stopAudioStart() {
            audioStart.pause()
        }
        stopAudioStart()

        audioGameOver.play()

        function stopAudio() {
            audioGameOver.pause()
        }
        setTimeout(stopAudio, 7000)

        gameOver.style.display = 'flex';
        clearInterval(gameLoop); // Pare o loop do jogo
    }

    if (pipePosition <= -50) {
        hasPassedPipe = false;
    }

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition >= 80 && !hasPassedPipe) {
        score++;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        hasPassedPipe = true;

        // Verifique se a pontuação é maior que zero para evitar tocar o som no início do jogo
        if (score > 0) {
            // Ativar o som quando a pontuação for atualizada
            audioCoin.play();
        }
    }
};

//pulo
document.addEventListener('keydown', (e) => {
    if (!isPaused && (e.key === ' ' || e.key === 'Spacebar')) {
        jump();
    }
});

//pause
document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        pauseGame();
    }
});

//botão pause
pauseButton.addEventListener('click', () => {
    pauseGame();
});

//pulo p/ aparelhos touch
document.addEventListener('touchstart', () => {
    jump();
});

//restart
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        restartGame();
    }
});