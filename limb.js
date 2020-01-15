class Limb {
  constructor(chromA, chromB) {
    this.chromA = chromA
    this.chromB = chromB
    this.chromR = {}
    for (let gen in chromA) {
      this.chromR[gen] = (chromA[gen] + chromB[gen]) / 2
    }
  }

  show() {
    
  }

  replicate(other, mutCha) {
    let mine = (random(2) > 1) ? this.chromaB : this.chromA
    let theirs = (random(2) > 1) ? other.chromaB : this.chromA

    for (let gen in mine) {
      if (random() < mutCha) {
        mine[gen] = random()
      }
      if (random() < mutCha) {
        theirs[gen] = random()
      }
    }

    return new Limb(mine, theirs)
  }
}
  
