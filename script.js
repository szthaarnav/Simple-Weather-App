// console.log("asd");
async function getData() {
  const url = "https://nominatim.openstreetmap.org/search?q=dharan,nepal&format=jsonv2";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}
getData();