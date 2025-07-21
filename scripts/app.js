// Import Needle Engine as ES module
import { Engine } from 'https://cdn.jsdelivr.net/npm/@needle-tools/engine@1.0.0/dist/needle-engine.min.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    const needleEngine = document.getElementById('ar-engine');
    const arButton = document.getElementById('ar-button');
    const mainModel = document.getElementById('main-model');
    
    // Loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    loadingIndicator.textContent = 'Initializing AR...';
    document.body.appendChild(loadingIndicator);

    try {
        // Initialize Needle Engine
        const engine = new Engine(needleEngine);
        await engine.initialize();
        
        // Engine is now ready
        loadingIndicator.remove();
        console.log('Needle Engine initialized');

        // Check AR support
        if (!engine.isXRCapable()) {
            arButton.textContent = 'AR not supported';
            arButton.disabled = true;
            return;
        }

        // AR button handler
        arButton.addEventListener('click', async () => {
            try {
                await engine.startXR();
                arButton.classList.add('hidden');
                
                // Animate model
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
});
