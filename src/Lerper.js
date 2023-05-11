import { lerp } from "three/src/math/MathUtils";

function Lerper(num, num2, raise) {
  const ret = [num];
  for (let i = 1; i < raise; i++) {
    ret.push(lerp(num, num2, Math.pow(i / raise, 1)));
  }
  ret.push(num2);
  return ret;
}

export default Lerper;
