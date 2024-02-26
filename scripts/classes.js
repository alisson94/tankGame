class Projetil{
    constructor({posicao, velocidade, estilo, seInimigo}){
        this.posicao = posicao
        this.velocidade = velocidade
        this.raioa = 10
        this.raio = 7
        this.estilo = estilo
        this.seInimigo = seInimigo
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = this.estilo
        //ctx.ellipse(this.posicao.x, this.posicao.y, this.raioa, this.raiob,0, 0, Math.PI*2)
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
        this.velocidadeModulo = velocidade,
        this.velocidade = {x: 0, y: 0}
        this.raio = raio
        this.vida = vida
        this.estilo = estilo
        this.cor = estilo
        this.indice = 0
        this.angulo = 0
        this.estado = 'move'
        this.raioMorte = 0
        this.tempoNocaute = 10
    }
    draw(){
        //ctx.arc(this.posicao.x, this.posicao.y, this.raioMorte, 0, -Math.PI*2, true)
        ctx.beginPath()
        ctx.fillStyle = this.cor
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }

    moverPara(x, y){
        if(!seColisao(x, y, this)){
            this.posicao.x = x
            this.posicao.y = y
        }

        this.velocidade.x = this.velocidadeModulo*Math.cos(this.angulo)
        this.velocidade.y = this.velocidadeModulo*Math.sin(this.angulo)
    }

    contato(){
        this.velocidadeModulo -= 0.05
        
        if(this.velocidadeModulo <= 0){
            this.estado ='move'
            this.velocidadeModulo = 1
        }
        
        this.moverPara(this.posicao.x + this.velocidade.x, this.posicao.y + this.velocidade.y)
    }
    dano(){
        this.tempoNocaute--
        this.cor = '#ddd'
        if(this.vida<=0){
            this.estado = 'morte'
        }
        if(this.tempoNocaute<1){
            this.estado = 'move'
            this.cor = this.estilo
            this.tempoNocaute = 10
        }
    }
    morte(){
        inimigos.splice( inimigos.indexOf(this) ,1)
        pontos += 5
        for (let i = 0; i < 10; i++) {
            const experiencia = new Particula({
                posicao: {
                    x: this.posicao.x,
                    y: this.posicao.y
                },
                velocidade: Math.random()*6,
                angulo: Math.random()*2*Math.PI
            });
            particulaExperiencias.push(experiencia)
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

        switch (this.estado) {
            case 'move':
                this.moverPara(this.posicao.x + this.velocidade.x, this.posicao.y + this.velocidade.y)
                this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)

                break;
            
            case 'contato':
                this.contato()
                break

            case 'dano':
                this.dano()
                break
            
            case 'morte':
                this.morte()
                break

            default:
                break;
        }

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
        this.atualFrameTiro = 0
        this.frameTiro = 150
    }
    update(){
        this.draw()

        switch (this.estado) {
            case 'move':
                if(distanciaCirculo(this, playerTank)>300 || !estaNaTela(this)){
                    this.moverPara(this.posicao.x + this.velocidade.x, this.posicao.y + this.velocidade.y)
            
                }else{
                    if(this.atualFrameTiro == this.frameTiro){
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
                        this.atualFrameTiro = 0
                        projeteis.push(projetil)
                    }
                    this.atualFrameTiro++
                }   
        
                this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
                break;
            case 'contato':
                this.contato()

                break 
            case 'dano':
                this.dano()
                break
            
            case 'morte':
                this.morte()
                break

            default:
                break;
        }

        
    }
}

class InimigoYellow extends Inimigo{
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
        this.atualFrameTiro = 0
        this.frameTiro = 120
    }
    update(){
        this.draw()

        switch (this.estado) {
            case 'move':
                if(distanciaCirculo(this, playerTank)>600){
                    this.moverPara(this.posicao.x + this.velocidade.x, this.posicao.y + this.velocidade.y)
        
                }else{
                    if(this.atualFrameTiro == this.frameTiro){
                        let velocidade = 5
                        let projetil = new Projetil({
                            posicao:{
                                x: this.posicao.x,
                                y: this.posicao.y
                            },
                            velocidade:{
                                x: velocidade*Math.cos(this.angulo),
                                y: velocidade*Math.sin(this.angulo)
                            },
                            estilo: this.estilo,
                            seInimigo: true
                        })
                        this.atualFrameTiro = 0
                        projeteis.push(projetil)
                    }
                    this.atualFrameTiro++
                }
        
                this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
                break;
            
            case 'contato':
                this.contato()
                break

            case 'dano':
                this.dano()
                break
            
            case 'morte':
                this.morte()
                break

            default:
                break;
        }

    }
}

class Boss{
    constructor({player}){
        this.player = player
        this.posicao = {
            x: canvas.width/2,
            y: -50
        }
        this.estado = 'iniciando'
        this.velocidade={
            x: 0,
            y: 0
        },
        this.vida = 30
        this.raioHitbox = 40
        this.coolDownAtaqueRadial = 500

        this.coolDownAvisoLaser = 1000
        this.coolDownAtaqueLaser = 400
    }

