console.log("hello world")
const helloMessage = "hello user"
let currentMessage = "miejsce na wiadomosc"


//const messageDiv = document.getElementById("message")
const messageDiv = document.querySelector("#message")
//messageDiv.innerHTML = helloMessage
//messageDiv.innerHTML = helloMessage

// URL endpointa
const url = '/events';

// Dane, które mają być wysłane w zapytaniu
const data = {
  description: "Opis wydarzenia", // Zamień to na właściwy opis
  // desc brany z inputu
};

// Wysyłanie zapytania POST za pomocą fetch
fetch("http://localhost:8080/frontend/events", {
  method: 'POST', // Metoda HTTP
  headers: {
    'Content-Type': 'application/json', // Typ treści JSON
  },
  body: JSON.stringify(data), // Konwersja obiektu do formatu JSON
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parsowanie odpowiedzi jako JSON
  })
  .then(data => {
    messageDiv.innerHTML = "Event sent correctly"
    console.log('Success:', data); // Przetwarzanie odpowiedzi
  })
  .catch(error => {
    console.error('Error:', error); // Obsługa błędów
  });

//zapakowac do funkcji i podpiac pod przycisk

const searchBar = document.querySelector('.search-bar')
searchBar.addEventListener('mouseenter', () => {
  searchBar.placeholder = 'Start typing...';
});

searchBar.addEventListener('mouseleave', ()=> {
  searchBar.placeholder = 'Search here...';
})



