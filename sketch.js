let game
let engine
let translation

// module aliases
let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

function setup() {
  createCanvas(1200, 800)

  engine = Engine.create()

  ground = new Ground(width*2, height+100)
  translation = createVector(0,0)

  var boxA = Bodies.rectangle(400, 200, 80, 80)
  var boxB = Bodies.rectangle(450, 50, 80, 80)
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
  World.add(engine.world, [boxA, boxB, ground]);

  Engine.run(engine);
}

function draw() {
  background(200,200,250)

  // ground.show(translation)
}





function mouseClicked() {}