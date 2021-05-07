import slugify from "slugify";

console.log(
  slugify("foTTball*sport     adfasdf", {
    lower: true,
    strict: true,
  })
);

// import express from "express";
// import fs, { readFileSync } from "fs";

// const app = express();

// app.get("/", (req, res) => {
//   const rawData = fs.readFileSync("./data-remaster.json");
//   const data = JSON.parse(rawData);

//   Object.keys(data).forEach((key) => {
//     data[key].forEach((entry) => {
//       const newOptions = [];
//       entry.options.forEach((option) => {
//         newOptions.push({
//           text: option.test,
//           _id: option._id,
//         });
//       });
//       entry.options = newOptions;
//     });
//   });

//   const newData = JSON.stringify(data);
//   fs.writeFileSync("./data-remaster-v2.json", newData, "utf8");
//   res.end();
// });

// app.listen(3000, () => console.log("server up"));
