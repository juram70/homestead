exports.year = function () {
    const date = new Date();
    let options = {
        year: "numeric",
    }
   return date.toLocaleDateString("en-US", options);
}