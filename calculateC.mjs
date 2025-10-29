import fs from "fs/promises";

function decodeValue(base, value) {
  return BigInt(parseInt(value, base));
}

// Lagrange interpolation to find constant term C
function findConstantTerm(points) {
  const k = points.length;
  let C = 0n;

  for (let i = 0; i < k; i++) {
    const { x: xi, y: yi } = points[i];

    let num = 1n; 
    let den = 1n; 

    for (let j = 0; j < k; j++) {
      if (i !== j) {
        const xj = points[j].x;
        num *= BigInt(-xj);
        den *= BigInt(xi - xj);
      }
    }

    const Li0 = num / den; 
    C += yi * Li0;
  }

  return C;
}

async function main() {
  try {
   
    const data = await fs.readFile("./testcase1.json", "utf8");
    const json = JSON.parse(data);

    const { n, k } = json.keys;

    
    const points = Object.entries(json)
      .filter(([key]) => !isNaN(key)) 
      .map(([key, val]) => ({
        x: parseInt(key),
        y: decodeValue(val.base, val.value)
      }))
      .slice(0, k);

    console.log("Decoded Points:", points);

    const constant = findConstantTerm(points);
    console.log("\nConstant term (C):", constant.toString());
  } catch (err) {
    console.error("Error:", err);
  }
}

main();