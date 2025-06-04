(function () {
  window.addEventListener('load', () => {

    const navigationType = performance.getEntriesByType('navigation')[0].type;


    if (navigationType === 'reload' || navigationType === 'back_forward') {
      return;
    }


    const loaderHTML = `
      <div id="loading-screen" style="
        position: fixed; z-index: 9999; top: 0; left: 0;
        width: 100%; height: 100%; background: #000; display: flex;
        flex-direction: column; justify-content: center; align-items: center;
        transition: transform .5s ease-in-out, opacity 1s ease-in-out;">
        <div id="loading-text" style="
          font-size: 2em; margin-bottom: 25px; color: #FF6CB5;
          animation: loadingPulse 1.5s infinite alternate;">
          Loading<span style="display: inline-block; animation: blink 1s infinite;">.</span>
          <span style="display: inline-block; animation: blink 1s infinite 0.2s;">.</span>
          <span style="display: inline-block; animation: blink 1s infinite 0.4s;">.</span>
        </div>
        <div id="rolodex-container" style="
          width: 150px; height: 150px; opacity: 0; transition: opacity 2s ease-in-out, transform 2s ease-in-out;
          border-radius: 15px; overflow: hidden; position: relative; animation: pulse 1.5s infinite alternate;">
          <img id="rolodex" src="../assets/images/rolodex5.gif" alt="Rolodex Animation" style="width: 100%; height: 100%; object-fit: cover; display: block;">
        </div>
        <div id="footer-text" style="
          font-size: 2em; margin-top: 10px; color: #00B7C2; animation: pulse 1.5s infinite alternate;">
          Rolodexit
        </div>
      </div>
      <style>
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes loadingPulse { 0% { transform: scale(1); opacity: 0.1; } 100% { transform: scale(1.1); opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.1; } 100% { transform: scale(1.1); opacity: 1; } }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', loaderHTML);

    const container = document.getElementById('rolodex-container');
    const background = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const footerText = document.getElementById('footer-text');

    console.log("Loader running");
    container.style.opacity = 1;

    startSmoothFloating();

    setTimeout(() => {
      container.style.opacity = 0;
      loadingText.style.opacity = 0;
      footerText.style.opacity = 0;

      setTimeout(() => {
        background.style.transform = 'scale(0)';
        background.style.opacity = 0;
        setTimeout(() => background.remove(), 500);
      }, 1000);
    }, 4000);

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
  });
})();
