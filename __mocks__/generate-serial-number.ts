interface serialGenerator {
  generate: (count: number) => string;
}

const generator: serialGenerator = jest.genMockFromModule(
  'generate-serial-number'
);

const serials: string[] = ['1234', '5225', '2512', '1232', '12039', '1259105'];

function _randomArrayElement(arr: string[]): string {
  const ind: number = Math.floor(Math.random() * arr.length);
  return arr[ind];
}

function generate(count: number): string {
  return _randomArrayElement(serials);
}

generator.generate = generate;

module.exports = generator;
