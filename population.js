class Population {
  constructor(size, mutCha, newMutCha = mutCha, remMutCha = newMutCha, lifespan = 1000) {
    this.startX = 250
    this.startY = 200
    this.radius = 40
    this.mutCha = mutCha
    this.newMutCha = newMutCha
    this.remMutCha = remMutCha
    this.size = size
    this.lifespan = lifespan
    this.life = 0
    this.walkers = []
    for (let i = 0; i < size; i++) {
      this.walkers.push(new Walker(this.startX, this.startY, this.radius, [], mutCha, newMutCha, remMutCha))
    }
  }

  show() {
    for (let w of this.walkers) {
      w.show()
    }
  }

  add(x = random(width), y = random(height)) {
    this.walkers.push(new Walker(x, y, 40, [], this.mutCha))
  }

  repopulate() {
    let newDna = []
    let fitSum = this.evaluate()

    for (let i = 0; i < this.size; i++) {
      let selectedWalker = this.selection(fitSum)
      newDna.push(selectedWalker.reproduce(selectedWalker))
    }

    print('newdna', newDna)
    for (let w of this.walkers) {
      w.killSelf()
    }
    this.walkers = []

    for (let n of newDna) {
      this.walkers.push(new Walker(this.startX, this.startY, this.radius, n, this.mutCha, this.newMutCha, this.remMutCha))
    }

    this.life = 0
  }

  evaluate() {
    let lowFit = 9999999
    let fitSum = 0

    for (let w of this.walkers) {
      w.fitness = w.body.position.x
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
}
  