    draw(){
        ctx.beginPath()
        ctx.fillStyle = 'orange'
        ctx.moveTo(this.posicao.x, this.posicao.y)
        ctx.lineTo(this.posicao.x+50, this.posicao.y-50)
        ctx.lineTo(this.posicao.x, this.posicao.y+50)
        ctx.lineTo(this.posicao.x-50, this.posicao.y-50)
        ctx.fill()
        ctx.closePath()
    }

    update(){
        this.draw()

        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y

        switch (this.estado) {
            case 'iniciando':
                if(this.posicao.y != 100) {
                    this.posicao.y += 1
                }else{
                    this.estado = 'padrao'
                    this.velocidade.x = 1
                }
                break;
                
            case 'padrao':
                if(this.player.posicao.y > 250){
                    if(this.posicao.x >= 700){
                        this.velocidade.x = -1
                    }
                    if(this.posicao.x <= 500){
                        this.velocidade.x = 1
                    }
                }else{
                    if(this.posicao.x != this.player.posicao.x){
                        this.velocidade.x = 3 * Math.sign(this.player.posicao.x - this.posicao.x)
                    }else{
                        this.velocidade.x = 0
                    }
                }
                
                this.coolDownAtaqueRadial--
                
                if(this.coolDownAtaqueRadial == 0){
                    this.coolDownAtaqueRadial = 500
                    for (let i = 0; i < 18; i++) {
                        const projetil = new Projetil({
                            posicao: {
                                x: this.posicao.x,
                                y: this.posicao.y
                            },
                            velocidade: {
                                x: 2*Math.cos(2*Math.PI/18 * i),
                                y: 2*Math.sin(2*Math.PI/18 * i),
                            },
                            estilo: 'orange',
                            seInimigo: true
                        });
                        projeteis.push(projetil)
                    }
                }

                if(this.coolDownAvisoLaser == 0){
                    this.velocidade = {x:0, y:0}
                    
                    if(this.coolDownAtaqueLaser==400){
                        const laser = new Laser({
                            posicao:{
                                x: this.posicao.x,
                                y: this.posicao.y
                            },
                            angulo: Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x),
                            criador: this,
                        })
                        lasers.push(laser)

                    }

                    this.coolDownAtaqueLaser--
                    if(this.coolDownAtaqueLaser==0){
                        this.coolDownAvisoLaser = 1000
                        this.coolDownAtaqueLaser = 400
                        this.velocidade = {x:1, y:0}

                    }
                       
                }else{
                    this.coolDownAvisoLaser--
                }

                break
            default:
                break;
        }
    }
}

class Laser{
    constructor({posicao, angulo}){
        this.posicao = posicao
        this.angulo = angulo
        this.frameAviso = {
            max: 200,
            atual: 0
        }
        this.frameAtaque = {
            max: 200,
            atual: 0
        }
    }

    update(){
        if(this.frameAviso.atual != this.frameAviso.max){
            if(this.frameAviso.atual%50 > 25){
                ctx.beginPath()
                ctx.fillStyle = 'orange'
                ctx.save()
                ctx.translate(this.posicao.x, this.posicao.y)
                ctx.rotate(this.angulo)
                ctx.fillRect(0, 25, 1000, 5)
                ctx.fillRect(0, -25, 1000, 5)
                ctx.restore()
                ctx.closePath()

            }else{
                this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)

            }
            this.frameAviso.atual++
        }else{
            ctx.beginPath()
            ctx.fillStyle = 'orange'
            ctx.save()
            ctx.translate(this.posicao.x, this.posicao.y)
            ctx.rotate(this.angulo)
            const proporcaoRaio = ( this.frameAtaque.atual<20 ? this.frameAtaque.atual/20 : 1)
            ctx.arc(0,0, 25*proporcaoRaio,0, Math.PI*2)
            ctx.rect(0,-25*proporcaoRaio, 1000, 50*proporcaoRaio)
            ctx.fill()
            ctx.restore()
            ctx.closePath()
            this.frameAtaque.atual++
            if(this.frameAtaque.atual == this.frameAtaque.max){
                lasers.splice(lasers.indexOf(this),1)

            }
        }
    }
}

class ItemBoost{
    constructor({posicao}){
        this.posicao = posicao
        this.velocidade = {x:0, y:0}
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
            if(this.tempoBoost.atual < this.tempoBoost.max){
                this.tempoTiroAnterior = playerTank.tempoTiro
                playerTank.tempoTiro = 10
                this.tempoBoost.atual++
            }else{
                playerTank.tempoTiro = this.tempoTiroAnterior
                const indice = items.indexOf(this)
                items.splice(indice, 1)
            }
            
        }
        
    }
}

