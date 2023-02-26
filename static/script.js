// Get a reference to the form and input elements
const form = document.querySelector('form');
const inputUrl = document.querySelector('#input-text');

// Add an event listener for when the form is submitted
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = inputUrl.value.trim();

  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.width = '0%'; // sspitart from 0%

  // Set up a timer to increment the progress bar every few milliseconds
  let progress = 0;
  let max = Math.random() * 10 + 72;
  const timerId = setInterval(() => {
    // Increment the progress bar width by a random amount between 0 and 4%
    progress += Math.random() * 5;
    progressBar.style.width = `${Math.min(progress, max)}%`;
    document.getElementsByClassName('progresstext')[0].innerHTML = `${Math.min(progress, max).toFixed(2)}%`;
    if(progress<=25){
      progressBar.style.backgroundColor = "red";
    }
    else if(progress<=50){
      progressBar.style.backgroundColor = "orange";
    }
    else if(progress<100){
      progressBar.style.backgroundColor = "#f74231";
    }
    else{
      progressBar.style.backgroundColor = "green";
    }
  }, 300);

  try {
    const response = await fetch(`/summarize?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Stop the timer and complete the progress bar animation
    clearInterval(timerId);
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = "green";
    document.getElementsByClassName('progresstext')[0].innerHTML = '100%';

    if (response.ok) {
      const data = await response.json();
      const summary = data.summary;
      console.log(summary)
      const summaryText = document.getElementById('summary-text');
      summaryText.textContent = summary;
      progressBar.style.width = '0%';
      progressBar.style.backgroundColor = "red";
      document.getElementsByClassName('progresstext')[0].innerHTML = '0%';
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (error) {
    let summaryText = document.getElementById('summary-text');
    console.error('Error fetching summary:', error.message);
    summaryText.textContent = `Error fetching summary: ${error.message}`;
  }
});

document.getElementById('wordCountText').innerHTML = 'Word Count: ' + document.getElementById('summary-text').value.length;

const copyButton = document.querySelector('#copy-button');
const summaryText = document.querySelector('#summary-text');

copyButton.addEventListener('click', () => {
  navigator.clipboard.writeText(summaryText.textContent)
    .then(() => {
      console.log('Text copied to clipboard');
      // Do something to indicate that the text was copied
    })
    .catch(err => {
      console.error('Error copying text to clipboard:', err);
    });
});