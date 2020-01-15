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

  newLimb() {
    let chromA = {}
    let chromB = {}

    for (let i = 0; i < 2; i++) {
      let chrom = i == 0 ? chromA : chromB

      chrom.len = random(1)
      chrom.dir = random(1)
    }

    return new Limb(chromA, chromB)
  }
}
  
