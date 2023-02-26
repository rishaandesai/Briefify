// Get a reference to the URL and Text links
const urlLink = document.querySelectorAll('.pagination li')[0];
const textLink = document.querySelectorAll('.pagination li')[1];

// Add click event listeners to the URL and Text links
urlLink.addEventListener('click', () => {
  // Set the action of the summarize form to /summarize and the placeholder of the input textarea to "Enter a URL"
  document.getElementById('summarize-form').action = '/summarize';
  document.getElementById('input-text').placeholder = 'Enter a URL';
});

textLink.addEventListener('click', () => {
  // Set the action of the summarize form to /summarizetext and the placeholder of the input textarea to "Enter some text"
  document.getElementById('summarize-form').action = '/summarizetext';
  document.getElementById('input-text').placeholder = 'Enter some text';
});

// Get a reference to the form and input elements
const form = document.querySelector('form');

// Add an event listener for when the form is submitted
form.addEventListener('submit', async (event) => {
  const formData = new FormData(form);
  const text = formData.get('input-text');

  event.preventDefault();

  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.width = '0%'; // start from 0%

  // Set up a timer to increment the progress bar every few milliseconds
  let progress = 0;
  let max = Math.random() * 10 + 72;
  const timerId = setInterval(() => {
    // Increment the progress bar width by a random amount between 0 and 4%
    progress += Math.random() * 4;
    progressBar.style.width = `${Math.min(progress, max)}%`;
    document.getElementsByClassName('progresstext')[0].innerHTML = `${Math.min(progress, max).toFixed(2)}%`;
    if(progress<=25){
      progressBar.style.backgroundColor = "red";
    }
    else if(progress<=50){
      progressBar.style.backgroundColor = "orange";
    }
    else if(progress<95){
      progressBar.style.backgroundColor = "#f74231";
    }
    else{
      progressBar.style.backgroundColor = "green";
    }
  }, 300);

  const response = await fetch(`${form.action}?${form.method === 'get' ? new URLSearchParams(new FormData(form)).toString() : ''}`, {
    method: form.method,
    body: form.method === 'post' ? JSON.stringify({ text }) : null,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Stop the timer and complete the progress bar animation
  clearInterval(timerId);
  progressBar.style.width = '100%';
  document.getElementsByClassName('progresstext')[0].innerHTML = '100%';

  if (response.ok) {
    const data = await response.json();
    const summary = data.summary;

    const summaryText = document.getElementById('summaryText');
    summaryText.innerHTML = summary;
    console.log(summary);
    progressBar.style.width = '0%';
  } else {
    console.error('Error fetching summary:', response.statusText);
  }
});

const copyButton = document.getElementById('copy-button');
const summaryText = document.getElementById('summaryText');

copyButton.addEventListener('click', () => {
  navigator.clipboard.writeText(summaryText.innerText);
});

// Get the summary text element and the word count text element
const summaryTextElement = document.getElementById("summaryText");
const wordCountTextElement = document.getElementById("wordCountText");

summarizeForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get the input text and summarize it
  const inputText = document.getElementById("input-text").value;
  const summary = summarizeText(inputText);

  // Update the summary text element and the word count text element
  summaryTextElement.textContent = summary;
  wordCountTextElement.textContent = `Word count: ${countWords(summary)}`;
});

// A function to count the number of words in a string
function countWords(text) {
  return text.split(/\s+/).filter(function(word) {
    return word.length > 0;
  }).length;
}
