const Vector = require( './Vector' )

const distance2d = ( x1, y1, x2, y2 ) => (
  Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) )
)

const Circle = ( x = 0, y = 0, radius = 1 ) => ({
  x,
  y,
  radius,
  contains( { x, y } ) {
    return distance2d( x, y, this.x, this.y ) <= this.radius
  },
  intersects( { x, y, radius, width, height } ) {

    // Circle
    if ( radius !== undefined ) {
      return distance2d( x, y, this.x, this.y ) < ( radius + this.radius )
    }
    // Rectangle
    else if ( width !== undefined && height !== undefined ) {

      const centerDistance = Vector(
        Math.abs( this.x - ( x + width / 2 ) ),
        Math.abs( this.y - ( y + height / 2 ) ),
      )

      if ( centerDistance.x > ( width / 2 + this.radius ) ) { return false }
      if ( centerDistance.y > ( height / 2 + this.radius ) ) { return false }

      if ( centerDistance.x <= ( width / 2 ) ) { return true }
      if ( centerDistance.y <= ( height / 2 ) ) { return true }

      return Math.pow( this.radius, 2 ) >=
        Math.pow( centerDistance.x - width / 2, 2 ) +
        Math.pow( centerDistance.y - height / 2, 2 )

      // const rectangleCenter = Vector( x + width / 2, y + height / 2 )

      // const intersectsCorner =
      //   this.contains( Vector( x, y ) ) ||                // left top
      //   this.contains( Vector( x + width, y ) ) ||        // right top
      //   this.contains( Vector( x, y + height ) ) ||       // left bottom
      //   this.contains( Vector( x + width, y + height ) )  // right bottom

      // const intersectsSide = !(
      //   Math.abs( this.x - rectangleCenter.x ) >= width / 2 + this.radius ||
      //   Math.abs( this.y - rectangleCenter.y ) >= height / 2 + this.radius
      // )

      // return intersectsCorner || intersectsSide
    }
  }
})

module.exports = Circle