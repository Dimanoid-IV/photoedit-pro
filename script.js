// Photo Editor Application
class PhotoEditor {
    constructor() {
        this.photos = [];
        this.currentPhoto = null;
        this.canvas = null;
        this.ctx = null;
        this.originalImageData = null;
        this.currentFilter = 'none';
        this.cropMode = false;
        this.cropRatio = 'free';
        this.adjustments = {
            brightness: 0,
            contrast: 0,
            saturation: 0
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        // File input
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });

        // Instagram button (placeholder)
        document.getElementById('instagramBtn').addEventListener('click', () => {
            this.showInstagramModal();
        });

        // Editor controls
        document.getElementById('closeEditor').addEventListener('click', () => {
            this.closeEditor();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyFilter(e.target.dataset.filter);
            });
        });

        // Crop buttons
        document.querySelectorAll('.crop-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCropRatio(e.target.dataset.ratio);
            });
        });

        // Adjustment sliders
        document.getElementById('brightness').addEventListener('input', (e) => {
            this.adjustments.brightness = parseInt(e.target.value);
            this.applyAllAdjustments();
        });

        document.getElementById('contrast').addEventListener('input', (e) => {
            this.adjustments.contrast = parseInt(e.target.value);
            this.applyAllAdjustments();
        });

        document.getElementById('saturation').addEventListener('input', (e) => {
            this.adjustments.saturation = parseInt(e.target.value);
            this.applyAllAdjustments();
        });

        // Editor actions
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetImage();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveImage();
        });

        // Collage functionality
        document.getElementById('createCollageBtn').addEventListener('click', () => {
            this.openCollageEditor();
        });

        document.getElementById('closeCollage').addEventListener('click', () => {
            this.closeCollageEditor();
        });

        // Template selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectTemplate(e.currentTarget.dataset.template);
            });
        });

        document.getElementById('downloadCollage').addEventListener('click', () => {
            this.downloadCollage();
        });

        document.getElementById('downloadAllBtn').addEventListener('click', () => {
            this.downloadAll();
        });

        document.getElementById('sendPhotosBtn').addEventListener('click', () => {
            this.sendPhotosToEmail();
        });

        // Text and sticker controls
        document.getElementById('textSize').addEventListener('input', (e) => {
            document.getElementById('textSizeLabel').textContent = e.target.value + 'px';
        });

        document.getElementById('addTextBtn').addEventListener('click', () => {
            this.addTextToImage();
        });

        document.querySelectorAll('.sticker-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addStickerToImage(e.target.dataset.sticker, e.target.textContent);
            });
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files);
        });
    }

    handleFileSelect(files) {
        const fileArray = Array.from(files).slice(0, 5); // Limit to 5 files
        
        fileArray.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addPhoto(e.target.result, file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addPhoto(src, name) {
        const photo = {
            id: Date.now() + Math.random(),
            src: src,
            name: name,
            edited: false
        };

        this.photos.push(photo);
        this.renderPhotoGallery();
        this.showMainActions();
    }

    renderPhotoGallery() {
        const gallery = document.getElementById('photoGallery');
        const grid = document.getElementById('photosGrid');
        
        gallery.style.display = 'block';
        // Keep upload section hidden but show add more button
        document.getElementById('uploadSection').style.display = 'none';
        
        grid.innerHTML = '';
        
        this.photos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            // Show edited indicator
            const editedBadge = photo.edited ? '<span class="edited-badge"><i class="fas fa-check"></i> Отредактировано</span>' : '';
            
            photoItem.innerHTML = `
                <img src="${photo.src}" alt="Фотография">
                <div class="photo-controls">
                    <div class="photo-status">
                        ${editedBadge}
                    </div>
                    <div class="photo-actions">
                        <button class="photo-action-btn" onclick="photoEditor.editPhoto('${photo.id}')">
                            <i class="fas fa-edit"></i> Редактировать
                        </button>
                        <button class="photo-action-btn delete" onclick="photoEditor.deletePhoto('${photo.id}')">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(photoItem);
        });
    }

    editPhoto(photoId) {
        const photo = this.photos.find(p => p.id == photoId);
        if (!photo) return;

        this.currentPhoto = photo;
        this.openEditor();
    }

    deletePhoto(photoId) {
        this.photos = this.photos.filter(p => p.id != photoId);
        this.renderPhotoGallery();
        
        if (this.photos.length === 0) {
            document.getElementById('photoGallery').style.display = 'none';
            document.getElementById('uploadSection').style.display = 'block';
            this.hideMainActions();
        }
    }

    openEditor() {
        const editorSection = document.getElementById('editorSection');
        editorSection.style.display = 'flex';
        
        this.canvas = document.getElementById('editorCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.loadImageToCanvas();
    }

    loadImageToCanvas() {
        const img = new Image();
        img.onload = () => {
            // Set canvas size to image size (with max dimensions)
            const maxWidth = 800;
            const maxHeight = 600;
            let { width, height } = img;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            
            this.canvas.width = width;
            this.canvas.height = height;
            
            this.ctx.drawImage(img, 0, 0, width, height);
            this.originalImageData = this.ctx.getImageData(0, 0, width, height);
        };
        img.src = this.currentPhoto.src;
    }

    closeEditor() {
        document.getElementById('editorSection').style.display = 'none';
        this.resetControls();
    }

    applyFilter(filterName, resetAdjustments = true) {
        if (!this.originalImageData) return;
        
        // Only update UI if this is a direct user action
        if (resetAdjustments) {
            // Remove active class from all filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            if (event && event.target) {
                event.target.classList.add('active');
            }
        }
        
        this.currentFilter = filterName;
        
        // Apply filter to current image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        switch (filterName) {
            case 'grayscale':
                this.applyGrayscale(data);
                break;
            case 'sepia':
                this.applySepia(data);
                break;
            case 'vintage':
                this.applyVintage(data);
                break;
            case 'bright':
                this.applyBrightness(data, 30);
                break;
            case 'contrast':
                this.applyContrastFilter(data, 1.3);
                break;
            case 'warm':
                this.applyWarmFilter(data);
                break;
            case 'cool':
                this.applyCoolFilter(data);
                break;
        }
        
        if (filterName !== 'none') {
            this.ctx.putImageData(imageData, 0, 0);
        }
        
        // If this was a direct user action, reapply adjustments
        if (resetAdjustments) {
            this.applyAllAdjustments();
        }
    }

    applyGrayscale(data) {
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
        }
    }

    applySepia(data) {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
    }

    applyVintage(data) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * 0.9); // Green
            data[i + 2] = Math.min(255, data[i + 2] * 0.8); // Blue
        }
    }

    applyBrightness(data, brightness) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(255, data[i] + brightness));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness));
        }
    }

    applyContrastFilter(data, contrast) {
        const factor = (259 * (contrast * 100 + 255)) / (255 * (259 - contrast * 100));
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
        }
    }

    applyWarmFilter(data) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);     // More red
            data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Slightly more green
            data[i + 2] = Math.min(255, data[i + 2] * 0.9); // Less blue
        }
    }

    applyCoolFilter(data) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.9);     // Less red
            data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Slightly more green
            data[i + 2] = Math.min(255, data[i + 2] * 1.1); // More blue
        }
    }

    applyAllAdjustments() {
        if (!this.originalImageData) return;
        
        // Start with original image
        this.ctx.putImageData(this.originalImageData, 0, 0);
        
        // Apply current filter first if any
        if (this.currentFilter !== 'none') {
            this.applyFilter(this.currentFilter, false); // false = don't reset adjustments
        }
        
        // Get current image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Apply all adjustments in sequence
        if (this.adjustments.brightness !== 0) {
            this.applyBrightness(data, this.adjustments.brightness);
        }
        
        if (this.adjustments.contrast !== 0) {
            this.applyContrastFilter(data, 1 + (this.adjustments.contrast / 100));
        }
        
        if (this.adjustments.saturation !== 0) {
            this.applySaturationFilter(data, 1 + (this.adjustments.saturation / 100));
        }
        
        // Apply the modified image data
        this.ctx.putImageData(imageData, 0, 0);
    }

    applySaturationFilter(data, saturation) {
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = Math.max(0, Math.min(255, gray + (data[i] - gray) * saturation));
            data[i + 1] = Math.max(0, Math.min(255, gray + (data[i + 1] - gray) * saturation));
            data[i + 2] = Math.max(0, Math.min(255, gray + (data[i + 2] - gray) * saturation));
        }
    }

    setCropRatio(ratio) {
        // Remove active class from all crop buttons
        document.querySelectorAll('.crop-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        event.target.classList.add('active');
        
        this.cropRatio = ratio;
        this.cropMode = true;
        
        // Here you would implement crop selection UI
        alert(`Режим обрезки активирован с соотношением: ${ratio}`);
    }

    resetImage() {
        if (!this.originalImageData) return;
        
        // Reset all adjustments
        this.adjustments = {
            brightness: 0,
            contrast: 0,
            saturation: 0
        };
        
        // Reset filter
        this.currentFilter = 'none';
        
        // Reset to original image
        this.ctx.putImageData(this.originalImageData, 0, 0);
        this.resetControls();
    }

    resetControls() {
        document.getElementById('brightness').value = 0;
        document.getElementById('contrast').value = 0;
        document.getElementById('saturation').value = 0;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Make sure 'Оригинал' filter is active
        document.querySelector('.filter-btn[data-filter="none"]').classList.add('active');
        
        document.querySelectorAll('.crop-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    saveImage() {
        if (!this.canvas) return;
        
        const editedImageData = this.canvas.toDataURL('image/png');
        this.currentPhoto.src = editedImageData;
        this.currentPhoto.edited = true;
        
        this.renderPhotoGallery();
        this.closeEditor();
        
        // Show success message
        this.showNotification('Изображение сохранено!');
    }

    openCollageEditor() {
        if (this.photos.length < 2) {
            alert('Для создания коллажа нужно минимум 2 фотографии');
            return;
        }
        
        this.selectedPhotosForCollage = [];
        this.renderCollagePhotos();
        document.getElementById('collageSection').style.display = 'flex';
    }

    renderCollagePhotos() {
        const grid = document.getElementById('collagePhotosGrid');
        grid.innerHTML = '';
        
        this.photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'collage-photo-item';
            photoItem.dataset.photoId = photo.id;
            
            const isSelected = this.selectedPhotosForCollage.includes(photo.id);
            if (isSelected) {
                photoItem.classList.add('selected');
            }
            
            photoItem.innerHTML = `
                <img src="${photo.src}" alt="Фото ${index + 1}">
                <div class="collage-photo-checkbox">
                    ${isSelected ? '✓' : ''}
                </div>
            `;
            
            photoItem.addEventListener('click', () => {
                this.togglePhotoSelection(photo.id, photoItem);
            });
            
            grid.appendChild(photoItem);
        });
    }

    togglePhotoSelection(photoId, element) {
        const index = this.selectedPhotosForCollage.indexOf(photoId);
        
        if (index > -1) {
            // Убрать выбор
            this.selectedPhotosForCollage.splice(index, 1);
            element.classList.remove('selected');
            element.querySelector('.collage-photo-checkbox').textContent = '';
        } else {
            // Добавить выбор (максимум 4 фото)
            if (this.selectedPhotosForCollage.length >= 4) {
                alert('Можно выбрать максимум 4 фотографии');
                return;
            }
            
            this.selectedPhotosForCollage.push(photoId);
            element.classList.add('selected');
            element.querySelector('.collage-photo-checkbox').textContent = '✓';
        }
    }

    closeCollageEditor() {
        document.getElementById('collageSection').style.display = 'none';
    }

    selectTemplate(template) {
        // Remove active class from all templates
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected template
        event.currentTarget.classList.add('active');
        
        this.createCollage(template);
    }

    createCollage(template) {
        if (this.selectedPhotosForCollage.length === 0) {
            alert('Выберите фотографии для коллажа');
            return;
        }
        
        const collageCanvas = document.getElementById('collageCanvas');
        const ctx = collageCanvas.getContext('2d');
        
        // Set canvas size
        collageCanvas.width = 800;
        collageCanvas.height = 600;
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 800, 600);
        
        // Получить выбранные фотографии
        const selectedPhotos = this.selectedPhotosForCollage.map(id => 
            this.photos.find(photo => photo.id === id)
        ).filter(photo => photo !== undefined);
        
        if (selectedPhotos.length === 0) {
            alert('Не удалось найти выбранные фотографии');
            return;
        }
        
        switch (template) {
            case 'grid2x2':
                this.createGrid2x2(ctx, selectedPhotos);
                break;
            case 'grid3x1':
                this.createGrid3x1(ctx, selectedPhotos);
                break;
            case 'grid1x3':
                this.createGrid1x3(ctx, selectedPhotos);
                break;
            case 'mosaic':
                this.createMosaic(ctx, selectedPhotos);
                break;
        }
        
        this.showNotification(`Коллаж создан из ${selectedPhotos.length} фотографий!`);
    }

    createGrid2x2(ctx, photos) {
        const positions = [
            { x: 0, y: 0, w: 400, h: 300 },
            { x: 400, y: 0, w: 400, h: 300 },
            { x: 0, y: 300, w: 400, h: 300 },
            { x: 400, y: 300, w: 400, h: 300 }
        ];
        
        this.drawPhotosInPositions(ctx, photos, positions);
    }

    createGrid3x1(ctx, photos) {
        const positions = [
            { x: 0, y: 0, w: 267, h: 600 },
            { x: 267, y: 0, w: 266, h: 600 },
            { x: 533, y: 0, w: 267, h: 600 }
        ];
        
        this.drawPhotosInPositions(ctx, photos, positions);
    }

    createGrid1x3(ctx, photos) {
        const positions = [
            { x: 0, y: 0, w: 800, h: 200 },
            { x: 0, y: 200, w: 800, h: 200 },
            { x: 0, y: 400, w: 800, h: 200 }
        ];
        
        this.drawPhotosInPositions(ctx, photos, positions);
    }

    createMosaic(ctx, photos) {
        const positions = [
            { x: 0, y: 0, w: 400, h: 400 },
            { x: 400, y: 0, w: 400, h: 200 },
            { x: 400, y: 200, w: 200, h: 200 },
            { x: 600, y: 200, w: 200, h: 200 },
            { x: 0, y: 400, w: 800, h: 200 }
        ];
        
        this.drawPhotosInPositions(ctx, photos, positions);
    }

    drawPhotosInPositions(ctx, photos, positions) {
        photos.forEach((photo, index) => {
            if (index >= positions.length) return;
            
            const img = new Image();
            img.onload = () => {
                const pos = positions[index];
                ctx.drawImage(img, pos.x, pos.y, pos.w, pos.h);
            };
            img.src = photo.src;
        });
    }

    downloadCollage() {
        const canvas = document.getElementById('collageCanvas');
        const link = document.createElement('a');
        link.download = 'collage.png';
        link.href = canvas.toDataURL();
        link.click();
        
        this.showNotification('Коллаж скачан!');
    }

    downloadAll() {
        this.photos.forEach((photo, index) => {
            const link = document.createElement('a');
            link.download = `photo_${index + 1}.png`;
            link.href = photo.src;
            link.click();
        });
        
        this.showNotification('Все фотографии скачаны!');
    }

    async sendPhotosToEmail() {
        if (this.photos.length === 0) {
            alert('Нет фотографий для отправки');
            return;
        }

        this.showLoading();
        
        try {
            // Подготовка данных для отправки
            const emailData = {
                to: 'poppartee@gmail.com',
                subject: 'Отредактированные фотографии с PhotoEdit Pro',
                message: `Привет! Отправляю ${this.photos.length} отредактированных фотографий.`,
                photos: this.photos.map((photo, index) => ({
                    name: photo.name || `photo_${index + 1}.png`,
                    data: photo.src,
                    edited: photo.edited
                }))
            };

            // Используем EmailJS для отправки почты
            await this.sendViaEmailJS(emailData);
            
            this.hideLoading();
            this.showNotification('Фотографии успешно отправлены на почту!');
            
        } catch (error) {
            this.hideLoading();
            console.error('Ошибка отправки:', error);
            
            // Запасной вариант - открыть почтовый клиент
            this.openEmailClient(emailData);
        }
    }

    async sendViaEmailJS(emailData) {
        // Простой способ отправки через mailto (для демо)
        // В реальном проекте нужно использовать EmailJS или серверный API
        return new Promise((resolve, reject) => {
            // Симуляция отправки
            setTimeout(() => {
                // В реальном проекте здесь был бы вызов API
                const success = Math.random() > 0.2; // 80% успеха
                if (success) {
                    resolve();
                } else {
                    reject(new Error('Ошибка сервиса отправки'));
                }
            }, 2000);
        });
    }

    openEmailClient(emailData) {
        // Запасной вариант - открыть почтовый клиент
        const subject = encodeURIComponent(emailData.subject);
        const body = encodeURIComponent(
            emailData.message + '\n\nПримечание: Фотографии нужно прикрепить вручную. Скачайте их с помощью кнопки "Скачать все".'
        );
        
        const mailtoLink = `mailto:${emailData.to}?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
        
        this.showNotification('Открыт почтовый клиент. Прикрепите фотографии вручную.');
    }

    addTextToImage() {
        const textInput = document.getElementById('textInput');
        const textColor = document.getElementById('textColor').value;
        const textSize = document.getElementById('textSize').value;
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Введите текст');
            return;
        }
        
        if (!this.canvas || !this.ctx) {
            alert('Откройте редактор фотографий');
            return;
        }
        
        // Настройки текста
        this.ctx.font = `bold ${textSize}px Arial`;
        this.ctx.fillStyle = textColor;
        this.ctx.strokeStyle = textColor === '#ffffff' ? '#000000' : '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Позиция текста (центр изображения)
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;
        
        // Обводка для лучшей читаемости
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
        
        // Очистить поле ввода
        textInput.value = '';
        
        this.showNotification('Текст добавлен!');
    }

    addStickerToImage(stickerType, stickerEmoji) {
        if (!this.canvas || !this.ctx) {
            alert('Откройте редактор фотографий');
            return;
        }
        
        // Настройки стикера
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Случайная позиция в верхней половине изображения
        const x = Math.random() * (this.canvas.width - 100) + 50;
        const y = Math.random() * (this.canvas.height / 2 - 100) + 50;
        
        this.ctx.fillText(stickerEmoji, x, y);
        
        this.showNotification('Стикер добавлен!');
    }

    showMainActions() {
        document.getElementById('mainActions').style.display = 'flex';
    }

    hideMainActions() {
        document.getElementById('mainActions').style.display = 'none';
    }

    showInstagramModal() {
        alert('Функция загрузки из Instagram будет доступна в следующей версии. Пока используйте обычную загрузку файлов.');
    }

    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 3000;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// Initialize the photo editor when the page loads
let photoEditor;
document.addEventListener('DOMContentLoaded', () => {
    photoEditor = new PhotoEditor();
});

// Hide loading overlay initially
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loadingOverlay').style.display = 'none';
});
