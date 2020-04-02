const canvasSketch = require( 'canvas-sketch' )

/* Config */

const settings = {
  dimensions: [ 1024, 1024 ]
}

/* Toolbox */

const drawCircle = ( ctx, x = 0, y = 0, r = 1 ) => {
  ctx.beginPath()
  ctx.arc( x, y, r, 0, Math.PI * 2 )
  ctx.closePath()
}

/* Artwork */

const sketch = () => {
  return ( { context, width, height } ) => {

    context.fillStyle = 'white'
    context.fillRect( 0, 0, width, height )

    context.translate( width / 2, height / 2 ) // Move origin to center of canvas

    /* --- */

    context.fillStyle = '#611eff'
    drawCircle( context, 0, 0, width * 0.25 )
    context.fill()

  }
}

canvasSketch( sketch, settings )
