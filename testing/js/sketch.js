import * as _ from "../lib/matter.js";

import Entity from "./entity.js";

const DEBUG_MODE = true;

const width = window.innerWidth;
const height = window.innerHeight;
// module aliases
const {
  Engine,
  Render,
  World,
  Bodies,
  Runner,
  Body,
  Composites,
  Composite,
  Constraint,
  Mouse,
  MouseConstraint,
  Events
} = Matter;

// create an engine
const engine = Engine.create();

// create a runner
const runner = Runner.create();

// create a renderer
const render = Render.create({
  element: document.body,
  engine,
  options: {
    width,
    height,
    showAngleIndicator: DEBUG_MODE,
    showCollisions: DEBUG_MODE,
    showVelocity: DEBUG_MODE
    // wireframes: DEBUG_MODE
    // showAxes: DEBUG_MODE,
    // showConvexHulls: DEBUG_MODE
  }
});

// add bodies
// const group = Body.nextGroup(true);

// const ropeA = Composites.stack(100, 50, 10, 1, 10, 10, function(x, y) {
//     return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
// });

// Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
// Composite.add(ropeA, Constraint.create({
//     bodyB: ropeA.bodies[0],
//     pointB: { x: -25, y: 0 },
//     pointA: { x: ropeA.bodies[0].position.x, y: ropeA.bodies[0].position.y },
//     stiffness: 0.5
// }));

// create two boxes and a ground
// const boxA = Bodies.rectangle(400, 200, 80, 80);
// boxA.label = "boxie";
// const boxB = Bodies.rectangle(450, 50, 80, 80);
const ground = Bodies.rectangle(width / 2, height, width, 60, {
  isStatic: true
});

// add all of the bodies to the world
const entity = new Entity(200, 200, 200);
World.add(engine.world, [ground, entity.body]);

const collidingEntities = [];

// add events
Events.on(engine, "collisionStart", event => {
  for (const pair of event.pairs) {
    // TODO :: what's bodyA and what's bodyB? Always top bottom?
    if (pair.bodyA.label == "entity") {
      console.log('A')
      collidingEntities.push(pair.bodyA.self);
    }
    if (pair.bodyB.label == "entity") {
      console.log('B')
      collidingEntities.push(pair.bodyB.self);
    }
  }
});

Events.on(engine, "beforeUpdate", () => {
  for (const entity of collidingEntities) {
    entity.jump();
  }
  collidingEntities.length = 0;
});

// add mouse control
// var mouse = Mouse.create(render.canvas),
//   mouseConstraint = MouseConstraint.create(engine, {
//     mouse,
//     constraint: {
//       stiffness: 0.2,
//       render: {
//         visible: false
//       }
//     }
//   });

// World.add(engine.world, mouseConstraint);

// // keep the mouse in sync with rendering
// render.mouse = mouse;

// run the engine
// Engine.run(engine);
Runner.run(runner, engine);

// run the renderer
Render.run(render);
