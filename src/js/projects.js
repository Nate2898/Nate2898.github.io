document.addEventListener('DOMContentLoaded', function() {
  // For each popup overlay, set up open/close logic
  document.querySelectorAll('.popup-overlay').forEach(function(popupOverlay) {
    // Find the close button inside this overlay
    const closeBtn = popupOverlay.querySelector('.close-popup');
    // Find the id for this overlay (e.g., 'popup-overlay-vmware')
    const overlayId = popupOverlay.id;

    // Find all links that should open this popup
    // Convention: link id matches overlay id minus 'popup-overlay-' prefix
    // e.g., <a id="vmware"> opens #popup-overlay-vmware
    let linkId = overlayId.replace('popup-overlay-', '');
    document.querySelectorAll('a#' + linkId).forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        popupOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });

    // Close popup when clicking X
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }

    // Close popup when clicking outside content
    popupOverlay.addEventListener('click', function(e) {
      if (e.target === popupOverlay) {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Close any open popup with escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.popup-overlay').forEach(function(popupOverlay) {
        if (popupOverlay.style.display === 'block') {
          popupOverlay.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
    }
  });
});