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
      const chromosome = l.chromR
      const parent = l.con == 0 ? this.body : this.limbBodies[l.con-1]
      if (parent == undefined) print(this)
      let footDir = (chromosome.dir * TWO_PI)
      let footLoc = createVector(cos(footDir), sin(footDir))
      l.con == 0 ? footLoc.mult((chromosome.len * this.maxLimbLen * 0.5) + this.limbDistFromCenter) : footLoc.mult(chromosome.len * this.maxLimbLen * 0.5)
      let extraOffset = l.con == 0 ? createVector(0, 0) : createVector(cos(parent.angle), sin(parent.angle))
      extraOffset.mult(chromosome.len * this.maxLimbLen * 0.5)
      footLoc.add(extraOffset)
      let limbBody = Bodies.rectangle(parent.position.x + footLoc.x, parent.position.y + footLoc.y, chromosome.len * this.maxLimbLen, chromosome.width * this.maxLimbWidth, { collisionFilter: { group: this.filter }})
      this.limbBodies.push(limbBody)
      Body.rotate(limbBody, chromosome.dir * TWO_PI)
      World.add(engine.world, limbBody)

      // print(limbBody)

      footLoc.setMag(this.limbDistFromCenter)
      let loc2 = footLoc.copy()
      loc2.setMag(chromosome.len * this.maxLimbLen * -0.5)
      let footDir2 = (chromosome.dir * TWO_PI) - (0.5 * PI)
      let footCorner = createVector(cos(footDir2), sin(footDir2))
      footCorner.setMag(chromosome.width * this.maxLimbWidth * 0.5)

      // print(loc2, footCorner)

      this.addJoint(limbBody, footLoc, loc2, chromosome, footCorner)
      footCorner.mult(-2)
      this.addJoint(limbBody, footLoc, loc2, chromosome, footCorner)
    }

  }

  jointOptions(limbBody, jointPreviousBody, jointLeg, chromosome) {
    return {
      bodyA: this.body,
      bodyB: limbBody,
      pointA: Vector.create(jointPreviousBody.x, jointPreviousBody.y),
      pointB: Vector.create(jointLeg.x, jointLeg.y),
      damping: 0.1,
      stiffness: chromosome.stiffness,
      angularStiffness: chromosome.stiffness
    }
  }

  addJoint(limbBody, jointPreviousBody, jointLeg, chromosome, jointDelta) {
    jointLeg.add(jointDelta)
    jointPreviousBody.add(jointDelta)

    let joint = Constraint.create(this.jointOptions(limbBody, jointPreviousBody, jointLeg, chromosome))

    this.limbConsts.push(joint)
    World.add(engine.world, joint)
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
      if (least.length < i + 1 && random() > 0.5) break
      let oth = (least.length < i + 1) ? most[i] : least[i]
      newLimbs.push(most[i].replicate(oth, this.mutCha))
    }

    if (random() < this.remMutCha) {
      let cut = floor(random(newLimbs.length))
      let toCut = this.cutLimb(newLimbs,cut)

      for (let i = 0; i < newLimbs.length; i++) {
        let detract = 0
        for (let j = 0; j < toCut.length; j++) {
          if (toCut[j] < newLimbs[i].con) detract++
        }
        newLimbs[i].con -= detract
      }

      for (let i = newLimbs.length-1; i >= 0; i--) {
        if (toCut.includes(i)) newLimbs.splice(i, 1)
      }
    }

    if (random() < this.newMutCha) {
      newLimbs.push(this.newLimb(newLimbs.length))
    }

    return newLimbs
  }

  cutLimb(limbs, ind) {
    let toCut = [ind]
    for (let i = limbs.length-1; i >= 0; i--) {
      if (limbs[i].con == ind + 1) {
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
      chrom.stiffness = random()
    }

    let con = floor(random(limbCount+1))

    return new Limb(chromA, chromB, con)
  }
}
  
