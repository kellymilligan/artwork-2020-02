const canvasSketch = require( 'canvas-sketch' )

const Vector = require( './Vector' )
const Rectangle = require( './Rectangle' )
const Quadtree = require( './Quadtree' )

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

    const qtree = Quadtree( Rectangle( 0, 0, width, height ), 5 )

    context.fillStyle = 'white'
    context.fillRect( 0, 0, width, height )

    // context.translate( width / 2, height / 2 ) // Move origin to center of canvas

    /* --- */


    for ( let i = 0; i < 500; i++ ) {
      qtree.insert( Vector( Math.random() * width, Math.random() * height ) )
    }

    qtree.visualize( context )

    const area = Rectangle( width * 0.15, width * 0.15, width * 0.3, width * 0.3 )

    context.save()
    context.strokeStyle = '#0f0'
    context.strokeRect( area.x, area.y, area.width, area.height )
    const points = qtree.query( area )
    for ( let point of points ) {
      context.fillStyle = '#0ff'
      context.fillRect( point.x - 3, point.y - 3, 6, 6 )
    }
    context.restore()

  }
}

canvasSketch( sketch, settings )
