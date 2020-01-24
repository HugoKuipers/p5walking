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

  replicate(other, mutCha) {
    let mine = (random(2) > 1) ? this.chromB : this.chromA
    let theirs = (random(2) > 1) ? other.chromB : other.chromA
    let newA = {}
    let newB = {}

    for (let gen in mine) {
      if (random() < mutCha) {
        newA[gen] = random()
      }
      if (random() < mutCha) {
        newB[gen] = random()
      }
    }

    let con = (random(2) > 1) ? this.con : other.con

    return new Limb(mine, theirs, con)
  }
}
