class Limb {
  constructor(chromA, chromB, con) {
    this.chromA = chromA
    this.chromB = chromB
    this.con = con
    this.chromR = {}
    for (let gen in chromA) {
      this.chromR[gen] = (chromA[gen] + chromB[gen]) / 2
    }
  }

  show() {
    
  }

  replicate(other, mutCha) {
    let mine = (random(2) > 1) ? this.chromB : this.chromA
    let theirs = (random(2) > 1) ? other.chromB : other.chromA

    for (let gen in mine) {
      if (random() < mutCha) {
        mine[gen] = random()
      }
      if (random() < mutCha) {
        theirs[gen] = random()
      }
    }

    let con = (random(2) > 1) ? this.con : other.con

    return new Limb(mine, theirs, con)
  }
}
  
