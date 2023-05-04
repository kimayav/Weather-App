console.log('client side javascipt file is loaded!');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();  

    const location = search.value;    

    messageOne.textContent = 'loading ...';       // to show the loading message till the fetch api fetches data
    messageTwo.textContent = '';        // to remove any previous content in the second paragraph

    fetch('/weather?address=' + location)
        .then((response) => {
            response.json()         // we parse the json which we get from the api
                .then((data) => {
                    if(data.error) {
                        messageOne.textContent = data.error;
                    } else {
                        messageOne.textContent = data.location;
                        messageTwo.textContent = data.forecast;
                    }
                });
        });
});