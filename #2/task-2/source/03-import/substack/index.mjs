const info = msg => {
  console.log(`Info: ${msg}`);
};

info.log = msg => {
  console.log(`Log: ${msg}`);
};

export default info;
