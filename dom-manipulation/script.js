// Step 1: Simulate Server Interaction
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with actual API if available

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const serverQuotes = await response.json();

        // Simulate server quotes (since JSONPlaceholder doesn't return our format)
        const simulatedQuotes = serverQuotes.map(post => ({
            text: post.title,
            category: 'Server'
        }));

        quotes = mergeQuotes(quotes, simulatedQuotes);
        saveQuotes(); // Save merged quotes to local storage
        populateCategories(); // Update the category dropdown
        showRandomQuote(); // Display a random quote
        notifyUser('Quotes synced with the server!');
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        notifyUser('Failed to sync quotes with the server.');
    }
}

async function sendQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quote)
        });

        if (!response.ok) throw new Error('Failed to send quote to server');
        console.log('Quote sent to server:', await response.json());
        notifyUser('Quote successfully sent to the server!');
    } catch (error) {
        console.error('Error sending quote to server:', error);
        notifyUser('Failed to send quote to the server.');
    }
}

// Step 2: Implement Data Syncing
function syncQuotes() {
    fetchQuotesFromServer().then(serverQuotes => {
        let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
        notifyUser('Data synced with server');
    });
}

// Step 3: Handling Conflicts
function mergeQuotes(localQuotes, serverQuotes) {
    const mergedQuotes = [...localQuotes];
    serverQuotes.forEach(serverQuote => {
        const existingQuote = mergedQuotes.find(q => q.text === serverQuote.text);
        if (!existingQuote) {
            mergedQuotes.push(serverQuote);
        }
    });
    return mergedQuotes;
}

function notifyUser(message) {
    alert(message); // Replace with a better UI notification if needed
}

// Step 4: Testing and Verification
setInterval(syncQuotes, 60000); // Sync every 60 seconds
