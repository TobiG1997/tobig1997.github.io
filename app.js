// eBooks Bibliothek App
let allEbooks = [];
let ebooksWithMetadata = [];

// Lade eBooks beim Laden der Seite
document.addEventListener('DOMContentLoaded', async () => {
    await loadEbooks();
    setupSearch();
});

// Lade eBooks aus JSON-Datei
async function loadEbooks() {
    try {
        const response = await fetch('ebooks.json');
        if (!response.ok) {
            throw new Error('ebooks.json nicht gefunden');
        }
        allEbooks = await response.json();
        
        // Prüfe ob Array leer ist
        if (!Array.isArray(allEbooks) || allEbooks.length === 0) {
            console.log('Keine eBooks gefunden');
            ebooksWithMetadata = [];
            showEmptyState();
            return;
        }
        
        // Lade Metadaten für alle eBooks mit Timeout
        ebooksWithMetadata = await Promise.all(
            allEbooks.map(async (ebook) => {
                const metadata = await getEbookMetadata(ebook.file);
                return {
                    ...ebook,
                    ...metadata
                };
            })
        );
        
        displayEbooks(ebooksWithMetadata);
    } catch (error) {
        console.error('Fehler beim Laden der eBooks:', error);
        ebooksWithMetadata = [];
        showEmptyState();
    }
}

// Hole Metadaten für ein eBook (Dateigröße und Seitenanzahl)
async function getEbookMetadata(filePath) {
    const metadata = {
        size: 'N/A',
        pages: '—',
        sizeBytes: 0
    };

    try {
        // Hole Dateigröße mit Timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 Sekunden Timeout
        
        const response = await fetch(filePath, { 
            method: 'HEAD',
            signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const contentLength = response.headers.get('Content-Length');
            if (contentLength) {
                metadata.sizeBytes = parseInt(contentLength);
                metadata.size = formatFileSize(metadata.sizeBytes);
            }
        }

        // Hole Seitenanzahl mit PDF.js (mit Timeout)
        try {
            const loadingTask = pdfjsLib.getDocument(filePath);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('PDF Timeout')), 5000)
            );
            const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
            metadata.pages = pdf.numPages.toString();
        } catch (pdfError) {
            console.warn(`PDF Seitenanzahl für ${filePath} konnte nicht geladen werden:`, pdfError.message);
            metadata.pages = '—';
        }
    } catch (error) {
        console.warn(`Metadaten für ${filePath} konnte nicht geladen werden:`, error.message);
    }

    return metadata;
}

// Zeige eBooks im Grid an
function displayEbooks(ebooks) {
    const grid = document.getElementById('ebookGrid');
    const emptyState = document.getElementById('emptyState');

    if (ebooks.length === 0) {
        showEmptyState();
        return;
    }

    grid.innerHTML = '';
    emptyState.style.display = 'none';

    ebooks.forEach((ebook, index) => {
        const card = createEbookCard(ebook, index);
        grid.appendChild(card);
    });
}

// Erstelle eine eBook-Karte
function createEbookCard(ebook, index) {
    const card = document.createElement('div');
    card.className = 'ebook-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const fileName = ebook.file.split('/').pop();
    const fileSize = ebook.size || 'Laden...';
    const pages = ebook.pages || '—';

    card.innerHTML = `
        <div class="ebook-icon">
            <svg viewBox="0 0 24 24" fill="white">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H9V10H13V12L11,16H14V19H10Z"/>
            </svg>
        </div>
        <h3 class="ebook-title">${ebook.title}</h3>
        ${ebook.author ? `<p style="text-align: center; color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">${ebook.author}</p>` : ''}
        <div class="ebook-meta">
            <div class="ebook-meta-item">
                <div class="ebook-meta-label">Seiten</div>
                <div class="ebook-meta-value">${pages}</div>
            </div>
            <div class="ebook-meta-item">
                <div class="ebook-meta-label">Größe</div>
                <div class="ebook-meta-value">${fileSize}</div>
            </div>
        </div>
        <a href="${ebook.file}" download="${fileName}" class="download-btn">
            Herunterladen
        </a>
    `;

    return card;
}

// Zeige Empty State
function showEmptyState() {
    const grid = document.getElementById('ebookGrid');
    const emptyState = document.getElementById('emptyState');
    
    grid.innerHTML = '';
    emptyState.style.display = 'block';
}

// Suchfunktion einrichten
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            displayEbooks(ebooksWithMetadata);
            return;
        }

        const filtered = ebooksWithMetadata.filter(ebook => {
            const title = ebook.title.toLowerCase();
            const author = (ebook.author || '').toLowerCase();
            return title.includes(searchTerm) || author.includes(searchTerm);
        });

        displayEbooks(filtered);
    });
}

// Formatiere Dateigröße
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
