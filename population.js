class Population {
  constructor(size, mutCha, newMutCha = mutCha, remMutCha = newMutCha, lifespan = 1000, startX = 300, startY = 300) {
    this.startX = startX
    this.startY = startY
    this.radius = 40
    this.mutCha = mutCha
    this.newMutCha = newMutCha
    this.remMutCha = remMutCha
    this.size = size
    this.lifespan = lifespan
    this.life = 0
    this.walkers = []
    this.currentBest = undefined
    for (let i = 0; i < size; i++) {
      this.walkers.push(new Walker(this.startX, this.startY, this.radius, [], mutCha, newMutCha, remMutCha))
    }
    this.power = 0
  }

  show() {
    let verste = 0
    for (let w of this.walkers) {
      if (w.body.position.x > verste) {
        verste = w.body.position.x
        this.currentBest = w
      }
      w.show()
    }

    this.currentBest.show(true)
    return verste
  }

  add(x = random(width), y = random(height)) {
    this.walkers.push(new Walker(x, y, this.radius, [], this.mutCha))
  }

  applyForce() {
    for (let w of this.walkers) {
      w.contract(this.life)
    }
  }

  repopulate() {
    let newDna = []
    let fitSum = this.evaluate()

    for (let i = 0; i < this.size; i++) {
      let selectedWalkerA = this.selection(fitSum)
      let selectedWalkerB = this.selection(fitSum)
      newDna.push(selectedWalkerA.reproduce(selectedWalkerB))
    }

    // print('newdna', newDna)
    for (let w of this.walkers) {
      w.killSelf()
    }

    this.walkers = []

    for (let n of newDna) {
      this.walkers.push(new Walker(this.startX, this.startY, this.radius, n, this.mutCha, this.newMutCha, this.remMutCha))
    }

    this.life = 0
  }

  repopulateWithClone(clonedDNA) {
    for (let w of this.walkers) {
      w.killSelf()
    }

    this.walkers = []

    for (let n of clonedDNA) {
      print(n)
      this.walkers.push(new Walker(this.startX, this.startY, this.radius, n, this.mutCha, this.newMutCha, this.remMutCha))
    }

    this.life = 0
  }

  evaluate() {
    let lowFit = 9999999
    let fitSum = 0

    for (let w of this.walkers) {
      w.fitness = w.body.position.x + (height - w.body.position.y)
      if (w.fitness < lowFit) lowFit = w.fitness
    }

    for (let w of this.walkers) {
      w.fitness -= lowFit
      w.fitness *= w.fitness
      fitSum += w.fitness
    }

    return fitSum
  }

  selection(sum) {
    if (sum == 0) return this.walkers[floor(random(this.walkers.length))]

    let r = random(sum)
    let i = -1
    while (r > 0) {
      i++
      r -= this.walkers[i].fitness
    }

    return this.walkers[i]
  }

  saveDNA() {
    let cloned = []
    for (const w of this.walkers) {
      cloned.push(w.limbs)
    }
    localStorage.setItem('clonedDNA', JSON.stringify(cloned))
  }
}
  
