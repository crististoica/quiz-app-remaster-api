const arr = [{ name: "UNU" }, { name: "DOI" }];

function addEmail(arr) {
  arr[0] = { surname: " DOUZEZCI" };
  arr.forEach((entry) => (entry.email = "new_EMAIL"));
}
console.log(arr);

addEmail(arr);

console.log(arr);
