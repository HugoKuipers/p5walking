class Walker {
  constructor(x, y, r, limbs, mutCha, newMutCha = mutCha, remMutCha = newMutCha) {
    this.filter = -5
    this.mutCha = mutCha
    this.newMutCha = newMutCha
    this.remMutCha = remMutCha
    this.maxFeetSize = 40
    this.x = x
    this.y = y
    this.radius = r
    this.limbs = limbs
    this.col = color(random(255), random(255), random(255), 50)
    this.fitness = 0
    this.limbBodies = []
    this.limbConsts = []

    this.body = Bodies.circle(this.x, this.y, this.radius, { collisionFilter: { group: this.filter }})
    World.add(engine.world, this.body)
    print(this.body)

    for (l of this.limbs) {
      let footDir = (l.chromR.dir * TWO_PI) * (l.chromR.len * this.radius)
      let footLoc = createVector(cos(footDir), sin(footDir))
      let limbBody = Bodies.rectangle(this.x + footLoc.x, this.y + footLoc.y, l.chromR.footSize * this.maxFeetSize, l.chromR.footSize * this.maxFeetSize)
      this.limbBodies.push(limbBody)
      World.add(engine.world, limbBody)
      print(limbBody)
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
      chrom.dir = random()
      chrom.footSize = random()
      chrom.force = random()
    }

    let con = floor(random(limbCount))

    return new Limb(chromA, chromB, con)
  }
}
  
