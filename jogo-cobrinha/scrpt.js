//Play Board é a Tela ou Tabuleiro
/* Cointainer onde a cobra e a comida serão renderizadas */
const playBoard = document.querySelector(".play-board");
//Pontuação do Jogador
const scoreElement = document.querySelector(".score");
//Recorde (maior pontuação)
const highScoreElement = document.querySelector(".high-score")
//Controle de movimento
/* Seleciona elementos <i> Icones Botões para Devices Mobiles */
const controls = document.querySelectorAll(".controls i");

//Cadastro de Variaveis

/* Variavel Boleana que indica se o jogo terminou */
let gameOver = false;
// Variavel para armazenar as coordenadas X e Y da Comida
let foodX, foodY;
//Armazena as coordenadas X e Y da cabeça da cobra(posição inicial de 5)
let snakeX = 5, snakeY = 5;
/*variavel para armazenar a velocidade nas direções X e Y, inicialmente em 0*/
let velocityX = 0, velocityY = 0;
// uma Array para armazenar as coordenadas de cada segmento do corpo, primeiro elemento é a cabeça
let snakeBody = [];
// variavel para armazenar o ID do intervalo wue será usado para atualizar o jogo em um determinado ritmo
let setIntervalId;
//Uma variavel para manter o controle da pontuação atual do jogador
let score = 0;



// Obtenha a pontuação alta do armazenamento local
/* Tenta recuperar o  valor associado à chave "high-score" do armazenamento local do navegador */
let highScore = localStorage.getItem("high-score") || 0;
/* Se o localStorage retornar NULL (caso ele não exista) a variavel highScore sera definida como 0 */

//Posição aleatoria entre 1 e 30 para a comida
/* Gera Coordenadas aleatórias para a nova posição da comida */
const updateFoodPosition = () => {
    // Math.random() = retorna um numero de ponto futuante pseudoaleatorio entre 0 e 1
    // * 30: Multiplica o numero aleatorio por 30 para obter um valor entre 0 e quase 30 para obter um valor entre 0 e quase 30
    // Math.floor(): Arredonda o resultado para o número inteiro mais proximo (entre 1 e 29)
    // + 1: Adiciona 1 para garantir que as coordenadas da comidaestejam entre 1 e 30.
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

//Função para lidar com o Fim do Jogo
/* Função handleGameOver = quando a cobra colide consigo mesma ou com as paredes do tabuleiro */

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! 😖 Press Ok para iniciar novamente... ")
    location.reload();
}

//Função para Mudar a direção da cobrinha 
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;

    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;

    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;

    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));


//Começar o Game = Init Game
const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //Quando a cobra come
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore

        localStorage.setItem("high-score", highScore)
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    //add div para cada parte do corpo da cobra 

    // erro palavra LENGHT = length 
    for (let i = 0; i < snakeBody.length; i++) { 
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        //Verifica se a cabeça da cobra atingiu ou colidiu com o corpo
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
        playBoard.innerHTML = html;
    }
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);



