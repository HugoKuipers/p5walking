let engine
let world
let stop = false
let enviroment

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
  enviroment = new Enviroment([[20, 0.2, 0.1, 0.3], [20, 0.2, 0.3, 0.3, 500]], [height + 100, 100, 50, 0, 1], 1000)

  Engine.run(engine)
}

function draw() {
  if (stop) {
    noLoop()
  }
  
  background(230,230,255)

  enviroment.update()
  enviroment.show()
}

function mouseClicked() {
  if (stop) {
    loop()
  }
  stop = !stop
}

function mouseDragged() {}

function keyPressed() {
  if (keyCode == 83) {
    enviroment.saveDNA()
  }

  if (keyCode == 87) {
    print(localStorage.getItem('clonedDNA'))
    enviroment.repopulateWithClone(JSON.parse(localStorage.getItem('clonedDNA')))
  }
}