class ItemExplosao{
    constructor({posicao}){
        this.posicao = posicao
        this.velocidade = {x:0, y:0}
        this.estado = 'nao pegado'
        this.raioExplosao ={
            atual: 0,
            max: 300
        }
        this.raioNegatico = 0
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = '#bbbbbb'
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
            //if(this.raioNegatico<this.raioExplosao.max)
            if(this.raioExplosao.atual>=this.raioNegatico){
                ctx.beginPath()
                ctx.fillStyle = '#ffffff'
                ctx.arc(this.posicao.x, this.posicao.y, this.raioExplosao.atual, 0, Math.PI*2)
                if(this.raioExplosao.atual > 150){
                    ctx.arc(this.posicao.x, this.posicao.y, this.raioNegatico, 0, Math.PI*2, true)
                    this.raioNegatico+=11
                }
                ctx.fill()
                ctx.closePath()
                this.raioExplosao.atual+=8
            }else{
                const indice = items.indexOf(this)
                items.splice(indice, 1)
            }
            
        }
        
    }
}

class Particula{
    constructor({posicao, velocidade, angulo}){
        this.posicao = posicao
        this.velocidade = velocidade
        this.angulo = angulo
        this.raio = 5
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = 'purple'
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.draw()
        this.posicao.x += this.velocidade*Math.cos(this.angulo)
        this.posicao.y += this.velocidade*Math.sin(this.angulo)

        const distancia = Math.hypot(this.posicao.x - playerTank.posicao.x,
        this.posicao.y - playerTank.posicao.y)

        if(distancia < this.raio + playerTank.raio){
            experiencia++
            particulaExperiencias.splice(particulaExperiencias.indexOf(this), 1)
        }else if(distancia < 200){
            this.velocidade+=0.1
            this.angulo = Math.atan2(playerTank.posicao.y - this.posicao.y, playerTank.posicao.x - this.posicao.x)
        }else{
            this.velocidade > 0 ? this.velocidade-=0.05 : this.velocidade = 0
            
        }

    }
}

class Player{
    constructor({posicao, velocidade, cor, canhao}){
        this.posicao = posicao
        this.velocidadeModulo = velocidade
        this.velocidade = {x: 0, y: 0}
        this.raio = 20
        this.cor = cor
        this.angulo = 0
        this.canhao = canhao
        this.keys = {
            w: 0,
            s: 0,
            a: 0,
            d: 0,
        }
        this.mira = {
            x: 0,
            y: 0
        }
        this.inimigoMaisProximo = null
        this.vida = 100
        this.tempoTiro = 50
        this.estado = 'padrao'

    }
    atirar(){
        const velocidade = 35
        const projetil = new Projetil({
            posicao:{
                x: playerTank.posicao.x + playerTank.canhao.x*Math.cos(playerTank.canhao.angulo),
                y: playerTank.posicao.y + playerTank.canhao.x*Math.sin(playerTank.canhao.angulo)
            },
            velocidade:{
                x: velocidade*Math.cos(playerTank.canhao.angulo),
                y: velocidade*Math.sin(playerTank.canhao.angulo)
            },
            estilo: 'white',
            seInimigo: false
        })
        projeteis.push(projetil)

        if(pontos>40){
            playerTank.tempoTiro = 25
            //tempoSpawnInimigos = 150
        }        

        //shot.play()
    }
    dano(dano){
        this.vida -= dano
        if(this.vida<=0){
            gameOver = true
        }
    }
    draw(){
        ctx.beginPath()//desenha tank
        ctx.fillStyle = this.cor
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
        // if(playerTank.inimigoMaisProximo){
        //     playerTank.canhao.angulo = Math.atan2(
        //         playerTank.inimigoMaisProximo.posicao.y - playerTank.posicao.y,
        //         playerTank.inimigoMaisProximo.posicao.x - playerTank.posicao.x) 
        // }
        this.draw()

        playerTank.posicao.x += playerTank.velocidade.x
        playerTank.posicao.y += playerTank.velocidade.y

        playerTank.canhao.angulo = Math.atan2(playerTank.mira.y - playerTank.posicao.y, playerTank.mira.x - playerTank.posicao.x)
                

        switch (this.estado) {
            case 'padrao':
                let versorVelocidade = {
                    x: playerTank.keys.d + playerTank.keys.a,
                    y: playerTank.keys.w + playerTank.keys.s
                } 
                
                if(versorVelocidade.x != 0 || versorVelocidade.y != 0){
                    playerTank.velocidade.x = playerTank.velocidadeModulo* Math.cos(playerTank.angulo)
                    playerTank.velocidade.y = playerTank.velocidadeModulo*Math.sin(playerTank.angulo)
        
                    playerTank.angulo = Math.atan2(versorVelocidade.y, versorVelocidade.x)
                }else{
                    playerTank.velocidade.x = 0
                    playerTank.velocidade.y = 0
                }
        
                
                break;
            
            case 'nocaute':
                this.velocidadeModulo -= 0.15
                
                playerTank.velocidade.x = playerTank.velocidadeModulo* Math.cos(Math.PI * 1/2)
                playerTank.velocidade.y = playerTank.velocidadeModulo*Math.sin(Math.PI * 1/2)

                if(this.velocidadeModulo <= 0){
                    this.estado ='padrao'
                    this.velocidadeModulo = 5
                }

                break
            default:
                break;
        }

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