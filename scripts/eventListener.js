canvas.addEventListener('mousemove', (e)=>{
    playerTank.mira = {
        x: e.offsetX,
        y: e.offsetY
    }
    //playerTank.canhao.angulo = Math.atan2(e.offsetY - playerTank.posicao.y, e.offsetX - playerTank.posicao.x)
})


// canvas.addEventListener('click', (e)=>{
//     let velocidade = 10
//     let projetil = new Projetil({
//         posicao:{
//             x: playerTank.posicao.x + playerTank.canhao.x*Math.cos(playerTank.canhao.angulo),
//             y: playerTank.posicao.y + playerTank.canhao.x*Math.sin(playerTank.canhao.angulo)
//         },
//         velocidade:{
//             x: velocidade*Math.cos(playerTank.canhao.angulo),
//             y: velocidade*Math.sin(playerTank.canhao.angulo)
//         }
//     })
//     projeteis.push(projetil)
// })

addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'w':
            playerTank.keys.w =-1
            break;
        case 's':
            playerTank.keys.s =1
            break;
        case 'a':
            playerTank.keys.a =-1
            break;
        case 'd':
            playerTank.keys.d =1
            break;
        case 'p':
            pause = !pause
            if(!pause){renderizar()} 
            break;
        default:
            break;
    }
})

addEventListener('keyup', (e)=>{
    switch (e.key) {
        case 'w':
            playerTank.keys.w =0
            break;
        case 's':
            playerTank.keys.s =0
            break;
        case 'a':
            playerTank.keys.a =0
            break;
        case 'd':
            playerTank.keys.d =0
            break;
        default:
            break;
    }
})
