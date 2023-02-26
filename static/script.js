const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progresstext");
const inputText = document.querySelector("#input-text");
const inputType = document.querySelector("#input-type");
const summarizeForm = document.querySelector("#summarize-form");
const summaryText = document.querySelector("#summary-text");
const wordCountText = document.querySelector("#wordCountText");
const copyButton = document.querySelector("#copy-button");
const urlLink = document.querySelector("#url-link");
const textLink = document.querySelector("#text-link");

let fetchUrl = "/summarize";

function updateProgressBar(percent) {
  progressBar.style.width = percent + "%";
  progressText.innerHTML = percent + "%";
}

function summarizeText(input) {
  fetch(fetchUrl + "?url=" + input, {
    method: "GET",
  })
  let max = Math.random() * 10 + 72;
  const timerId = setInterval(() => {
    // Increment the progress bar width by a random amount between 0 and 4%
    progress += Math.random() * 4;
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
 }, 300)
    .then((response) => response.json())
    .then((data) => {
      summaryText.innerHTML = data.summary;
      wordCountText.innerHTML = "Word count: " + data.word_count;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const input = inputText.value.trim();

  if (input) {
    summarizeText(input);

  } else {
    alert("Please enter some text to summarize.");
  }
}

function handleUrlLinkClick(event) {
  event.preventDefault();
  const urlLink = document.querySelector('#url-link');
  const textLink = document.querySelector('#text-link');
  const inputType = document.querySelector('#input-type');
  const inputText = document.querySelector('#input-text');
  
  inputType.value = 'url';
  inputText.placeholder = 'Enter a URL...';
  document.querySelector('#summarize-form').action = '/summarize';
  textLink.classList.remove('active');
  urlLink.classList.add('active');
  fetchUrl = "/summarize";
}

function handleTextLinkClick(event) {
  event.preventDefault();
  const urlLink = document.querySelector('#url-link');
  const textLink = document.querySelector('#text-link');
  const inputType = document.querySelector('#input-type');
  const inputText = document.querySelector('#input-text');

  inputType.value = 'text';
  inputText.placeholder = 'Enter text to summarize...';
  document.querySelector('#summarize-form').action = '/summarizetext';
  urlLink.classList.remove('active');
  textLink.classList.add('active');
  fetchUrl = "/summarizetext";
}

function handleCopyButtonClick(event) {
  event.preventDefault();
  const textToCopy = summaryText.innerText;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert("Copied to clipboard!");
  });
}

function handleInputTextFocus() {
  if (inputText.value === "") {
    inputText.placeholder = "";
  }
}

function handleInputTextBlur() {
  if (inputText.value === "") {
    if (inputType.value === "url") {
      inputText.placeholder = "Enter a URL...";
    } else {
      inputText.placeholder = "Enter text to summarize...";
    }
  }
}

summarizeForm.addEventListener("submit", handleFormSubmit);
urlLink.addEventListener("click", handleUrlLinkClick);
textLink.addEventListener("click", handleTextLinkClick);
copyButton.addEventListener("click", handleCopyButtonClick);
inputText.addEventListener("focus", handleInputTextFocus);
inputText.addEventListener("blur", handleInputTextBlur);