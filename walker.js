class Walker {
  constructor(x, y, r, limbs, mutCha, newMutCha = mutCha, remMutCha = newMutCha) {
    this.filter = -5
    this.mutCha = mutCha
    this.newMutCha = newMutCha
    this.remMutCha = remMutCha
    this.maxLimbLen = 120
    this.maxLimbWidth = 40
    this.x = x
    this.y = y
    this.radius = r
    this.limbDistFromCenter = this.radius / 1.5
    this.limbs = limbs
    this.col = color(random(255), random(255), random(255), 50)
    this.fitness = 0
    this.limbBodies = []
    this.limbConsts = []

    this.body = Bodies.circle(this.x, this.y, this.radius, { collisionFilter: { group: this.filter }})
    World.add(engine.world, this.body)

    // print(this.body)

    for (let l of this.limbs) {
      let footDir = (l.chromR.dir * TWO_PI)
      let footLoc = createVector(cos(footDir), sin(footDir))
      footLoc.mult((l.chromR.len * this.maxLimbLen * 0.5) + this.limbDistFromCenter)
      let limbBody = Bodies.rectangle(this.x + footLoc.x, this.y + footLoc.y, l.chromR.len * this.maxLimbLen, l.chromR.width * this.maxLimbWidth, { collisionFilter: { group: this.filter }})
      this.limbBodies.push(limbBody)
      Body.rotate(limbBody, l.chromR.dir * TWO_PI)
      World.add(engine.world, limbBody)

      // print(limbBody)

      footLoc.setMag(this.limbDistFromCenter)
      let loc2 = footLoc.copy()
      loc2.setMag(l.chromR.len * this.maxLimbLen * -0.5)
      let footDir2 = (l.chromR.dir * TWO_PI) - (0.5 * PI)
      let footCorner = createVector(cos(footDir2), sin(footDir2))
      footCorner.setMag(l.chromR.width * this.maxLimbWidth * 0.5)
      print(loc2, footCorner)
      loc2.add(footCorner)
      let options = {
        bodyA: this.body,
        bodyB: limbBody,
        pointA: Vector.create(footLoc.x, footLoc.y),
        pointB: Vector.create(loc2.x, loc2.y),
        damping: 0.1,
        stiffness: 1,
        angularStiffness: 1
      }
      let leg = Constraint.create(options)
      
      let options2 = {
        bodyA: this.body,
        bodyB: limbBody,
        pointA: Vector.create(footLoc.x, footLoc.y),
        pointB: Vector.create(0,0),
        damping: 0.1,
        stiffness: 1,
        angularStiffness: 1
      }
      let leg2 = Constraint.create(options2)
      
      this.limbConsts.push(leg)
      World.add(engine.world, leg)
      // this.limbConsts.push(leg2)
      // World.add(engine.world, leg2)
      
      print(leg)
      print(leg2)
    }
  }

  show() {
    fill(this.col)
    ellipse(this.body.position.x, this.body.position.y, this.radius*2)

    for (let l of this.limbBodies) {      
      beginShape()
      for (let v of l.vertices) {
        vertex(v.x, v.y)
      }
      endShape(CLOSE)
    }

    for (let l of this.limbConsts) {
      line(l.bodyA.position.x + l.pointA.x, l.bodyA.position.y + l.pointA.y, l.bodyB.position.x + l.pointB.x, l.bodyB.position.y + l.pointB.y)
    }
  }

  killSelf() {
    for (let l of this.limbConsts) {
      World.remove(engine.world, l)
    }
    for (let l of this.limbBodies) {
      World.remove(engine.world, l)
    }
    World.remove(engine.world, this.body)
  }

  reproduce(other) {
    let newLimbs = []
    let most = this.limbs.length < other.limbs.length ? other.limbs : this.limbs
    let least = this.limbs.length < other.limbs.length ? this.limbs : other.limbs

    for (let i = 0; i < most.length; i++) {
      let oth = (least.length < i + 1) ? most[i] : least[i]
      newLimbs.push(most[i].replicate(oth, this.mutCha))
    }

    // TODO remove all connected limbs!
    // if (random() < this.remMutCha) {
    //   let cut = floor(random(newLimbs.length))
    //   let toCut = this.cutLimb(newLimbs,cut)
    //   for (let i = newLimbs.length - 1; i >= 0; i--) {
    //     if (toCut.includes(i)) newLimbs.splice(i, 1)
    //   }
    // }
    if (random() < this.remMutCha) {
      let cut = floor(random(newLimbs.length))
      newLimbs.splice(cut, 1)
    }

    if (random() < this.newMutCha) {
      newLimbs.push(this.newLimb(newLimbs.length))
    }

    return newLimbs
  }

  cutLimb(limbs, ind) {
    let toCut = [ind]
    for (let i = limbs.length-1; i >= 0; i--) {
      if (limbs[i].con == ind) {
        toCut = toCut.concat(this.cutLimb(limbs, i))
      }
    }

    return toCut
  }

  newLimb(limbCount = 0) {
    let chromA = {}
    let chromB = {}

    for (let i = 0; i < 2; i++) {
      let chrom = i == 0 ? chromA : chromB

      chrom.len = random()
      chrom.width = random()
      chrom.dir = random()
      chrom.force = random()
    }

    let con = floor(random(limbCount))

    return new Limb(chromA, chromB, con)
  }
}
  
