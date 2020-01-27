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

  engine = Engine.create()
  ground = new Ground(height+100)
  translation = createVector(0,0)
  // walkers = new Population(100, 0.01, 0.05, 0.01, 400)
  walkers = new Population(100, 0.01, 0.05, 0.25, 200)
  walkersBeta = new Population(1, 0.01, 0.01, 0.02, 200, 550)
  walkersGamma = new Population(1, 0.3, 0.3, 0.7, 200, 800)
  // walkers = new Population(1, 0.001, 1, 0.001, 200)

  Engine.run(engine)
}

function draw() {
  if (stop) noLoop()
  background(200,200,250)

  walkers.life++
  if (walkers.life == walkers.lifespan) {
    walkers.repopulate()
  }

  walkersBeta.life++
  if (walkersBeta.life == walkersBeta.lifespan) {
    walkersBeta.repopulate()
  }

  walkersGamma.life++
  if (walkersGamma.life == walkersGamma.lifespan) {
    walkersGamma.repopulate()
  }

  push()
  translate(translation)

  // for (let i of walkers.walkers) {
  //   Body.applyForce(i.body, i.body.position, {
  //     x: 0.003,
  //     y: 0
  //   })
  // }
  
  ground.show()
  walkers.show()
  walkersBeta.show()
  walkersGamma.show()

  pop()
}





function mouseClicked() {
  if (stop) {
    loop()
  }
  stop = !stop
  console.log(stop)
  // print(walkers.walkers[0].body)
  // Body.applyForce(walkers.walkers[0].body, walkers.walkers[0].body.position, {
  //   x: 0.1,
  //   y: 0
  // })
  // walkers.add(mouseX, mouseY)
  // walkers.evaluate()
}

function mouseDragged() {
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
