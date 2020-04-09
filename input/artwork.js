const canvasSketch = require( 'canvas-sketch' )
const { random } = require( 'canvas-sketch-util' )

const Vector = require( './Vector' )
const Rectangle = require( './Rectangle' )
const Quadtree = require( './Quadtree' )
const Circle = require( './Circle' )

/* Config */

const settings = {
  dimensions: [ 1024, 1024 ],
  animate: true,
  duration: 5,
}

/* Toolbox */

const pointOnCircle = ( theta, x = 0, y = 0, radius = 1 ) => (
  Vector(
    x + radius * Math.cos( theta ),
    y + radius * Math.sin( theta )
  )
)

const drawCircle = ( ctx, x = 0, y = 0, r = 1 ) => {
  ctx.beginPath()
  ctx.arc( x, y, r, 0, Math.PI * 2 )
  ctx.closePath()
}

/* Artwork */

const sketch = () => {
  return ( { context, width, height, playhead } ) => {

    const qtree = Quadtree( Rectangle( 0, 0, width, height ), 10 )

    context.fillStyle = 'white'
    context.fillRect( 0, 0, width, height )

    /* --- */

    const COUNT = 1000
    const RADIUS = width * 0.001
    const MAX_ATTEMPTS = COUNT * 2

    let currentCount = 1
    let failedAttempts = 0

    qtree.insert( Vector( width / 2, height / 2 ) )

    const circle = Circle( width * 0.5, height * 0.5, width * 0.1 )
    const circle2 = Circle( width * 0.65, height * 0.65, width * 0.15 )

    const rectWidth = 0.32
    const rectHeight = 0.4
    const rectangle = Rectangle(
      width * 0.1,
      // -rectWidth * width + width * ( 1 + rectWidth ) * playhead,
      -rectHeight * height + height * ( 1 + rectHeight ) * playhead,
      rectWidth * width,
      rectHeight * height
    )
    const point = Vector( width * 0.45, height * 0.55 )

    context.save()

    context.lineWidth = width * 0.01
    context.strokeStyle = '#00f'
    drawCircle( context, circle.x, circle.y, circle.radius )
    context.stroke()

    context.strokeStyle = '#0f0'
    drawCircle( context, circle2.x, circle2.y, circle2.radius )
    context.stroke()

    // console.log( 'circles intersect:', circle.intersects( circle2 ) )
    const circIntersectsRect = circle.intersects( rectangle )
    const rectIntersectsCirc = rectangle.intersects( circle )
    context.strokeStyle = circIntersectsRect ? '#0ff' : '#f0f'
    context.strokeRect( rectangle.x, rectangle.y, rectangle.width, rectangle.height )

    // console.log( 'rectangle intersects blue circle:', circle.intersects( rectangle ) )

    context.fillStyle = '#f00'
    drawCircle( context, point.x, point.y, width * 0.01 )
    context.fill()

    // console.log( 'blue circle contains:', circle.contains( point ) )

    context.restore()

    return

    do {

      const newPoint = Vector(
        /* width * 0.1 + 0.8 *  */width * random.value(),
        /* height * 0.1 + 0.8 *  */height * random.value()
      )

      newPoint.x += random.noise2D( newPoint.x, newPoint.y, 0.0011 ) * width * 0.11
      newPoint.y += random.noise2D( newPoint.x, newPoint.y, 0.0004 ) * height * 0.08

      if ( !Rectangle( width * 0.1, height * 0.1, width * 0.8, height * 0.8 ).contains( newPoint ) ) continue

      const queryRange = Rectangle( newPoint.x - RADIUS * 2, newPoint.y - RADIUS * 2, RADIUS * 4, RADIUS * 4 )

      // context.save()
      // context.strokeStyle = 'red'
      // context.strokeRect( queryRange.x, queryRange.y, queryRange.width, queryRange.height )
      // context.restore()

      const collisions = qtree.query( queryRange )

      if ( collisions.length ) {
        failedAttempts += 1
      }
      else {
        qtree.insert( newPoint )
        currentCount += 1

        // context.save()
        // context.strokeStyle = '#0f0'
        // context.strokeRect( queryRange.x, queryRange.y, queryRange.width, queryRange.height )
        // context.restore()
      }

      if ( failedAttempts >= MAX_ATTEMPTS ) {
        console.log( 'Too many failed attempts.' )
        break
      }

    } while ( currentCount < COUNT )

    const allPoints = qtree.query( Rectangle( 0, 0, width, height ) )
    for ( let i = 0; i < allPoints.length; i++ ) {
      const point = allPoints[ i ]
      context.save()
      context.fillStyle = `rgb(${
        Math.round( 50 + 150 * ( random.noise2D( point.x, point.y, 0.0006 ) * 0.5 + 0.5 ) )
      }, ${
        Math.round( 50 * ( random.noise2D( point.x, point.y, 0.0003 ) * 0.5 + 0.5 ) )
      }, ${
        Math.round( 100 + 155 * ( 1 - ( random.noise2D( point.x, point.y, 0.0004 ) * 0.5 + 0.5 ) ) )
      })`
      // context.globalAlpha = 0.5
      // context.globalCompositeOperation = 'multiply'
      drawCircle( context, point.x, point.y, RADIUS )
      context.fill()
      context.restore()
    }

    // qtree.visualize( context )

    // const area = Rectangle( width * 0.15, width * 0.15, width * 0.3, width * 0.3 )

    // context.save()
    // context.strokeStyle = '#0f0'
    // context.strokeRect( area.x, area.y, area.width, area.height )
    // const points = qtree.query( area )
    // for ( let point of points ) {
    //   context.fillStyle = '#0ff'
    //   context.fillRect( point.x - 3, point.y - 3, 6, 6 )
    // }
    // const randomPoint = qtree.getRandomPoint()
    // context.fillStyle='#f0f'
    // context.fillRect( randomPoint.x - 10, randomPoint.y - 10, 20, 20 )
    // context.restore()

  }
}

canvasSketch( sketch, settings )
