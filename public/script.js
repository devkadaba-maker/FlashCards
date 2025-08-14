// Flashcard App - Frontend JavaScript
class FlashcardApp {
    constructor() {
        this.flashcards = [];
        this.currentCardIndex = 0;
        this.isStudying = false;
        this.currentFilters = {
            category: '',
            difficulty: ''
        };
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadFlashcards();
        this.loadCategories();
        this.updateUI();
    }

    // Event Binding
    bindEvents() {
        // Study mode controls
        document.getElementById('startBtn').addEventListener('click', () => this.startStudying());
        document.getElementById('flipBtn').addEventListener('click', () => this.flipCard());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextCard());
        
        // Management controls
        document.getElementById('addCardBtn').addEventListener('click', () => this.showAddModal());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshFlashcards());
        
        // Filter controls
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.filterFlashcards();
        });
        
        document.getElementById('difficultyFilter').addEventListener('change', (e) => {
            this.currentFilters.difficulty = e.target.value;
            this.filterFlashcards();
        });
        
        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal('cardModal'));
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideModal('cardModal'));
        document.getElementById('cardForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Delete modal controls
        document.getElementById('closeDeleteModal').addEventListener('click', () => this.hideModal('deleteModal'));
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.hideModal('deleteModal'));
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    // API Methods
    async loadFlashcards() {
        try {
            const response = await fetch('/api/flashcards');
            if (!response.ok) throw new Error('Failed to fetch flashcards');
            
            this.flashcards = await response.json();
            this.renderFlashcardsList();
        } catch (error) {
            this.showToast('Error loading flashcards: ' + error.message, 'error');
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            
            const categories = await response.json();
            this.populateCategoryFilter(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async createFlashcard(flashcardData) {
        try {
            const response = await fetch('/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flashcardData)
            });
            
            if (!response.ok) throw new Error('Failed to create flashcard');
            
            const newFlashcard = await response.json();
            this.flashcards.unshift(newFlashcard);
            this.renderFlashcardsList();
            this.showToast('Flashcard created successfully!', 'success');
            return newFlashcard;
        } catch (error) {
            this.showToast('Error creating flashcard: ' + error.message, 'error');
            throw error;
        }
    }

    async updateFlashcard(id, flashcardData) {
        try {
            const response = await fetch(`/api/flashcards/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flashcardData)
            });
            
            if (!response.ok) throw new Error('Failed to update flashcard');
            
            const updatedFlashcard = await response.json();
            const index = this.flashcards.findIndex(card => card._id === id);
            if (index !== -1) {
                this.flashcards[index] = updatedFlashcard;
            }
            this.renderFlashcardsList();
            this.showToast('Flashcard updated successfully!', 'success');
            return updatedFlashcard;
        } catch (error) {
            this.showToast('Error updating flashcard: ' + error.message, 'error');
            throw error;
        }
    }

    async deleteFlashcard(id) {
        try {
            const response = await fetch(`/api/flashcards/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete flashcard');
            
            this.flashcards = this.flashcards.filter(card => card._id !== id);
            this.renderFlashcardsList();
            this.showToast('Flashcard deleted successfully!', 'success');
        } catch (error) {
            this.showToast('Error deleting flashcard: ' + error.message, 'error');
            throw error;
        }
    }

    async updateReviewCount(id) {
        try {
            await fetch(`/api/flashcards/${id}/review`, {
                method: 'PATCH'
            });
        } catch (error) {
            console.error('Error updating review count:', error);
        }
    }

    // Study Mode Methods
    startStudying() {
        if (this.flashcards.length === 0) {
            this.showToast('No flashcards available. Please add some first!', 'info');
            return;
        }

        this.isStudying = true;
        this.currentCardIndex = 0;
        this.showCurrentCard();
        this.updateStudyControls();
        this.updateProgress();
    }

    showCurrentCard() {
        const card = this.flashcards[this.currentCardIndex];
        if (!card) return;

        document.getElementById('cardFront').querySelector('.card-text').textContent = card.question;
        document.getElementById('cardBack').querySelector('.card-text').textContent = card.answer;
        
        // Reset card flip state
        document.getElementById('currentCard').classList.remove('flipped');
    }

    flipCard() {
        const card = document.getElementById('currentCard');
        card.classList.toggle('flipped');
    }

    async nextCard() {
        // Update review count for current card
        const currentCard = this.flashcards[this.currentCardIndex];
        if (currentCard) {
            await this.updateReviewCount(currentCard._id);
        }

        this.currentCardIndex++;
        
        if (this.currentCardIndex >= this.flashcards.length) {
            // Study session complete
            this.isStudying = false;
            this.showToast('Study session complete! Great job!', 'success');
            this.updateStudyControls();
            this.updateProgress();
            return;
        }

        this.showCurrentCard();
        this.updateProgress();
    }

    updateStudyControls() {
        const startBtn = document.getElementById('startBtn');
        const flipBtn = document.getElementById('flipBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (this.isStudying) {
            startBtn.style.display = 'none';
            flipBtn.disabled = false;
            nextBtn.disabled = false;
        } else {
            startBtn.style.display = 'inline-flex';
            flipBtn.disabled = true;
            nextBtn.disabled = true;
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (this.flashcards.length === 0) {
            progressFill.style.width = '0%';
            progressText.textContent = '0 / 0 cards';
            return;
        }

        const progress = this.isStudying ? 
            ((this.currentCardIndex + 1) / this.flashcards.length) * 100 : 0;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `${this.currentCardIndex + 1} / ${this.flashcards.length} cards`;
    }

    // UI Methods
    renderFlashcardsList() {
        const container = document.getElementById('flashcardsList');
        const filteredCards = this.getFilteredFlashcards();
        
        if (filteredCards.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No flashcards found. ${this.flashcards.length === 0 ? 'Add your first flashcard to get started!' : 'Try adjusting your filters.'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredCards.map(card => this.createFlashcardHTML(card)).join('');
        
        // Re-bind event listeners for the new elements
        this.bindFlashcardEvents();
    }

    createFlashcardHTML(card) {
        const createdAt = new Date(card.createdAt).toLocaleDateString();
        const lastReviewed = card.lastReviewed ? new Date(card.lastReviewed).toLocaleDateString() : 'Never';
        
        return `
            <div class="flashcard-item" data-id="${card._id}">
                <div class="flashcard-header">
                    <div class="flashcard-meta">
                        <span class="meta-item">
                            <i class="fas fa-tag"></i>
                            ${card.category}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-signal"></i>
                            ${card.difficulty}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-eye"></i>
                            ${card.reviewCount} reviews
                        </span>
                    </div>
                    <div class="flashcard-actions">
                        <button class="btn btn-secondary btn-small edit-btn" data-id="${card._id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-small delete-btn" data-id="${card._id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="flashcard-content">
                    <div class="flashcard-question">${this.escapeHtml(card.question)}</div>
                    <div class="flashcard-answer">${this.escapeHtml(card.answer)}</div>
                </div>
                <div class="flashcard-meta">
                    <span class="meta-item">
                        <i class="fas fa-calendar-plus"></i>
                        Created: ${createdAt}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-calendar-check"></i>
                        Last reviewed: ${lastReviewed}
                    </span>
                </div>
            </div>
        `;
    }

    bindFlashcardEvents() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.edit-btn').dataset.id;
                this.showEditModal(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.delete-btn').dataset.id;
                this.showDeleteModal(id);
            });
        });
    }

    // Modal Methods
    showAddModal() {
        document.getElementById('modalTitle').textContent = 'Add New Flashcard';
        document.getElementById('cardForm').reset();
        document.getElementById('cardForm').dataset.mode = 'add';
        document.getElementById('cardModal').classList.add('show');
    }

    showEditModal(id) {
        const card = this.flashcards.find(c => c._id === id);
        if (!card) return;

        document.getElementById('modalTitle').textContent = 'Edit Flashcard';
        document.getElementById('question').value = card.question;
        document.getElementById('answer').value = card.answer;
        document.getElementById('category').value = card.category;
        document.getElementById('difficulty').value = card.difficulty;
        
        document.getElementById('cardForm').dataset.mode = 'edit';
        document.getElementById('cardForm').dataset.editId = id;
        document.getElementById('cardModal').classList.add('show');
    }

    showDeleteModal(id) {
        const card = this.flashcards.find(c => c._id === id);
        if (!card) return;

        document.getElementById('deletePreview').textContent = `"${card.question}"`;
        document.getElementById('deleteModal').dataset.deleteId = id;
        document.getElementById('deleteModal').classList.add('show');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    // Form Handling
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const flashcardData = {
            question: formData.get('question').trim(),
            answer: formData.get('answer').trim(),
            category: formData.get('category').trim() || 'General',
            difficulty: formData.get('difficulty')
        };

        if (!flashcardData.question || !flashcardData.answer) {
            this.showToast('Question and answer are required!', 'error');
            return;
        }

        try {
            const mode = e.target.dataset.mode;
            if (mode === 'edit') {
                const id = e.target.dataset.editId;
                await this.updateFlashcard(id, flashcardData);
            } else {
                await this.createFlashcard(flashcardData);
            }
            
            this.hideModal('cardModal');
            e.target.reset();
        } catch (error) {
            // Error already shown in the API method
        }
    }

    async confirmDelete() {
        const modal = document.getElementById('deleteModal');
        const id = modal.dataset.deleteId;
        
        try {
            await this.deleteFlashcard(id);
            this.hideModal('deleteModal');
        } catch (error) {
            // Error already shown in the API method
        }
    }

    // Utility Methods
    getFilteredFlashcards() {
        return this.flashcards.filter(card => {
            const categoryMatch = !this.currentFilters.category || card.category === this.currentFilters.category;
            const difficultyMatch = !this.currentFilters.difficulty || card.difficulty === this.currentFilters.difficulty;
            return categoryMatch && difficultyMatch;
        });
    }

    filterFlashcards() {
        this.renderFlashcardsList();
    }

    async refreshFlashcards() {
        await this.loadFlashcards();
        this.showToast('Flashcards refreshed!', 'success');
    }

    populateCategoryFilter(categories) {
        const select = document.getElementById('categoryFilter');
        const currentValue = select.value;
        
        // Clear existing options except "All Categories"
        select.innerHTML = '<option value="">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
        
        // Restore selected value if it still exists
        if (categories.includes(currentValue)) {
            select.value = currentValue;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<div class="toast-message">${message}</div>`;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    updateUI() {
        this.updateProgress();
        this.updateStudyControls();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});
