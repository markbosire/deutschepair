import { useEffect, useState, useRef } from "react";

import Card from "./card";

import { useLocation } from "wouter";



import "./app.css";

import axios from "axios";

// A function that takes an API key and an API secret as parameters and returns an object with a picture and a tag
async function PictureAndLabelList() {
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


// Example usage
// Replace the API key and the API secret with your own
var apiKey = "acc_f70a78ea6c33d0c";
var apiSecret =  "bcb1d48c1c3cf7f2c72ba5317fa556f9";
// Call the function with the API key and the API secret and log the result to the console





function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}
export default function Home() {

  const [inputArray,setInputArray]=useState([])
  let uniqueElementsArray=[]
 let uniqueElementsArray2=[]
 
const[loading,setLoading]=useState(false)
 
  
  
  const [cards, setCards] = useState([]);
  const [openCards, setOpenCards] = useState([]);
 

  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueElementsArray2.length) {
      if(uniqueElementsArray2.length>0){
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore);
      }
    }
  };
  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].id === cards[second].id) {
      setClearedCards((prev) => ({ ...prev, [cards[first].id]: true }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };
  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };
  function getObjectWithId(data,index) {
    console.log(data)
    let returnArray=[];
    for (let i = 0; i < data.length; i++) {
      console.log(data[i])
      console.log(index)
      if (data[i].id == index) {
        returnArray.push(data[i]);
      }
    }
   
    return returnArray;
  }
  useEffect(() => {
    PictureAndLabelList(apiKey, apiSecret).then((result) => {
      setInputArray(result);
    });
  }, [apiKey, apiSecret]); // Only fetch data when apiKey or apiSecret change
  
  useEffect(() => {
    if (inputArray.length > 0) {

     
      // Initialize arrays for unique elements
 
  
  
      inputArray.forEach((item, index) => {
        
        // Combine tags into a single string
     
       
        // Add to uniqueElementsArray
        uniqueElementsArray.push({
          id: index + 1,
          text: item.german,
          en: item.english,
          type: "text"
        });
  
        // Add to uniqueElementsArray2
        uniqueElementsArray2.push({
          id: index + 1,
          text: item.picUrl,
          type: "image"
        });
          
      });
  
      // Perform any other actions you need here
      const shuffledCards = shuffleCards(uniqueElementsArray.concat(uniqueElementsArray2));
      setCards(shuffledCards);
    }
  }, [inputArray]);
  
  // Use a separate useEffect to handle actions that depend on cards
  useEffect(() => {
    console.log(cards); // Now cards will be updated when this useEffect runs
    if (cards.length === 16) {
      setLoading(true);
    }
  }, [cards]);
  

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);

  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.id]);
  };
  const [location, navigate] = useLocation();

  const handleRestart = () => {
    window.location.reload();
    };
 
 
 function renderClearedCards() {
  const clearedCardIndexes = Object.keys(clearedCards);
  console.log(clearedCardIndexes)

  // Filter inputArray to get the cleared card data based on indexes

 
  const clearedCardData = clearedCardIndexes.map((id) => getObjectWithId(cards,id));



  // Render cleared cards
  const renderedCards = [];

  for (let i = 0; i < clearedCardData.length; i++) {
    clearedCardData[i].forEach((card, index) => {
      renderedCards.push(
        <div key={index} className="cleared-card">
          {card.type === "image" && <div className={i%2===0?"even":"odd"}><img src={card.text} alt="Cleared Card" /></div>}
          <div className={i%2===0?"even":"odd"}>
            {card.type === "text" && (
              <div>
                <p>English: {card.en}</p>
                <p>German: {card.text}</p>
              </div>
            )}
          </div>
        </div>
      );
    });
  }
  
  return renderedCards}


  return (
    loading?  <div className="App">
      
      <header>
     
        
        <h3>Hi there</h3>
        <div className="catchphrase">
        <h4>Match the item to its classification</h4>
        </div>
      </header>
      <div className="container">{
      
      cards.map((card, index) => {
          return (
            <Card
              key={index}
              card={card}
              index={index}
              isDisabled={shouldDisableAllCards}
              isInactive={checkIsInactive(card)}
              isFlipped={checkIsFlipped(index)}
              onClick={handleCardClick}
            />
          );
        })}
      </div>
      <footer>
        <div className="score">
          <div className="moves">
            <span className="bold">Moves:</span> {moves}
          </div>
          {localStorage.getItem("bestScore") && (
            <div className="high-score">
              <span className="bold">Best Score:</span> {bestScore}
            </div>
          )}
        </div>
        <div className="restart">
          <div onClick={handleRestart} className="startBtn">
            Restart
          </div>
        </div>
        <div className="cleared-cards-container">
  {Object.keys(clearedCards).length > 0 && (
    <>
      <h2>Cleared Cards</h2>
      <div className="cleared-cards">{renderClearedCards()}</div>
    </>
  )}
</div>

      </footer>
 
    </div>:<div className="landingPage"><img src="https://s11.gifyu.com/images/S4CQB.gif" className="loading" alt=""></img></div>
  );
}
