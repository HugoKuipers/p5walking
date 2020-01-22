import * as _ from "../lib/matter.js";

import Entity from "./entity.js";
import { DEBUG_MODE } from "./settings.js";

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

class Universe {
  /**
   * The Big Bang of the universe
   *
   */
  constructor() {
    /**
     * the entities that will do something the next update of the engine
     * @type {Entity[]}
     * @private
     */
    this._entitiesThatWillDoSomething = [];

    /**
     * _width is the width of the universe
     * @type {Number}
     * @private
     */
    this._width = window.innerWidth;
    /**
     * _height is the height of the universe
     * @type {Number}
     * @private
     */
    this._height = window.innerHeight;

    this._universe = World;
    this._engine = Engine.create();
    this._runner = Runner.create();
    this._render = Render.create({
      element: document.body,
      engine: this._engine,
      options: {
        width: this._width,
        height: this._height,
        showAngleIndicator: DEBUG_MODE,
        showCollisions: DEBUG_MODE,
        showVelocity: DEBUG_MODE
        // wireframes: DEBUG_MODE
        // showAxes: DEBUG_MODE,
        // showConvexHulls: DEBUG_MODE
      }
    });

    this.bang();
  }

  get width() {
    if (this._width === window.innerWidth) return this._width;
    this._width = window.innerWidth;
    // TODO :: need to call resize function here or will it go automatically?
    return this._width;
  }

  get height() {
    if (this._height === window.innerHeight) return this._height;
    this._height = window.innerHeight;
    // TODO :: need to call resize function here or will it go automatically?
    return this._height;
  }

  /**
   * Cause every universe needs ground
   */
  get ground() {
    return Bodies.rectangle(this.width / 2, this.height, this.width, 60, {
      isStatic: true
    });
  }

  get matter() {
    const entity = new Entity(200, 200, 200);
    return [this.ground, entity.body];
  }

  bang() {
    this._universe.add(this._engine.world, this.matter);

    Events.on(this._engine, "collisionStart", event =>
      this.checkCollision(event)
    );

    Events.on(this._engine, "beforeUpdate", event => this.updateEngine(event));
    Runner.run(this._runner, this._engine);
    Render.run(this._render);
  }

  updateEngine(event) {
    for (const entity of this._entitiesThatWillDoSomething) {
      entity.doSomething();
      
      if(entity.dead) this.circleOfLife(entity)
    }
    this._entitiesThatWillDoSomething.length = 0;
  }

  /**
   * It's the circle of life
   * 
   * From ashes to ashes, from dust to dust
   * An entity will rise again, in this I'll trust
   * 
   * @param {Entity} entity 
   */
  circleOfLife(entity) {
    this._universe.remove(this._engine.world, entity.body)

    const child = entity.reproduce()
    this._universe.add(this._engine.world, child.body)
  }

  checkCollision(event) {
    for (const pair of event.pairs) {
      // TODO :: what's bodyA and what's bodyB? Always top bottom?
      if (pair.bodyA.label == "entity") {
        console.log("A");
        this._entitiesThatWillDoSomething.push(pair.bodyA.self);
      }
      if (pair.bodyB.label == "entity") {
        console.log("B");
        this._entitiesThatWillDoSomething.push(pair.bodyB.self);
      }
    }
  }
}

new Universe();
