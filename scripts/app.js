// Wait for everything to load
window.addEventListener('DOMContentLoaded', async () => {
    const needleEngine = document.getElementById('ar-engine');
    const arButton = document.getElementById('ar-button');
    const mainModel = document.getElementById('main-model');
    
    // Show loading state
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    loadingIndicator.textContent = 'Initializing AR...';
    document.body.appendChild(loadingIndicator);

    // New initialization approach
    async function initializeAR() {
        try {
            // Wait for Needle Engine to be defined
            await customElements.whenDefined('needle-engine');
            
            // Needle Engine v2+ uses this pattern
            await needleEngine.updateComplete;
            const engine = needleEngine.getEngine();
            
            if (!engine) {
                throw new Error("Engine instance not available");
            }

            // Remove loading indicator
            loadingIndicator.remove();

            // Check AR support
            if (!engine.isXRCapable()) {
                arButton.textContent = 'AR not supported';
                arButton.disabled = true;
                return;
            }

            // Set up AR button
            arButton.addEventListener('click', async () => {
                try {
                    await engine.startXR();
                    arButton.classList.add('hidden');
                    
                    // Add model animation
                    mainModel.setAttribute('animation', {
                        property: 'scale',
                        from: '0.1 0.1 0.1',
                        to: '0.5 0.5 0.5',
                        dur: 1000,
                        easing: 'easeOutElastic'
                    });
                } catch (error) {
                    console.error('AR failed to start:', error);
                    arButton.textContent = 'AR failed - Tap to retry';
                }
            });

            // Model interaction
            mainModel.addEventListener('model-loaded', () => {
                console.log('3D model ready');
                mainModel.addEventListener('click', () => {
                    mainModel.setAttribute('animation__bounce', {
                        property: 'position.y',
                        from: '0',
                        to: '0.2',
                        dur: 300,
                        dir: 'alternate',
                        easing: 'easeOutQuad',
                        loop: 2
                    });
                });
            });

        } catch (error) {
            console.error('AR initialization failed:', error);
            loadingIndicator.textContent = 'Failed to initialize AR';
            if (arButton) arButton.disabled = true;
        }
    }

    // Start initialization
    initializeAR();
});
