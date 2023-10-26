class Projetil{
    constructor({posicao, velocidade}){
        this.posicao = posicao
        this.velocidade = velocidade
        this.raio = 7
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.draw()
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y
    }
}

class Inimigo{
    constructor({
        posicao,
        velocidade,
        raio,
        vida,
    }){
        this.posicao = posicao,
        this.velocidade = velocidade,
        this.raio = raio
        this.angulo = 0
        this.vida = vida
    }draw(){
        ctx.beginPath()
        ctx.fillStyle = 'red'
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.draw()
        this.posicao.x += this.velocidade*Math.cos(this.angulo)
        this.posicao.y += this.velocidade*Math.sin(this.angulo)

        this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
    }
}

class Player{
    constructor({posicao, velocidade, cor, canhao}){
        this.posicao = posicao
        this.velocidade = velocidade
        this.raio = 7
        this.cor = cor
        this.canhao = canhao

    }
    draw(){
        ctx.beginPath()//desenha tank
        ctx.fillStyle = cor
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
        ctx.save()
            ctx.translate(this.posicao.x, this.posicao.y)
            ctx.rotate(this.canhao.angulo)
            ctx.rect(0, 0 - this.canhao.y/2, this.canhao.x, this.canhao.y)
        ctx.restore()
        ctx.fill()
    ctx.closePath()
    }
    update(){
        this.draw()
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y
    }
}