const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let gameOver = false
let frameAtual = 0
let pause = false
let pontos = 0

const playerTank = {
    posicao: {
        x: 200,
        y: 200
    }, 
    velocidadePadrao: 5,
    raio: 20,
    angulo: 0,
    canhao:{
        x: 35,
        y: 14,
        angulo: 0
    },
    keys: {
        w: 0,
        s: 0,
        a: 0,
        d: 0,
    },
    inimigoMaisProximo: null,
    vida: 10,
    tempoTiro: 60,
    draw: ()=>{
        ctx.beginPath()
        ctx.fillStyle = '#ddd'
        ctx.arc(playerTank.posicao.x, playerTank.posicao.y, playerTank.raio, 0, Math.PI*2)
        ctx.save()
        ctx.translate(playerTank.posicao.x, playerTank.posicao.y)
        ctx.rotate(playerTank.canhao.angulo)
        ctx.rect(0, 0 - playerTank.canhao.y/2, playerTank.canhao.x, playerTank.canhao.y)
        ctx.restore()
        ctx.fill()
        ctx.closePath()
    },
    update: ()=>{
        if(playerTank.inimigoMaisProximo){
            playerTank.canhao.angulo = Math.atan2(
                playerTank.inimigoMaisProximo.posicao.y - playerTank.posicao.y,
                playerTank.inimigoMaisProximo.posicao.x - playerTank.posicao.x) 
        }

        let versorVelocidade = {
            x:playerTank.keys.d + playerTank.keys.a,
            y: playerTank.keys.w + playerTank.keys.s
        }
    
        if(versorVelocidade.x != 0 || versorVelocidade.y != 0){
            playerTank.posicao.x += playerTank.velocidadePadrao* Math.cos(playerTank.angulo)
            playerTank.posicao.y += playerTank.velocidadePadrao*Math.sin(playerTank.angulo)

            playerTank.angulo = Math.atan2(versorVelocidade.y, versorVelocidade.x)
        }else{
            playerTank.posicao.x += 0
            playerTank.posicao.y += 0
        }
    }
}

const projeteis = []
const inimigos = []

let frame = 0
let raio = 15

function renderizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //////TANK//////
    playerTank.draw()
    playerTank.update()
    //////FIM TANK//////
    
    projeteis.forEach((projetil, i)=>{
        if(projetil.posicao.x > canvas.width || projetil.posicao.x < 0 || projetil.posicao.y > canvas.height || projetil.posicao.y < 0){
            projeteis.splice(i, 1)
        }else{
            projetil.update()
        }
    })

    let distanciaInimigoMaisProximo = 10000

    inimigos.forEach((inimigo, i)=>{
        inimigo.update()

        if(distanciaInimigoMaisProximo != 0){
            if(distanciaCirculo(inimigo, playerTank) < distanciaInimigoMaisProximo){
                distanciaInimigoMaisProximo = distanciaCirculo(inimigo, playerTank)
                playerTank.inimigoMaisProximo = inimigo
                //indexInimigoMaisProximo = i
            }
        }

        projeteis.forEach((projetil, j)=>{
            if(!projetil.seInimigo){
                const distancia = distanciaCirculo(inimigo, projetil)
                if(distancia < inimigo.raio+projetil.raio){
                    inimigo.vida--
                    projeteis.splice(j, 1)
                    if(inimigo.vida<=0){
                        inimigo.estado = 'morte'
                        inimigo.indice = i
                        pontos++
                    }
                }
            }else{
                const distancia = distanciaCirculo(playerTank, projetil)
                if(distancia < playerTank.raio+projetil.raio){
                    playerTank.vida--
                    projeteis.splice(j, 1)
                    if(playerTank.vida<=0){
                        gameOver = true
                    }
                }
            }
        })
    })

    if(frameAtual%180 == 0){
        let anguloSpawn = Math.random()*Math.PI*2
        let anguloSpawn2 = Math.random()*Math.PI*2

        const inimigo = new InimigoRed({
            posicao:{
                x: playerTank.posicao.x +500*Math.cos(anguloSpawn),
                y: playerTank.posicao.y + 500*Math.sin(anguloSpawn),
            },
            velocidade: 1,
            raio: 15,
            vida: 2,
            estilo: 'red'
        })
        
        const inimigo2 = new InimigoBlue({
            posicao:{
                x: playerTank.posicao.x + 500*Math.cos(anguloSpawn2),
                y: playerTank.posicao.y + 500*Math.sin(anguloSpawn2),
            },
            velocidade: 1,
            raio: 15,
            vida: 1,
            estilo: 'blue'
        })
        inimigos.push(inimigo)
        inimigos.push(inimigo2)

    }

    //GUI
    ctx.font = '30px Pixelify Sans'
    ctx.textAlign = 'left'
    ctx.fillStyle = 'white'
    ctx.fillText('Pontos: ' + pontos, 10, 50)
    ctx.fillText('Vida: ' + playerTank.vida, 10, 80)
    
    if(gameOver){
        ctx.font = '100px Pixelify Sans'
        ctx.textAlign='center'
        ctx.fillText('Game over', canvas.width/2, 200)
        ctx.font = '50px Pixelify Sans'
        ctx.fillText('Recarregue a página para reiniciar', canvas.width/2, 300)
    }else if(pause){
        ctx.font = '60px Pixelify Sans'
        ctx.textAlign='center'
        ctx.fillText('Jogo pausado', canvas.width/2, 100)
        ctx.fillText('Aperte P para retomar', canvas.width/2, 180)
    }else{
        window.requestAnimationFrame(renderizar)

    }

    if(frameAtual%playerTank.tempoTiro==0){
        let velocidade = 35
        let projetil = new Projetil({
            posicao:{
                x: playerTank.posicao.x + playerTank.canhao.x*Math.cos(playerTank.canhao.angulo),
                y: playerTank.posicao.y + playerTank.canhao.x*Math.sin(playerTank.canhao.angulo)
            },
            velocidade:{
                x: velocidade*Math.cos(playerTank.canhao.angulo),
                y: velocidade*Math.sin(playerTank.canhao.angulo)
            },
            seInimigo: false
        })
        projeteis.push(projetil)
        let shot = new Audio('./assets/sounds/pew-shot.wav');
        
        if(pontos>50){
            playerTank.tempoTiro = 15
        }
        //shot.play()
    }

    frameAtual++
}

function distanciaCirculo(circulo1, circulo2) {
    return Math.sqrt(Math.pow(circulo1.posicao.x - circulo2.posicao.x,2)+ Math.pow(circulo1.posicao.y - circulo2.posicao.y,2))
}

function escreverNaTela(texto, x, y, cor, tamanhoFonte, alinhamento) {
    ctx.font = tamanhoFonte + ' Pixelify Sans'  
    ctx.textAlign= alinhamento
    ctx.fillStyle = cor
    ctx.fillText(texto, x, y)
}