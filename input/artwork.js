const canvasSketch = require( 'canvas-sketch' )

const Vector = require( './Vector' )
const Rectangle = require( './Rectangle' )
const Quadtree = require( './Quadtree' )

/* Config */

const settings = {
  dimensions: [ 1024, 1024 ]
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
  return ( { context, width, height } ) => {

    const qtree = Quadtree( Rectangle( 0, 0, width, height ), 10 )

    context.fillStyle = 'white'
    context.fillRect( 0, 0, width, height )

    // context.translate( width / 2, height / 2 ) // Move origin to center of canvas

    /* --- */

    const COUNT = 10000
    const RADIUS = width * 0.003
    const MAX_ATTEMPTS = 100000

    let currentCount = 1
    let failedAttempts = 0

    qtree.insert( Vector( width / 2, height / 2 ) )

    do {

      /* const stem = qtree.getRandomPoint()
      // const points = qtree.query( Rectangle( 0, 0, width, height ) )
      // const stem = points[ points.length - 1 ]
      // const stem = points[ Math.floor( points.length * 0.5 + 0.5 * Math.random() * points.length ) ]
      // const stem = Math.random() > 0.9 ? points[ points.length - 1 ] : qtree.getRandomPoint()
      const theta = ( Math.random() * 2 - 1 ) * Math.PI * 2
      const branch = pointOnCircle( theta, stem.x, stem.y, RADIUS * 2 )

      if ( !Rectangle( 0, 0, width, height ).contains( branch ) ) {
        failedAttempts += 1
      }
      else {
        // const queryRange = Rectangle( branch.x - RADIUS * 2, branch.y - RADIUS * 2, RADIUS * 4, RADIUS * 4 )
        // context.strokeStyle = 'red'
        // context.strokeRect( queryRange.x, queryRange.y, queryRange.width, queryRange.height )
        const collisions = qtree.query( Rectangle( branch.x - RADIUS, branch.y - RADIUS, RADIUS * 2, RADIUS * 2 ) )
        // console.log( collisions.length )
        if ( collisions.length ) {
          // failedAttempts += 1
        } else {
          qtree.insert( branch )
          currentCount += 1
        }
      }

      if ( failedAttempts >= MAX_ATTEMPTS ) {
        console.log( 'Too many failed attempts.' )
        break
      } */

      const newPoint = Vector( width * 0.1 + 0.8 * width * Math.random(), height * 0.1 + 0.8 * height * Math.random() )
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
      context.fillStyle = 'blue'
      context.globalAlpha = 0.5
      context.globalCompositeOperation = 'multiply'
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
