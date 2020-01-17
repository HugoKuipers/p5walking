class Ground {
  constructor(downEdge = height+100, stepLen = 100, steps = 50, slope = 0, slopeChange = 0, elevation = 200) {
    this.rightEdge = stepLen*steps
    this.leftEdge = -100
    this.upEdge = -100
    this.downEdge = downEdge
    this.steps = steps
    this.stepLen = stepLen
    this.slope = slope
    this.slopeChange = slopeChange
    this.elevation = elevation
    this.vertices = []
    this.col = color(100)

    let curPoint = Vector.create(0, this.downEdge-this.elevation)
    for (let i = 0; i < 50; i++) {
      curPoint.x += this.stepLen
      this.vertices.push(Vector.clone(curPoint))
    }

    this.vertices.push(Vector.create(this.rightEdge, this.downEdge))
    this.vertices.push(Vector.create(this.leftEdge, this.downEdge))
    this.vertices.push(Vector.create(this.leftEdge, this.upEdge))
    this.vertices.push(Vector.create(this.stepLen, this.upEdge))

    this.body = Bodies.fromVertices(this.rightEdge / 4, this.downEdge / 1.5, this.vertices, { isStatic: true })
    World.add(engine.world, this.body)
  }

  show() {
    fill(this.col)
    stroke(this.col)
    for (let part of this.body.parts) {
      if (part.id == 3) continue
      beginShape()
      for (const v of part.vertices) {
        vertex(v.x, v.y)
      }
      endShape(CLOSE)
    }
  }
}