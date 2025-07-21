document.addEventListener('DOMContentLoaded', () => {
    const needleEngine = document.getElementById('needle-engine');
    const arButton = document.getElementById('ar-button');
    const mainModel = document.getElementById('main-model');
    
    // Tambahkan indikator loading
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    loadingIndicator.textContent = 'Memuat pengalaman AR...';
    document.body.appendChild(loadingIndicator);
    
    // Event ketika Needle Engine siap
    needleEngine.addEventListener('loaded', async () => {
        console.log('Needle Engine berhasil dimuat');
        loadingIndicator.remove();
        
        const engine = needleEngine.getEngine();
        const scene = needleEngine.getScene();
        
        // Cek dukungan WebXR
        if (!engine.isXRCapable()) {
            arButton.textContent = 'AR tidak didukung di perangkat ini';
            arButton.disabled = true;
            return;
        }
        
        // Event listener untuk tombol AR
        arButton.addEventListener('click', async () => {
            try {
                // Mulai sesi AR
                await engine.startXR();
                
                // Sembunyikan tombol setelah AR dimulai
                arButton.classList.add('hidden');
                
                // Animasi tambahan saat model muncul
                mainModel.setAttribute('animation', {
                    property: 'scale',
                    from: '0.1 0.1 0.1',
                    to: '0.5 0.5 0.5',
                    dur: 1000,
                    easing: 'easeOutElastic'
                });
                
                console.log('Sesi AR berhasil dimulai');
            } catch (error) {
                console.error('Gagal memulai AR:', error);
                arButton.textContent = 'Gagal memulai AR. Coba lagi';
            }
        });
        
        // Event ketika model 3D selesai dimuat
        mainModel.addEventListener('model-loaded', () => {
            console.log('Model 3D berhasil dimuat');
            
            // Tambahkan interaksi tap pada model
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
    });
    
    // Tangani error
    needleEngine.addEventListener('error', (event) => {
        console.error('Error pada Needle Engine:', event.detail);
        loadingIndicator.textContent = 'Terjadi error. Silakan muat ulang halaman.';
        arButton.disabled = true;
    });
});

// Deteksi perubahan ukuran layar
window.addEventListener('resize', () => {
    const needleEngine = document.getElementById('needle-engine');
    if (needleEngine && needleEngine.getEngine()) {
        needleEngine.getEngine().resize();
    }
});