class Ground {
  constructor(rightEdge, downEdge, steps = 100, slope = 0, slopeChange = 0, elevation = 200) {
    this.rightEdge = rightEdge
    this.leftEdge = -100
    this.upEdge = -100
    this.downEdge = downEdge
    this.step = steps
    this.slope = slope
    this.slopeChange = slopeChange
    this.elevation = elevation
    this.vertices = []
  }

  show() {
    
  }
}
  
