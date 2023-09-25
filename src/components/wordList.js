import React, { useState, useEffect } from 'react';
import 'lazysizes';
// import a plugin
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

async function generateWords() {
  // Colors
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Orange",
    "Purple",
    "Pink",
    "Brown",
    "Black",
    "White",
    "Gray",
    "Gold",
    "Silver",
    "Turquoise",
    "Indigo",
  ];

  // Shapes
  const shapes = [
    "Circle",
    "Square",
    "Triangle",
    "Rectangle",
    "Pentagon",
    "Hexagon",
    "Octagon",
    "Oval",
    "Diamond",
    "Sphere",
    "Cube",
    "Cylinder",
    "Cone",
    "Pyramid",
    "Star",
    "Heart",
  ];

  // Adjectives for Size
  const sizeAdjectives = [
    "Tiny",
    "Small",
    "Miniature",
    "Compact",
    "Little",
    "Medium-sized",
    "Large",
    "Big",
    "Massive",
    "Enormous",
  ];

  // Combined array
  const allWords = [...colors, ...shapes, ...sizeAdjectives];

  let result = [];

  while (result.length < 8) {
    let adjective = allWords[Math.floor(Math.random() * allWords.length)];

    try {
      // Use the Datamuse API to get a random English noun that is often described by the adjective
      let response = await fetch(`https://api.datamuse.com/words?rel_jja=${adjective}`);
      let data = await response.json();
      console.log(data);
      // Pick a random word from the list and assign it to the english variable
      let english = data[Math.floor(Math.random() * data.length)].word;

      // Use a translation API to get the German translation of the word
      response = await fetch(`https://api.mymemory.translated.net/get?q=${english}&langpair=en|de`);
      data = await response.json();
      let german = data.responseData.translatedText;

      // Check if English and German words are the same, and skip this iteration if they are
      if (english === german) {
        continue; // Retry generating a new word
      }

      // Use an image search API to get an image URL related to the word
      response = await fetch(`https://pixabay.com/api/?key=39663658-0cb372c25caa8ebb261c7c1e8&q=${english}&image_type=photo`);
      data = await response.json();
      if (data.hits.length === 0) {
        throw new Error("No image found"); // Throw an error if no image is found
      }
      let randomIndex = Math.floor(Math.random() * data.hits.length);
      let picUrl = data.hits[randomIndex].webformatURL;

      // Add the word object to the result array
      result.push({ picUrl, english, german });
    } catch (error) {
      console.error(error);
      continue; // Retry generating a new word on error
    }
  }

  return result;
}




function WordList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateWords().then((randomWords) => {
      console.log(randomWords)
      setWords(randomWords);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {words.map((word, index) => (
            <li key={index}>
              <img src={word.picUrl} alt={word.english}  />
              <p>
                {word.english} - {word.german}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WordList;
