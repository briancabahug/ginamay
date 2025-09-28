console.log("Quick Check Script: Loaded and waiting for target elements...");

// This function finds links, fetches the detail page for each,
// and displays an extracted value directly on the page.
async function fetchAndDisplayValues() {
  // Select links that haven't been processed yet by checking for a custom class
  // on the parent cell (<td>).
  const detailLinks = document.querySelectorAll('table > tbody > tr > td:nth-child(2):not(.quick-value-processed) > a');

  if (detailLinks.length === 0) {
    return; // No new links found, do nothing.
  }

  console.log(`Quick Check Script: Found ${detailLinks.length} new links. Fetching values...`);

  // Define a delay in milliseconds to be polite to the server.
  const requestDelay = 300; // 300ms delay between requests

  // Disconnect the observer while we modify the DOM to prevent an infinite loop.
  observer.disconnect();

  const itemsToProcess = [];

  // First, loop through and update the DOM synchronously.
  // This marks all found links as "in-progress".
  for (const link of detailLinks) {
    const parentCell = link.parentNode;
    parentCell.classList.add('quick-value-processed');

    // Create a container for the value and add it to the DOM with a loading state.
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = ' (Loading...)';
    valueDisplay.style.marginLeft = '10px';
    valueDisplay.style.fontWeight = 'bold';
    parentCell.insertBefore(valueDisplay, link.nextSibling);

    itemsToProcess.push({ link, valueDisplay });
  }

  // Re-enable the observer now that we're done modifying the page structure.
  // It can now watch for new content being added (e.g., from pagination).
  observer.observe(document.body, { childList: true, subtree: true });

  // Now, process each item asynchronously.
  for (const item of itemsToProcess) {
    const { link, valueDisplay } = item;
    try {
      const detailPageUrl = link.href;
      const response = await fetch(detailPageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const pageHtml = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(pageHtml, 'text/html');

      const valueElement = doc.querySelector('#layout-wrapper > div.main-content > div > div > div:nth-child(2) > div > div.row > div:nth-child(1) > div > div.card-body > div > div:nth-child(4)');

      if (valueElement) {
        valueDisplay.textContent = ` (${valueElement.textContent.trim()})`;
      } else {
        valueDisplay.textContent = ' (Value not found)';
        valueDisplay.style.color = 'orange';
      }
    } catch (error) {
      console.error('Error fetching details for', link.href, error);
      valueDisplay.textContent = ' (Error)';
      valueDisplay.style.color = 'red';
    }

    // Wait for a short period before processing the next link.
    await new Promise(resolve => setTimeout(resolve, requestDelay));
  }

  console.log("Quick Check Script: Finished processing all links.");
}

// --- The MutationObserver Logic ---

// 1. Define the observer's "callback" function - what to do when a change is detected.
const observerCallback = (mutationsList, observer) => {
  // Re-run our main function whenever there's a change.
  // It's smart enough not to re-process links.
  fetchAndDisplayValues();
};

// 2. Create an observer instance linked to the callback function.
const observer = new MutationObserver(observerCallback);

// 3. Start observing the entire document body for changes to its structure.
observer.observe(document.body, { childList: true, subtree: true });

// 4. Also, run the function once right at the start, in case the elements
//    were already there when the script loaded.
fetchAndDisplayValues();
