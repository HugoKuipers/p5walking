class Walker {
  constructor(x,y,r) {
    this.x = x
    this.y = y
    this.radius = r
    this.limbs = []
    this.col = color(random(255), random(255), random(255))

    this.body = Bodies.circle(this.x, this.y, this.radius)
    World.add(engine.world, this.body)
  }

  show() {
    fill(this.col)
    ellipse(this.body.position.x, this.body.position.y, this.radius*2)

    for (let l of this.limbs) {
      l.show()
    }
  }
}
  
