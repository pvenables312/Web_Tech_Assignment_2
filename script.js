// Get references to the HTML elements
const searchForm = document.getElementById('searchForm');
const characterNameInput = document.getElementById('characterNameInput');
const resultsDiv = document.getElementById('results');

// API Base URL
const API_BASE_URL = 'https://anapioficeandfire.com/api/characters';

// Function to display loading message
function showLoading() {
    resultsDiv.innerHTML = '<p class="loading">Loading...</p>';
}

// Function to display error message
function showError(message) {
    resultsDiv.innerHTML = `<p class="error">Error: ${message}</p>`;
}

// Function to display character data
function displayResults(characters) {
    // Clear previous results
    resultsDiv.innerHTML = '';

    if (!characters || characters.length === 0) {
        resultsDiv.innerHTML = '<p>No characters found matching that name.</p>';
        return;
    }

    // Loop through each character found and create a display card for them
    characters.forEach(character => {
        const card = document.createElement('div');
        card.classList.add('character-card');

        // Determine the display name (use name if available, otherwise alias)
        const displayName = character.name || (character.aliases && character.aliases[0]) || 'Unknown';
        card.innerHTML += `<h2>${displayName}</h2>`;

        // Helper function to add details if they exist
        const addDetail = (label, value) => {
            if (value && value.length > 0) { // Check if value exists and is not empty
                // If it's an array, join elements; otherwise, use the value directly
                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                card.innerHTML += `<p><strong>${label}:</strong> ${displayValue}</p>`;
            } else {
                 card.innerHTML += `<p><strong>${label}:</strong> N/A</p>`;
            }
        };

        // Add character details using the helper
        addDetail('Name', character.name);
        addDetail('Gender', character.gender);
        addDetail('Culture', character.culture);
        addDetail('Born', character.born);
        addDetail('Died', character.died);

        // Handle arrays like titles and aliases
         if (character.titles && character.titles.length > 0 && character.titles[0] !== "") {
            card.innerHTML += `<p><strong>Titles:</strong></p><ul>${character.titles.map(title => `<li>${title}</li>`).join('')}</ul>`;
        } else {
            card.innerHTML += `<p><strong>Titles:</strong> N/A</p>`;
        }

        if (character.aliases && character.aliases.length > 0 && character.aliases[0] !== "") {
            card.innerHTML += `<p><strong>Aliases:</strong></p><ul>${character.aliases.map(alias => `<li>${alias}</li>`).join('')}</ul>`;
        } else {
            card.innerHTML += `<p><strong>Aliases:</strong> N/A</p>`;
        }

        // Add other details like playedBy
        addDetail('Played By', character.playedBy);

        resultsDiv.appendChild(card);
    });
}


// Add event listener for form submission
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission (page reload)

    const characterName = characterNameInput.value.trim(); // Get and trim the input value

    if (!characterName) {
        showError("Please enter a character name.");
        return; // Exit if the input is empty
    }

    showLoading(); // Show loading message

    // Construct the API URL with the query parameter
    const searchUrl = `${API_BASE_URL}?name=${encodeURIComponent(characterName)}`;

    try {
        const response = await fetch(searchUrl);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status} (${response.statusText})`);
        }

        const data = await response.json(); // Parse the JSON response
        displayResults(data); // Display the results

    } catch (error) {
        console.error("Failed to fetch character data:", error);
        showError(`Failed to fetch data. ${error.message}`);
    }
});