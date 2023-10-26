const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let delayInimigos = 0
let pause = false

const inimigo0 = new Inimigo({
    posicao:{
        x: 200,
        y: 200,
    },
    velocidade: 1,
    raio: 15,
    vida: 2,
    
})

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
    inimigoMaisProximo: inimigo0,
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
inimigos.push(inimigo0)

function renderizar() {
    if (!pause){window.requestAnimationFrame(renderizar)} 
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
    let indexInimigoMaisProximo = null

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
            const distancia = distanciaCirculo(inimigo, projetil)
            if(distancia < inimigo.raio+projetil.raio){
                inimigo.vida--
                projeteis.splice(j, 1)
                if(inimigo.vida<=0){
                    inimigos.splice(i, 1)
                }
            }
        })
    })

    if(delayInimigos%120 == 0){
        let anguloSpawn = Math.random()*Math.PI*2
        const inimigo = new Inimigo({
            posicao:{
                x: 500*Math.cos(anguloSpawn),
                y: 500*Math.sin(anguloSpawn),
            },
            velocidade: 1,
            raio: 15,
            vida: 2,
        })
        inimigos.push(inimigo)
    }
    delayInimigos++


}

function distanciaCirculo(circulo1, circulo2) {
    return Math.sqrt(Math.pow(circulo1.posicao.x - circulo2.posicao.x,2)+ Math.pow(circulo1.posicao.y - circulo2.posicao.y,2))
}

