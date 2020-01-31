class Enviroment {
  constructor(populations, ground, loopTime = 1000) {
    this.loopTime = loopTime
    this.time = 0
    this.groundStats = ground
    this.ground = new Ground(height + 100, 80, 150, 0, 0.5)
    this.translation = createVector(0, -this.ground.body.position.y / 8)
    this.populations = []
    for (let p of populations) {
      for (let i = 0; i < 7; i++) {
        if (!p[i]) p[i] = undefined
      }
      this.populations.push(new Population(p[0], p[1], p[2], p[3], loopTime, p[4], p[5]))
    }
  }

  update() {
    for (let p of this.populations) {
      p.applyForce()

      p.life++
      if (p.life >= p.lifespan) {
        p.repopulate()
      }
    }

    this.time++
    if (this.time >= this.loopTime) {
      this.time = 0
      World.remove(engine.world, this.ground.body)
      this.ground = new Ground(height + 100, 80, 150, 0, 0.5)
    }
  }

  show() {
    push()
    translate(this.translation)

    this.ground.show()
    let verste = 0
    for (let p of this.populations) {
      let verDist = p.show()
      if (verDist > verste) verste = verDist
    }
    this.translation.x = (verste * -1) + width / 1.5

    pop()
  }
}