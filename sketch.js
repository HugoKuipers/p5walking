let engine
let world
let translation
let ground
let walkers
let stop = false

// module aliases
let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Constraint = Matter.Constraint,
  Vector = Matter.Vector;

function setup() {
  createCanvas(1000, 600)
  l = new Limb({name: 'haha', len: 'bla'}, {name: 'b', len: 'a'})
  l.replicate(l, 0.1)

  engine = Engine.create()

  ground = new Ground(height+100)
  translation = createVector(0,0)

  walkers = new Population(100, 0.01, 0.05, 0.01, 400)

  Engine.run(engine)
}

function draw() {
  if (stop) noLoop()
  background(200,200,250)

  for (let i of walkers.walkers) {
    Body.applyForce(i.body, i.body.position, {
      x: 0.003,
      y: 0
    })
  }

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
  // stop = true
  // print(walkers.walkers[0].body)
  // Body.applyForce(walkers.walkers[0].body, walkers.walkers[0].body.position, {
  //   x: 0.1,
  //   y: 0
  // })
  // walkers.add(mouseX, mouseY)
  // walkers.evaluate()
}

function mouseDragged() {
  // stop = true
  // print(walkers.walkers[0].body)
  // for (let i of walkers.walkers) {
  //   Body.applyForce(i.body, i.body.position, {
  //     x: 0.01,
  //     y: 0
  //   })
  // }
  // walkers.add(mouseX, mouseY)
  // walkers.evaluate()
}
