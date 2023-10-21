const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const tank1 = {
    x: 200,
    y: 200,
    velocidadePadrao: 5,
    velocidadeX: 0,
    velocidadeY: 0,
    raio: 20,
    canhao:{
        x: 35,
        y: 14,
    },
    anguloCanhao: 0,
    keys: {
        w: 0,
        s: 0,
        a: 0,
        d: 0,
    }
}

const projeteis = []


function renderizar() {
    window.requestAnimationFrame(renderizar)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    tank1.x += tank1.velocidadeX
    tank1.y += tank1.velocidadeY

    tank1.velocidadeX = (tank1.keys.d + tank1.keys.a) * tank1.velocidadePadrao
    tank1.velocidadeY = (tank1.keys.w + tank1.keys.s) * tank1.velocidadePadrao

    ctx.beginPath()//desenha tank
    ctx.fillStyle = '#ddd'
    ctx.arc(tank1.x, tank1.y, tank1.raio, 0, Math.PI*2)
    ctx.save()
        ctx.translate(tank1.x, tank1.y)
        ctx.rotate(tank1.anguloCanhao)
        ctx.rect(0, 0 - tank1.canhao.y/2, tank1.canhao.x, tank1.canhao.y)
    ctx.restore()
    ctx.fill()
    ctx.closePath()

    projeteis.forEach(projetil=>{
        projetil.x += projetil.velocidade.x
        projetil.y += projetil.velocidade.y

        ctx.beginPath()//desenha prejetil
        ctx.arc(projetil.x, projetil.y, projetil.raio, 0, Math.PI*2)
        ctx.fill()
        ctx.closePath()
    })
}

canvas.addEventListener('click', (e)=>{
    let velocidade = 7
    projeteis.push({
        x: tank1.x + tank1.canhao.x*Math.cos(tank1.anguloCanhao),
        y: tank1.y + tank1.canhao.x*Math.sin(tank1.anguloCanhao),
        velocidade:{
            x: velocidade*Math.cos(tank1.anguloCanhao),
            y: velocidade*Math.sin(tank1.anguloCanhao)
        },
        raio: 7
    })
})

canvas.addEventListener('mousemove', (e)=>{
    tank1.anguloCanhao = Math.atan2(e.offsetY - tank1.y, e.offsetX - tank1.x)
    console.log(tank1.anguloCanhao)
})

addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'w':
            tank1.keys.w =-1
            break;
        case 's':
            tank1.keys.s =1
            break;
        case 'a':
            tank1.keys.a =-1
            break;
        case 'd':
            tank1.keys.d =1
            break;
        default:
            break;
    }
})

addEventListener('keyup', (e)=>{
    switch (e.key) {
        case 'w':
            tank1.keys.w =0
            break;
        case 's':
            tank1.keys.s =0
            break;
        case 'a':
            tank1.keys.a =0
            break;
        case 'd':
            tank1.keys.d =0
            break;
        default:
            break;
    }
})
