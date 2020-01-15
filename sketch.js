let engine
let world
let translation
let ground
let walkers

// module aliases
let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Vector = Matter.Vector;

function setup() {
  createCanvas(1000, 600)
  l = new Limb({name: 'haha', len: 'bla'}, {name: 'b', len: 'a'})
  l.replicate(l, 0.1)

  engine = Engine.create()

  ground = new Ground(height+100)
  translation = createVector(0,0)

  walkers = new Population(10, 0.1, 0.1, 0.01, 150)

  Engine.run(engine)
}

function draw() {
  background(200,200,250)

  walkers.life++
  if (walkers.life == walkers.lifespan) {
    walkers.repopulate()
  }

  // walkers.add(random(width), random(height))

  push()
  translate(translation)
  
  ground.show()
  walkers.show()

  pop()
}





function mouseClicked() {
  walkers.add(mouseX, mouseY)
  walkers.evaluate()
}
