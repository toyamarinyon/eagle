type inferA<T> = T extends (infer U)[] ? U : never;

const a = [1, 2, 4];
type typeA = inferA<typeof a>;
const b = "a";
type typeB = inferA<typeof b>;

class S<T> {
  private s: T;
  constructor(s: T) {
    this.s = s;
  }
}

type inferS<T> = T extends S<infer U> ? U : never;
const s = new S(1);
type typeS = inferS<typeof s>;
