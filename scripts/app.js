document.addEventListener('DOMContentLoaded', async () => {
    const needleEngine = document.querySelector('needle-engine');
    const arButton = document.getElementById('ar-button');
    const mainModel = document.getElementById('main-model');
    
    // Loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    loadingIndicator.textContent = 'Loading AR experience...';
    document.body.appendChild(loadingIndicator);
    
    try {
        // Wait for Needle Engine to be ready
        await customElements.whenDefined('needle-engine');
        
        // Get the engine instance
        const engine = needleEngine.engine;
        if (!engine) throw new Error("Engine not initialized");
        
        console.log('Needle Engine loaded successfully');
        loadingIndicator.remove();
        
        // Check AR support
        if (!engine.isXRCapable()) {
            arButton.textContent = 'AR not supported on this device';
            arButton.disabled = true;
            return;
        }
        
        // AR button handler
        arButton.addEventListener('click', async () => {
            try {
                await engine.startXR();
                arButton.classList.add('hidden');
                
                // Model animation
                mainModel.setAttribute('animation', {
                    property: 'scale',
                    from: '0.1 0.1 0.1',
                    to: '0.5 0.5 0.5',
                    dur: 1000,
                    easing: 'easeOutElastic'
                });
            } catch (error) {
                console.error('Failed to start AR:', error);
                arButton.textContent = 'Failed to start AR. Try again';
            }
        });
        
        // Model loaded event
        mainModel.addEventListener('model-loaded', () => {
            console.log('3D model loaded');
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
        console.error('Needle Engine error:', error);
        loadingIndicator.textContent = 'Error loading AR. Please refresh.';
        if (arButton) arButton.disabled = true;
    }
});
