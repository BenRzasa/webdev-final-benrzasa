let fancyModeActive = false;
let draggableElements = [];

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('fancy-mode-toggle');

    if (!toggleButton) {
        console.error('Fancy Mode button not found!');
        return;
    }

    toggleButton.addEventListener('click', function() {
        fancyModeActive = !fancyModeActive;

        if (fancyModeActive) {
            enableFancyMode();
            this.textContent = 'Toggle Normal Mode (Try dragging elements!)';
            this.setAttribute('aria-label', 'Disable fancy interactive mode');
        } else {
            disableFancyMode();
            this.textContent = 'Toggle Fancy Mode??';
            this.setAttribute('aria-label', 'Enable fancy interactive mode');
        }
    });
});

function enableFancyMode() {
    document.documentElement.style.scrollBehavior = 'smooth';

    const elements = document.querySelectorAll(
        'h1, p, li, img, form, input, .main-item, .accordion-item, .dropdown, button, form, .image-box'
    );

    elements.forEach(el => {
        if (el.id !== 'fancy-mode-toggle') {
            // Store original position before modifying
            if (!el.dataset.originalPosition) {
                el.dataset.originalPosition = window.getComputedStyle(el).position;
                el.dataset.originalTop = el.style.top || '';
                el.dataset.originalLeft = el.style.left || '';
                el.dataset.originalTransform = el.style.transform || '';
            }

            makeDraggable(el);
            draggableElements.push(el);
        }
    });

    document.body.classList.add('fancy-mode');
    console.log('Fancy mode activated!');
}

function disableFancyMode() {
    document.documentElement.style.scrollBehavior = 'auto';

    // Remove draggable behavior and restore original positions
    draggableElements.forEach(el => {
        el.style.transform = el.dataset.originalTransform || '';
        el.style.position = el.dataset.originalPosition || '';
        el.style.cursor = '';
        el.style.zIndex = '';
        el.style.top = el.dataset.originalTop || '';
        el.style.left = el.dataset.originalLeft || '';
        el.style.transition = '';

        // Remove event listeners
        el.onmousedown = null;
    });

    draggableElements = [];

    // Remove visual feedback
    document.body.classList.remove('fancy-mode');
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX = 0, initialY = 0;

    // Only set relative positioning if it's not already positioned
    if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }

    element.style.cursor = 'move';
    element.style.transition = 'transform 0.2s';
    element.style.zIndex = '1000';

    element.onmousedown = dragStart;

    function dragStart(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling

        isDragging = true;

        // Get initial mouse position
        startX = e.clientX;
        startY = e.clientY;

        // Get current element position from its computed style
        // Use 0 as default if no left/top values are set
        const currentLeft = element.style.left;
        const currentTop = element.style.top;

        // Parse the current left/top values, default to 0 if not set
        initialX = currentLeft ? parseInt(currentLeft) : 0;
        initialY = currentTop ? parseInt(currentTop) : 0;

        // Add slight random rotation
        const rotation = Math.random() * 10 - 5;
        element.style.transform = `rotate(${rotation}deg)`;

        // Bring to front
        element.style.zIndex = '1001';

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();

        // Calculate new position relative to initial click
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Update element position
        element.style.left = (initialX + deltaX) + 'px';
        element.style.top = (initialY + deltaY) + 'px';

        // Add rotation based on movement
        const rotation = deltaX * 0.1;
        element.style.transform = `rotate(${rotation}deg)`;
    }

    function dragEnd(e) {
        if (!isDragging) return;

        isDragging = false;

        // Remove event listeners
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);

        // Reset z-index after a moment
        setTimeout(() => {
            if (!isDragging) {
                element.style.zIndex = '1000';
            }
        }, 300);
    }
}
