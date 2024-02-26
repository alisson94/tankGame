const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let gameOver = false
let frameAtual = 0
let pause = false
let experiencia = 0
let pontos = 0
let tempoSpawnInimigos = 300
let quantInimigos = 1

const shot = new Audio('./assets/sounds/pew-shot.wav');

const projeteis = []
const inimigos = []
const items = []
const particulaExperiencias = []
const lasers = []

let frame = 0
let raio = 15

let boss = null

const playerTank = new Player({
    posicao: {
        x: 200,
        y: 200
    }, 
    velocidade: 5,
    cor: 'white',
    canhao:{
        x: 35,
        y: 14,
        angulo: 0
    },
})

function renderizar() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if(boss){
        boss.update()
        if(Math.hypot(playerTank.posicao.x-boss.posicao.x, playerTank.posicao.y-boss.posicao.y) < boss.raioHitbox + playerTank.raio && playerTank.estado == "padrao"){
            playerTank.dano(5)
            playerTank.estado = 'nocaute'
            playerTank.velocidadeModulo = 8
        }

    }
    
   
    playerTank.update()

    particulaExperiencias.forEach(particula =>{
        particula.update()
    })

    lasers.forEach(laser =>{
        laser.update()
    })

    items.forEach((item, i)=>{
        item.update()
    })

    projeteis.forEach((projetil, i)=>{
        if(!estaNaTela(projetil, projetil.raio)){
            projeteis.splice(i, 1)
        }else{
            projetil.update()
        }

        if(boss && !projetil.seInimigo){
            if(Math.hypot(projetil.posicao.x-boss.posicao.x, projetil.posicao.y-boss.posicao.y) < boss.raioHitbox){
                boss.vida--
                if(boss.vida<=0){
                    boss = null
                }
                projeteis.splice(i, 1)
            }

        }

        if(projetil.seInimigo){
            const distancia = distanciaCirculo(playerTank, projetil)
            if(distancia < playerTank.raio+projetil.raio){
                playerTank.dano(1)
                projeteis.splice(i, 1)
            }
        }
    })

    inimigos.forEach((inimigo, i)=>{
        inimigo.update()

        //CODIGO PARA VER INIMIGO MAIS PERTO. OBS: NAO ESTA EM USO
        {
        // if(estaNaTela(inimigo)){
        //     if(distanciaInimigoMaisProximo != 0){
        //         if(distanciaCirculo(inimigo, playerTank) < distanciaInimigoMaisProximo){
        //             distanciaInimigoMaisProximo = distanciaCirculo(inimigo, playerTank)
        //             playerTank.inimigoMaisProximo = inimigo
        //             //indexInimigoMaisProximo = i
        //         }
        //     }
        // }
        }   

        //AJUSTAR
        if(distanciaCirculo(inimigo, playerTank) < inimigo.raio + playerTank.raio){
            inimigo.angulo = Math.PI + Math.atan2(playerTank.posicao.y - inimigo.posicao.y, playerTank.posicao.x - inimigo.posicao.x)
            inimigo.estado = 'contato'
            inimigo.velocidadeModulo = 5
            playerTank.dano(1)
        }

        items.forEach((item,j)=>{
            if(item instanceof ItemExplosao){
                if(item.estado == 'pegado'){
                    if(distanciaCirculo(item, inimigo)<inimigo.raio+item.raioExplosao.atual){
                        inimigos.splice(i, 1)
                    }
                }
            }
        })

        projeteis.forEach((projetil, j)=>{
            if(!projetil.seInimigo){
                const distancia = distanciaCirculo(inimigo, projetil)
                if(distancia < inimigo.raio+projetil.raio){
                    if(inimigo.estado != 'morte'){
                        inimigo.vida--
                        inimigo.estado = 'dano'
                    }
                    projeteis.splice(j, 1)
                }
            }
        })
    })

    spawnItems()
    spawnInimigos()
    
    if(frameAtual%playerTank.tempoTiro==0){
        playerTank.atirar() 
    }

    //GUI
    ctx.font = '30px Pixelify Sans'
    ctx.textAlign = 'left'
    ctx.fillStyle = 'white'
    ctx.fillText('Experiencia: ' + experiencia, 10, 50)
    ctx.fillText('Pontos: ' + pontos, 10, 80)
    ctx.fillText('Vida: ' + playerTank.vida, 10, 110)
    
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
    frameAtual++
}

function spawnInimigos() {
    if(pontos%50 == 0 && boss==null){
        boss = new Boss({player: playerTank})
    }

    if(frameAtual%tempoSpawnInimigos == 0){
        for (let i = 0; i < quantInimigos; i++) {
            let anguloSpawn = Math.random()*Math.PI*2
            let tipoInimigo = Math.floor(Math.random()*3) 

            let inimigo;

            switch (tipoInimigo) {
                case 0:
                    inimigo = new InimigoRed({
                        posicao:{
                            x: playerTank.posicao.x +500*Math.cos(anguloSpawn),
                            y: playerTank.posicao.y + 500*Math.sin(anguloSpawn),
                        },
                        velocidade: 1,
                        raio: 15,
                        vida: 3,
                        estilo: 'red'
                    })
                    break;
                
                case 1:
                    inimigo = new InimigoBlue({
                        posicao:{
                            x: playerTank.posicao.x + 500*Math.cos(anguloSpawn),
                            y: playerTank.posicao.y + 500*Math.sin(anguloSpawn),
                        },
                        velocidade: 1,
                        raio: 15,
                        vida: 2,
                        estilo: 'blue'
                    })
                    break;
                case 2:
                    inimigo = new InimigoYellow({
                        posicao:{
                            x: playerTank.posicao.x + 500*Math.cos(anguloSpawn),
                            y: playerTank.posicao.y + 500*Math.sin(anguloSpawn),
                        },
                        velocidade: 1,
                        raio: 15,
                        vida: 2,
                        estilo: 'yellow'
                    })
                    break;    
                default:
                    break;
            }

            inimigos.push(inimigo)
                
        }
    }
}

function spawnItems() {
    if(frameAtual%300==0){
        const prob = Math.random()
        if(prob>0.95){
            let anguloSpawn = Math.random()*Math.PI*2
            const item = new ItemBoost({
                posicao:{
                    x: playerTank.posicao.x + 200*Math.cos(anguloSpawn),
                    y: playerTank.posicao.y + 200*Math.sin(anguloSpawn)
                }
            })
            items.push(item)
        }
        if(prob>0.95){
            let anguloSpawn = Math.random()*Math.PI*2
            const item = new ItemExplosao({
                posicao:{
                    x: playerTank.posicao.x + 200*Math.cos(anguloSpawn),
                    y: playerTank.posicao.y + 200*Math.sin(anguloSpawn)
                }
            })
            items.push(item)

        }
    }
}

function distanciaCirculo(circulo1, circulo2) {
    return Math.hypot(circulo1.posicao.x + circulo1.velocidade.x - (circulo2.posicao.x + circulo2.velocidade.x),
                        circulo1.posicao.y + circulo1.velocidade.y - (circulo2.posicao.y + circulo2.velocidade.y))
}

function estaNaTela(objeto, desvio = 0) {
    return objeto.posicao.x < canvas.width + desvio && objeto.posicao.x > 0 - desvio && objeto.posicao.y < canvas.height + desvio && objeto.posicao.y > 0 - desvio
}