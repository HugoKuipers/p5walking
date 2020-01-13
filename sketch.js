let engine
let world
let translation
let ground
let walkers
let logOn

// module aliases
let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Vector = Matter.Vector;

function setup() {
  createCanvas(1300, 800)

  engine = Engine.create()

  ground = new Ground(height+100)
  translation = createVector(0,0)

  logOn = false
  // ground = Bodies.rectangle(400, height, width*2, 100, { isStatic: true })
  walkers = new Population(10)
  // World.add(engine.world, [ground])

  Engine.run(engine)
}

function draw() {
  background(200,200,250)
  push()
  translate(translation)
  

  // if (logOn) {
  //   console.log(ground)
  // }
  walkers.show()

  ground.show()
  walkers.show()

  pop()
}





function mouseClicked() {
  walkers.add(mouseX, mouseY)
  logOn = !logOn
}
