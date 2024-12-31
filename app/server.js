async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function main() {
  for (let i = 0; i < 60; i = i + 1) {
    await sleep();
    console.log(`sleep: ${i}`);
  }
}

main();
