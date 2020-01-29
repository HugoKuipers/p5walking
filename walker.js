class Walker {
  constructor(x, y, r, limbs, mutCha, newMutCha = mutCha, remMutCha = newMutCha) {
    this.filter = -5
    this.mutCha = mutCha
    this.newMutCha = newMutCha
    this.remMutCha = remMutCha
    this.maxLimbLen = 120
    this.halfLimbLen = this.maxLimbLen / 2
    this.maxLimbWidth = 40
    this.halfLimbWidth = this.maxLimbWidth / 2
    this.constsPerLimb = 4
    this.maxContraction = 0.03
    this.friction = 0.1
    this.x = x
    this.y = y
    this.radius = r
    this.limbDistFromCenter = this.radius / 1.5
    this.limbs = limbs
    this.r = random(255)
    this.g = random(255)
    this.b = random(255)
    this.fitness = 0
    this.limbBodies = []
    this.limbConsts = []

    // this.body = Bodies.circle(this.x, this.y, this.radius, { friction: this.friction, collisionFilter: { group: this.filter }})
    this.body = Bodies.rectangle(this.x, this.y, this.radius*2, this.radius*2, { friction: this.friction, collisionFilter: { group: this.filter }})
    World.add(engine.world, this.body)

    // print(this.body)

    for (let l of this.limbs) {
      const chromosome = l.chromR
      const parent = l.con == 0 ? this.body : this.limbBodies[l.con-1]

      let footDir = (chromosome.dir * TWO_PI)
      let footLoc = createVector(cos(footDir), sin(footDir))
      let parentOffset
      let parentOffset2
      let parentCorner
      footLoc.mult(chromosome.len * this.halfLimbLen)
      if (l.con == 0) {
        parentOffset = createVector(cos(footDir), sin(footDir))
        parentOffset.mult(this.limbDistFromCenter)
        let footDir2 = (chromosome.dir * TWO_PI) - (0.5 * PI)
        parentCorner = createVector(cos(footDir2), sin(footDir2))
        parentCorner.mult(chromosome.width * this.halfLimbWidth)
        parentOffset2 = createVector(0,0)
      } else {
        const parentChrom = this.limbs[l.con-1].chromR
        parentOffset = createVector(cos(parent.angle), sin(parent.angle))
        parentOffset.mult(parentChrom.len * this.halfLimbLen)
        parentOffset2 = parentOffset.copy()
        parentOffset2.mult(-1)
        let parentDir2 = (parentChrom.dir * TWO_PI) - (0.5 * PI)
        parentCorner = createVector(cos(parentDir2), sin(parentDir2))
        parentCorner.mult(parentChrom.width * this.halfLimbWidth)
      }

      // create limbBody:
      let limbBody = Bodies.rectangle(parent.position.x + parentOffset.x, parent.position.y + parentOffset.y, chromosome.len * this.maxLimbLen, chromosome.width * this.maxLimbWidth, { friction: chromosome.friction, collisionFilter: { group: this.filter }})
      this.limbBodies.push(limbBody)
      Body.rotate(limbBody, footDir)
      Body.setPosition(limbBody, { x: limbBody.position.x + footLoc.x, y: limbBody.position.y + footLoc.y })
      World.add(engine.world, limbBody)

      // create vectors to corners:
      footLoc.setMag(chromosome.len * this.maxLimbLen * -0.5)
      let footDir2 = (chromosome.dir * TWO_PI) - (0.5 * PI)
      let footCorner = createVector(cos(footDir2), sin(footDir2))
      footCorner.mult(chromosome.width * this.maxLimbWidth * 0.5)

      // create Joints:
      this.addJoint(parent, limbBody, parentOffset, footLoc, chromosome, parentCorner, footCorner)
      parentCorner.mult(-1)
      this.addJoint(parent, limbBody, parentOffset2, footLoc, chromosome, parentCorner)
      footCorner.mult(-2)
      parentCorner.mult(2)
      this.addJoint(parent, limbBody, parentOffset, footLoc, chromosome, parentCorner, footCorner)
      parentCorner.mult(-1)
      this.addJoint(parent, limbBody, parentOffset2, footLoc, chromosome, parentCorner)
    }
  }

  jointOptions(parent, limbBody, jointPreviousBody, jointLeg, chromosome) {
    return {
      bodyA: parent,
      bodyB: limbBody,
      pointA: Vector.create(jointPreviousBody.x, jointPreviousBody.y),
      pointB: Vector.create(jointLeg.x, jointLeg.y),
      damping: 0.1,
      stiffness: chromosome.stiffness,
      angularStiffness: chromosome.stiffness
    }
  }

  addJoint(parent, limbBody, jointPreviousBody, jointLeg, chromosome, jointDeltaPrev, jointDeltaLeg) {
    if (jointDeltaLeg) jointLeg.add(jointDeltaLeg)
    if (jointDeltaPrev) jointPreviousBody.add(jointDeltaPrev)

    let joint = Constraint.create(this.jointOptions(parent, limbBody, jointPreviousBody, jointLeg, chromosome))
    joint.lengths = [joint.length]

    this.limbConsts.push(joint)
    World.add(engine.world, joint)
  }
  
  show(best = false) {
    push()
    fill(this.r, this.g, this.b, 50)
    if (best) {
      strokeWeight(2)
      fill(this.r, this.g, this.b, 250)
    }

    // ellipse(this.body.position.x, this.body.position.y, this.radius*2)
    beginShape()
    for (let v of this.body.vertices) {
      vertex(v.x, v.y)
    }
    endShape(CLOSE)

    for (let l of this.limbBodies) {      
      beginShape()
      for (let v of l.vertices) {
        vertex(v.x, v.y)
      }
      endShape(CLOSE)
    }

    // for (let l of this.limbConsts) {
    //   line(l.bodyA.position.x + l.pointA.x, l.bodyA.position.y + l.pointA.y, l.bodyB.position.x + l.pointB.x, l.bodyB.position.y + l.pointB.y)
    // }
    pop()
  }

  applyForce() {
    for (let i = 0; i < this.limbs.length; i++) {
      const chromosome = this.limbs[i].chromR
      for (let j = 0; j < 2; j++) {
        let tg
        let cf
        if (j == 0) {
          tg = chromosome.targetConst1
          cf = chromosome.contractionForce1
        } else if (j == 1) {
          tg = chromosome.targetConst2
          cf = chromosome.contractionForce2
        // } else {
        //   tg = chromosome.targetConst3
        //   cf = chromosome.contractionForce3
        }
        let constraint = this.limbConsts[floor(4 * tg) + i * 4]
        let newLen = (1 - (cf * this.maxContraction)) * constraint.lengths[constraint.lengths.length-1]
        constraint.lengths.push(newLen)
        constraint.length = newLen
      }
    }
  }

  resetForce() {
    for (let i = 0; i < this.limbs.length; i++) {
      const chromosome = this.limbs[i].chromR
      for (let j = 0; j < 2; j++) {
        let tg
        if (j == 0) {
          tg = chromosome.targetConst1
        } else if (j == 1) {
          tg = chromosome.targetConst2
        // } else {
        //   tg = chromosome.targetConst3
        }
        let constraint = this.limbConsts[floor(4 * tg) + i * 4]
        constraint.length = constraint.lengths[constraint.lengths.length-2]
        constraint.lengths.splice(constraint.lengths.length-1, 1)
      }
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

    while (true) {
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
      } else {
        break
      }
    }

    while (newLimbs.length < 11) {
      if (random() < this.newMutCha) {
        newLimbs.push(this.newLimb(newLimbs.length))
      } else {
        break
      }
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
      chrom.stiffness = random()
      chrom.friction = 0.1
      chrom.targetConst1 = random()
      chrom.contractionForce1 = random()
      chrom.targetConst2 = random()
      chrom.contractionForce2 = random()
      // chrom.targetConst3 = random()
      // chrom.contractionForce3 = random()
    }

    let con = floor(random(limbCount+1))

    return new Limb(chromA, chromB, con)
  }
}
  
