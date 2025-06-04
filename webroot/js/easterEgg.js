function showRolodexLoader() {
  // Inject the HTML structure if it doesn't already exist
  if (!document.getElementById('loading-screen')) {
    const loaderHTML = `
      <div id="loading-screen" style="
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: transform .5s ease-in-out, opacity 1s ease-in-out;
        z-index: 9999;">
        
        <div id="loading-text" style="
          font-size: 1.5em;
          margin-bottom: 25px;
          color: #FF6CB5;
          animation: loadingPulse 1.5s infinite alternate;
          text-align: center;">
          <span id="loading-message">Loading</span><span id="dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
        
        <div id="rolodex-container" style="
          width: 150px; height: 150px;
          opacity: 0;
          transition: opacity 2s ease-in-out, transform 2s ease-in-out;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          animation: pulse 1.5s infinite alternate;">
          <img id="rolodex" src="../assets/images/rolodex.gif" alt="Rolodex Animation" style="
            width: 100%; height: 100%;
            object-fit: cover; display: block;" />
        </div>
        
        <div id="footer-text" style="
          font-size: 2em;
          margin-top: 10px;
          color: #00B7C2;
          animation: pulse 1.5s infinite alternate;
          transform-origin: center;">
          Rolodexit
        </div>
      </div>

      <style>
        @keyframes loadingPulse {
          0% { transform: scale(1); opacity: 0.1; }
          100% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.1; }
          100% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        #dots span {
          display: inline-block;
          animation: blink 1s infinite;
        }
        #dots span:nth-child(2) { animation-delay: 0.2s; }
        #dots span:nth-child(3) { animation-delay: 0.4s; }
      </style>
    `;
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
  }

  const container = document.getElementById('rolodex-container');
  const background = document.getElementById('loading-screen');
  const loadingMessage = document.getElementById('loading-message');
  const footerText = document.getElementById('footer-text');

  const messages = [
    "Fishing through the contacts pond",
    "Casting a net into the contact sea",
    "Taking a stroll down the contact boulevard",
    "Tapping into the phonebook lottery",
    "Hitting shuffle on the address book",
    "Spinning the Rolodex wheel of fate",
    "Engaging in contact roulette",
    "Blind dialing the unknown",
    "Digging through the dusty archives",
    "Drawing a name from the hat"
  ];

  // Retrieve last index or start at 0
  let currentIndex = parseInt(localStorage.getItem('rolodexIndex')) || 0;

  // Show the loader
  background.style.transform = 'scale(1)';
  background.style.opacity = 1;
  container.style.opacity = 1;
  loadingMessage.textContent = messages[currentIndex];

  // Update index for next time
  currentIndex = (currentIndex + 1) % messages.length;
  localStorage.setItem('rolodexIndex', currentIndex);

  // Animate the rolodex container
  startSmoothFloating();

  // Fade out after 9 seconds
  setTimeout(() => {
    container.style.opacity = 0;
    loadingMessage.parentElement.style.opacity = 0;
    footerText.style.opacity = 0;
    setTimeout(() => {
      background.style.transform = 'scale(0)';
      background.style.opacity = 0;

      selectRandomContact();
    }, 1000);
  }, 4500);

  function startSmoothFloating() {
    function animate() {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const scale = 1 + (Math.random() - 0.5) * 0.1;
      const angle = (Math.random() - 0.5) * 10;
      container.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale})`;
      setTimeout(animate, 2000);
    }
    animate();
  }

  /**
 * Wait until at least one contact row is in the DOM,
 * then choose one at random and trigger its click.
 */
function selectRandomContact() {

  clearSearchBar();

  const rows = document.querySelectorAll('#contactsList .contact-row');

  if (rows.length === 0) {
    // Contacts haven’t finished loading yet – try again in 200 ms.
    setTimeout(selectRandomContact, 200);
    return;
  }

  const randomRow = rows[Math.floor(Math.random() * rows.length)];
  randomRow.click();                              // highlight + show details
  randomRow.scrollIntoView({                      // optional: centre on screen
    behavior: 'smooth',
    block: 'center'
  });
}

function clearSearchBar() {
  const searchInput = document.getElementById('searchText');
  if (searchInput && searchInput.value !== '') {
    searchInput.value = '';
    if (typeof window.searchContacts === 'function') {
      window.searchContacts();        // repopulate full list
    }
    return true;
  }
  return false;
}

}
