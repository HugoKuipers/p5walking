class Population {
  constructor(size) {
    this.size = size
    this.walkers = []
    for (let i = 0; i < size; i++) {
      this.walkers.push(new Walker(random(width), random(height), 50))
    }
  }

  show() {
    for (let w of this.walkers) {
      w.show()
    }
  }

  add(x = random(width), y = random(height)) {
    this.walkers.push(new Walker(x, y, 50))
  }
}
  
