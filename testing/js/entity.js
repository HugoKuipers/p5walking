const { Bodies, Body } = Matter;

export default class Entity {
  constructor(spawnX, spawnY, size) {
    this._spawnX = spawnX;
    this._spawnY = spawnY;
    this._width = size;
    this._height = size / 4;

    this._body
  }

  get body() {
      if(!this._body) {
          const mainBody = Bodies.rectangle(
            this._spawnX,
            this._spawnY,
            this._width,
            this._height
          );
          mainBody.label = 'entity'
          mainBody.self = this
      
          const limb = Bodies.rectangle(
            this._spawnX,
            this.lowestBodyPoint,
            this._width / 5,
            this.limbHeight,
            { render: mainBody.render }
          );
          limb.label = 'entity'
          limb.self = this
      
          this._body = Body.create({
            parts: [mainBody, limb],
          });
      }
      return this._body
  }

  get lowestBodyPoint() {
    return this._spawnY + this._height / 2 + this.limbHeight / 2;
  }

  get limbHeight() {
    return this._height;
  }

  jump() {
    Body.applyForce(this._body, this._body.position, {
        x: 0,
        y: -0.5
    })
  }
}
