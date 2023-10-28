class Projetil{
    constructor({posicao, velocidade, estilo, seInimigo}){
        this.posicao = posicao
        this.velocidade = velocidade
        this.raio = 7
        this.estilo = estilo
        this.seInimigo = seInimigo
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = this.estilo
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
        estilo,
    }){
        this.posicao = posicao,
        this.velocidade = velocidade,
        this.raio = raio
        this.vida = vida
        this.estilo = estilo
        this.indice = 0
        this.angulo = 0
        this.estado = 'move'
        this.raioMorte = 0
    }
    draw(){
        switch (this.estado) {
            case 'move':
                ctx.beginPath()
                ctx.fillStyle = this.estilo
                ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
                ctx.fill()
                ctx.closePath()
                break;

            case 'morte':
                ctx.beginPath()
                ctx.fillStyle = this.estilo
                if(this.raioMorte < this.raio){
                    this.raioMorte++
                    this.raio+=0.5
                }else{
                    inimigos.splice(this.indice, 1)
                }
                ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
                ctx.arc(this.posicao.x, this.posicao.y, this.raioMorte, 0, -Math.PI*2, true)
                ctx.fill()
                ctx.closePath()
                break;
            default:
                break;
        }
    }
}

class InimigoRed extends Inimigo{
    constructor({
        posicao,
        velocidade,
        raio,
        vida,
        estilo
    }){
        super({
            posicao,
            velocidade,
            raio,
            vida,
            estilo
        })
    }
    update(){
        this.draw()

        if(!seColisao(
                this.posicao.x + this.velocidade*Math.cos(this.angulo),
                this.posicao.y + this.velocidade*Math.sin(this.angulo),
                this
            ))
        {
            this.posicao.x += this.velocidade*Math.cos(this.angulo)
            this.posicao.y += this.velocidade*Math.sin(this.angulo)
        }
        this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
    }
}

class InimigoBlue extends Inimigo{
    constructor({
        posicao,
        velocidade,
        raio,
        vida,
        estilo
    }){
        super({
            posicao,
            velocidade,
            raio,
            vida,
            estilo
        })
    }
    update(){
        this.draw()

        if(distanciaCirculo(this, playerTank)>300){
            if(!seColisao(
                    this.posicao.x + this.velocidade*Math.cos(this.angulo),
                    this.posicao.y + this.velocidade*Math.sin(this.angulo),
                    this
                ))
            {   

                this.posicao.x += this.velocidade*Math.cos(this.angulo)
                this.posicao.y += this.velocidade*Math.sin(this.angulo)
            }

        }else{
            if(frameAtual%120 == 0){
                let velocidade = 3
                let projetil = new Projetil({
                    posicao:{
                        x: this.posicao.x,
                        y: this.posicao.y
                    },
                    velocidade:{
                        x: velocidade*Math.cos(this.angulo),
                        y: velocidade*Math.sin(this.angulo)
                    },
                    estilo: 'blue',
                    seInimigo: true
                })
                projeteis.push(projetil)
            }
        }

        this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
    }
}

class ItemBoost{
    constructor({posicao}){
        this.posicao = posicao
        this.estado = 'nao pegado'
        this.tempoBoost = {
            atual: 0,
            max: 180
        }
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = 'green'
        ctx.arc(this.posicao.x, this.posicao.y, 7, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        if(this.estado == 'nao pegado'){
            this.draw()
            if(distanciaCirculo(this, playerTank)<playerTank.raio+5){
                this.estado = 'pegado'
            }
        }else if(this.estado == 'pegado'){
            if(this.tempoBoost.atual< this.tempoBoost.max){
                playerTank.tempoTiro = 20
                this.tempoBoost.atual++
            }else{
                playerTank.tempoTiro = 100
                const indice = items.indexOf(this)
                items.splice(indice, 1)
            }
            
        }
        
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

function seColisao(x, y, ignore) {
    let retorno = false
    inimigos.forEach(inimigo => {
        if(inimigo!=ignore){
            if(
                Math.sqrt(Math.pow(x- inimigo.posicao.x ,2) + Math.pow(y-inimigo.posicao.y, 2)) < inimigo.raio + ignore.raio
            ){
                retorno = true;
                return
            }
        }
    });
    return retorno
}