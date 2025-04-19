const { GeneratePassword } = require("generate-password-lite");

const password = GeneratePassword({
  length: 50,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  minLengthLowercase: 1,
  minLengthUppercase: 1,
  minLengthNumbers: 1,
  minLengthSymbols: 1,
});

console.log(password);
