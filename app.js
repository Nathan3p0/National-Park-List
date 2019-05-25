const key = 'bSPKpQe0FYymu7sEEEqMJqqKYVppyTHzev2rq5pI';
const searchURL = 'https://developer.nps.gov/api/v1/parks';
let selectedStates = [];

// Create function to format query string

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// Fetch Park Locations from National Park API

function getParkLocations(query, maxResults=10) {
    const params = {
        api_key: key,
        stateCode: query,
        fields: 'addresses,images',
        limit: maxResults
    };

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.statusText);
        })
        .then(response => {
            displayResults(response)
            displayNumResults(response)
        })
        .catch(err => {
            $('#searchResults').text(`Something went wrong: ${err.message}`);
        })
}

// Display results
//

function printImages(response) {
    if(response.images.length > 1) {
        return response.images[0].url;
    } else {
        return 'https://source.unsplash.com/500x300/?nature,water,trees';
    }
}


function displayResults(response) {
    for(let i = 0; i < response.data.length; i++){
        $('#searchResults').append(`
            <div>
                <img src="${printImages(response.data[i])}" class="crop "alt="state park picture">
                <h3>${response.data[i].fullName}</h3>
                <p class="p-heading">Park Description:</p>
                <p>${response.data[i].description}</p>
                <p class="p-heading">Visit Us At:</p>
                <address>
                <a href="${response.data[i].url}">${response.data[i].url}</a>
                </address>
            </div>
        `)
    }
}

function displayNumResults(response) {
    if(response.data.length < response.limit) {
        $('#limitResults').text(`${parseInt(response.total)}`);
        $('#totalResults').text(`${response.total}`);
    } else {
        $('#limitResults').text(`${parseInt(response.limit)}`);
        $('#totalResults').text(`${response.total}`);
    }
}


// Add event listener to select state button
// When clicked take value of option and push to array
// Check to see if array already contains value before adding again
// Display array to Currently Selected States
// Return array as state code query

function handleSelectStateButton() {
    $('#selectState').on('click', function(e) {
        const stateValue = $('#state').val();
        e.preventDefault();
        checkForDoubleInput(selectedStates, stateValue);
        renderStateSelection(selectedStates);
    })
}

function checkForDoubleInput(statesArray, stateVal){
    if (statesArray.indexOf(stateVal) > -1) {
        console.log('I\'m already in the array');
    } else {
        statesArray.push(stateVal);
    }
}

// Add event listener to form
// Prevent Default
// Take number selection and use as result argument
// Check to make sure a state is selected

function checkForStateSelection(statesArray, resultCount){
    if(statesArray.length > 0) {
        getParkLocations(statesArray, resultCount)
    } else {
        console.log('Please Select a state')
    }
}

function handleFormSubmit() {
    $('#parkSearch').submit(function(e){
        e.preventDefault();
        const resultCount = $('#quantity').val() - 1;
        checkForStateSelection(selectedStates, resultCount);
        resetSearch();
    })
}

function resetSearch() {
    selectedStates = [];
    $('#selectedStates').text('');
    $('#searchResults').empty();
}


function renderStateSelection(selectedStates) {
    $('#selectedStates').text(`${selectedStates.join(',')}`);
}

// Add function to initialize event listener functions on load

function handleFunctionLoad() {
    handleSelectStateButton();
    handleFormSubmit();
}

window.onload = handleFunctionLoad();