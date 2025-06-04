/**
 * teamcard.js
 *
 * This script makes the member cards on the "Meet the Team" page clickable,
 * redirecting to the LinkedIn profile specified in the 'data-linkedin' attribute
 * of each card.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Select all elements with the class 'member-card'
  const memberCards = document.querySelectorAll('.member-card');

  // Check if any member cards are found on the page
  if (memberCards.length > 0) {
    // Iterate over each found member card
    memberCards.forEach(card => {
      // Set the cursor style to 'pointer' to visually indicate clickability
      card.style.cursor = 'pointer';

      // Add a click event listener to each card
      card.addEventListener('click', () => {
        // Retrieve the LinkedIn URL from the 'data-linkedin' attribute
        // The 'dataset' property provides easy access to data attributes (e.g., data-linkedin becomes dataset.linkedin)
        const linkedInUrl = card.dataset.linkedin;

        // Check if a LinkedIn URL exists for this card
        if (linkedInUrl) {
          window.open(linkedInUrl, '_blank');
        } 
      });
    });
  } else {
    // Log a message if no member cards are found on the page
    console.info('No member cards found on this page. The team card click handler will not be applied.');
  }
});
