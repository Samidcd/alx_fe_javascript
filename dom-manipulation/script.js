// Array of quote objects
let quotes = [];

// Load quotes from local storage when the page loads
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if local storage is empty
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
      { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Motivation" }
    ];
    saveQuotes();
  }
  populateCategories(); // Populate the category dropdown
  restoreLastFilter(); // Restore the last selected filter
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${randomQuote.text}</strong> <em>(${randomQuote.category})</em>`;

  // Save the last viewed quote to session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save to local storage
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    populateCategories(); // Update the category dropdown
    showRandomQuote(); // Optionally display the newly added quote
  } else {
    alert('Please fill in both the quote and category fields.');
  }
}

// Function to populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories

  // Clear existing options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add new options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  // Display the filtered quotes (for demonstration, we'll just show the first one)
  if (filteredQuotes.length > 0) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<strong>${filteredQuotes[0].text}</strong> <em>(${filteredQuotes[0].category})</em>`;
  } else {
    document.getElementById('quoteDisplay').textContent = 'No quotes found for this category.';
  }

  // Save the selected filter to local storage
  localStorage.setItem('lastSelectedFilter', selectedCategory);
}

// Function to restore the last selected filter
function restoreLastFilter() {
  const lastSelectedFilter = localStorage.getItem('lastSelectedFilter');
  if (lastSelectedFilter) {
    document.getElementById('categoryFilter').value = lastSelectedFilter;
    filterQuotes(); // Apply the filter
  }
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save to local storage
    populateCategories(); // Update the category dropdown
    alert('Quotes imported successfully!');
    showRandomQuote(); // Display a random quote
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the "Export Quotes" button
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);

// Load quotes and display a random quote when the page loads
loadQuotes();
showRandomQuote();