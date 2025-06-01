// Navbar dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const dropdownToggle = document.querySelector('.navbar-dropdown-toggle');
  const dropdownMenu = document.querySelector('.navbar-dropdown-menu');
  
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
      dropdownToggle.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.navbar-dropdown')) {
        dropdownMenu.classList.remove('show');
        dropdownToggle.classList.remove('open');
      }
    });

    // Close dropdown when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        dropdownMenu.classList.remove('show');
        dropdownToggle.classList.remove('open');
      }
    });
  }
});