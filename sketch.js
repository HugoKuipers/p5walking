let engine
let world
let translation
let ground
let walkers
let boxes
let logOn

// module aliases
let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

function setup() {
  createCanvas(1300, 800)

  engine = Engine.create()

  // ground = new Ground(width*2, height+100)
  translation = createVector(0,0)

  boxes = []
  logOn = false
  ground = Bodies.rectangle(400, height, width*2, 100, { isStatic: true })
  walkers = new Population(10)
  World.add(engine.world, [ground])

  Engine.run(engine)
}

function draw() {
  background(200,200,250)
  push()
  translate(translation)
  
  rectMode(CENTER)
  fill(50)
  rect(ground.position.x, ground.position.y, width*2, 100)
  // for (let b of boxes) {
  //   ellipse(b.position.x, b.position.y, 160)
  // }
  if (logOn) {
    console.log(ground)
  }
  walkers.show()

  // ground.show()

  pop()
}





function mouseClicked() {
  walkers.add(mouseX, mouseY)
  logOn = !logOn
}
