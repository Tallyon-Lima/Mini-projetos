const constCanvasEl = document.querySelector("canvas");
const constCampo = constCanvasEl.getContext("2d");
const gapX = 10;
const larguraRede = 15;
var mouse = {
    x: 0,
    y: 0,
}

var objetoCampo = {
    w: window.innerWidth,
    h: window.innerHeight,
    desenho: function () {
        // Desenho da mesa
        constCampo.fillStyle = "#000000";
        constCampo.fillRect(0, 0, this.w, this.h);
    }
}

var objetoRede = {
    w: 15,
    h: objetoCampo.h,
    desenho: function () {
        // Desenho da rede 
        constCampo.fillStyle = "#ffffff";
        constCampo.fillRect(
            objetoCampo.w / 2 - this.w / 2,
            0,
            this.w,
            this.h)
    }
}

var objetoRaqueteJogador = {
    x: gapX,
    y: objetoCampo.h / 2,
    w: objetoRede.w,
    h: 200,
    _move: function () {
        this.y = mouse.y
    },
    desenho: function () {
        //Desenho da raquete do jogador
        constCampo.fillStyle = "#ffffff";
        constCampo.fillRect(
            this.x,
            this.y,
            this.w,
            this.h
        )
        this._move()
    },
}

var objetoRaqueteCpu = {
    x: objetoCampo.w - objetoRede.w - gapX,
    y: objetoCampo.h / 2,
    w: objetoRede.w,
    h: 200,
    velocidade: 4,
    _move: function () {
      if (this.y + this.h / 2 < objetoBolinha.y + objetoBolinha.r) {
        this.y += this.velocidade
      } else {
        this.y -= this.velocidade
      }
    },
    upVelocidade: function () {
      this.velocidade+= 1.2
    },
    desenho: function () {
      // desenho da raquete direita
      constCampo.fillStyle = "#ffffff"
      constCampo.fillRect(this.x, this.y, this.w, this.h)

      this._move()
    },
  }


var objetoBolinha = {
    x: objetoCampo.w / 1.05,
    y: objetoCampo.h / 2.3,
    r: 20,
    velocidade: 10,                                                                                                                                                    
    direcaoX: 1,
    direcaoY: 1,
    _calcPosicao: function () {

        // Verifica se o jogador fez ponto 
        if (this.x > objetoCampo.w - this.r - objetoRaqueteCpu.w - gapX ) {
            // Verificar a posição da raquete 
            if (this.y + this.r > objetoRaqueteCpu.y && this.y - this.r < objetoRaqueteCpu.y + objetoRaqueteCpu.h) {
                // Rebateu a bola
                this._reverterX()
            } else {
                // Somar ponto
                objetoPontuacao.somarJogador()
                this._restart()
            }
        }

        // Verifica se a Cpu fez ponto
        if(this.x < this.r + objetoRaqueteJogador.w + gapX){
            // Verificar a posição da raquete 
            if (this.y + this.r > objetoRaqueteJogador.y && this.y - this.r < objetoRaqueteJogador.y + objetoRaqueteJogador.h) {
                // Rebateu a bola
                this._reverterX()
            } else {
                // Somar ponto
                objetoPontuacao.somarCpu()
                this._restart()
       
            }
        }


        // rebate a bolinha nos limites da mesa
        if (
            (this.y - this.r < 0 && this.direcaoY < 0) ||
            (this.y > objetoCampo.h - this.r && this.direcaoY > 0)) {
            this._reverterY()
        }

    },
    upVelocidade: function(){ 
        this.velocidade+= 0.9;
    },
    _reverterX: function () {
        this.direcaoX = this.direcaoX * -1

    },
    _reverterY: function () {
        this.direcaoY = this.direcaoY * -1

    },
    _restart: function(){
         this.x = objetoCampo.w / 2;
         this.y = objetoCampo.h / 2;


         objetoRaqueteCpu.upVelocidade()
         this.upVelocidade();
         
    },
    _move: function () {
        this.x += this.direcaoX * this.velocidade
        this.y += this.direcaoY * this.velocidade
    },
    desenho: function () {
        // Desenho da bola 
        constCampo.fillStyle = "#ffffff";
        constCampo.beginPath() /
            constCampo.arc(
                this.x,
                this.y,
                this.r,
                0,
                2 * Math.PI,
                false)
        constCampo.fill()

        this._calcPosicao()
        this._move()
    }
}

var objetoPontuacao = {
    jogador: 0,
    cpu: 0,
    somarJogador: function(){
        this.jogador++
    },
    somarCpu: function(){ 
        if(this.cpu >= 3){
            finalJogo()
        }else{
            this.cpu ++
        }
    },
    desenho: function(){
        constCampo.font = "bold 72px Arial";
        constCampo.textAlign = "center";
        constCampo.fillStyle = "#ffffff";
        constCampo.fillText(this.jogador, objetoCampo.w / 4, 50)
        constCampo.fillText(this.cpu, objetoCampo.w/ 2 + objetoCampo.w / 4, 50)
    } 
}



function iniciar() {
    //Definir as dimensões do campo 
    constCanvasEl.width = window.innerWidth;
    constCanvasEl.height = window.innerHeight;
    constCampo.width = window.innerWidth;
    constCampo.height = window.innerHeight;
}

function desenho() {
    objetoCampo.desenho();
    objetoRede.desenho();
    objetoRaqueteJogador.desenho();
    objetoRaqueteCpu.desenho();
    objetoBolinha.desenho();
    objetoPontuacao.desenho();
}




// API de animação de frame
window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    desenho()
}



    iniciar()
    main()



// Aqui eu "pego" o movimento do mouse
constCanvasEl.addEventListener("mousemove",
    function (e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    })
    
    function finalJogo(){

    }