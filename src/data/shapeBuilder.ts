import { RecordShape, RecordShapeConfig } from "./recordMatcher";

export interface ShapeBuilder {
  like(RecordShapeConfig): RecordShape;
}

class RecordBuilder implements ShapeBuilder {
  like(shape: RecordShapeConfig) {
    return new RecordShape(shape);
  }
}

export class TypedRecordBuilder implements ShapeBuilder {
  constructor(private readonly objType: string) {}

  like(shape: RecordShapeConfig) {
    return new RecordBuilder().like({ type: this.objType, ...shape });
  }
}
