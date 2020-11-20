module.exports = {
  clearMocks: true,
  maxWorkers: 1,
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src/__tests__"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/src/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js)?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
