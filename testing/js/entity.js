const { Bodies, Body } = Matter;

export default class Entity {
  constructor(spawnX, spawnY, size) {
    this._spawnX = spawnX;
    this._spawnY = spawnY;
    this._size = size;

    this._jumps = 10;
    this._filterGroup = -5;

    this._body;
  }

  get body() {
    if (!this._body) {
      const mainBody = Bodies.rectangle(
        this._spawnX,
        this._spawnY,
        this.width,
        this.height
      );
      mainBody.label = "entity";
      mainBody.self = this;

      const limb = Bodies.rectangle(
        this._spawnX,
        this.lowestBodyPoint,
        this.width / 5,
        this.limbHeight,
        { render: mainBody.render }
      );
      limb.label = "entity";
      limb.self = this;

      this._body = Body.create({
        parts: [mainBody, limb],
        collisionFilter: { group: this._filterGroup }
      });
    }
    return this._body;
  }

  get lowestBodyPoint() {
    return this._spawnY + this.height / 2 + this.limbHeight / 2;
  }

  get width() {
    return this._size;
  }

  get height() {
    return this._size / 4;
  }

  get limbHeight() {
    return this.height;
  }

  get dead() {
    return !this._jumps;
  }

  get jumpHeight() {
    return -0.5;
  }

  doSomething() {
    Body.applyForce(this._body, this._body.position, {
      x: 0,
      y: this.jumpHeight
    });

    this._jumps -= 1;
  }

  reproduce() {
    return new Entity(
      this._spawnX + Math.random() * 10,
      this._spawnY + Math.random() * 10,
      this._size + Math.random() * 10
    );
  }
}
