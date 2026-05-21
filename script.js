document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Loading Animation
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1500);

    // 2. Navbar Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-active');
            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars');
                menuIcon.classList.toggle('fa-times');
            }
        });
    }

    // Fecha o menu ao clicar em um link (Mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            document.body.classList.remove('menu-active');
            if (menuIcon) {
                menuIcon.classList.add('fa-bars');
                menuIcon.classList.remove('fa-times');
            }
        });
    });

    // 4. Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger initial

    // 5. Blog Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            blogCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 6. Scroll Top Button
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 7. Barra de Progresso de Leitura (Páginas de Artigo)
    const readingProgressBar = document.getElementById('readingProgressBar');
    if (readingProgressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            readingProgressBar.style.width = scrolled + "%";
        });
    }

    // 8. Sistema de Comentários LocalStorage
    const commentDisplay = document.getElementById('comments-display');
    const submitBtn = document.getElementById('submit-comment');
    const pageId = window.location.pathname; // Identificador único por artigo

    const loadComments = () => {
        if (!commentDisplay) return;
        const comments = JSON.parse(localStorage.getItem('comments_' + pageId)) || [];
        commentDisplay.innerHTML = '';
        comments.forEach((c, index) => {
            const div = document.createElement('div');
            div.className = 'comment-item';
            div.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${c.name}</span>
                    <span class="comment-date">${c.date}</span>
                </div>
                <p class="comment-text">${c.text}</p>
                <div class="comment-actions">
                    <button onclick="editComment(${index})"><i class="fas fa-edit"></i> Editar</button>
                    <button class="delete-btn" onclick="deleteComment(${index})"><i class="fas fa-trash"></i> Excluir</button>
                        <button class="like-btn" onclick="likeComment(${index})">
                            <i class="fas fa-thumbs-up"></i> <span class="like-count">${c.likes || 0}</span>
                        </button>
                </div>
            `;
            commentDisplay.appendChild(div);
        });
    };

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('comment-name');
            const textInput = document.getElementById('comment-text');
            if (!nameInput.value || !textInput.value) return alert('Preencha todos os campos!');

            const comments = JSON.parse(localStorage.getItem('comments_' + pageId)) || [];
            comments.push({
                name: nameInput.value,
                text: textInput.value,
                date: new Date().toLocaleDateString('pt-BR'),
                likes: 0 // Inicializa com 0 likes
            });
            localStorage.setItem('comments_' + pageId, JSON.stringify(comments));
            textInput.value = '';
            loadComments();
        });
    }

    window.deleteComment = (index) => {
        if (!confirm('Deseja excluir este comentário?')) return;
        const comments = JSON.parse(localStorage.getItem('comments_' + pageId));
        comments.splice(index, 1);
        localStorage.setItem('comments_' + pageId, JSON.stringify(comments));
        loadComments();
    };

    window.editComment = (index) => {
        const comments = JSON.parse(localStorage.getItem('comments_' + pageId));
        const newText = prompt('Edite seu comentário:', comments[index].text);
        if (newText) {
            comments[index].text = newText;
            localStorage.setItem('comments_' + pageId, JSON.stringify(comments));
            loadComments();
        }
    };

    window.likeComment = (index) => {
        const comments = JSON.parse(localStorage.getItem('comments_' + pageId)) || [];
        if (comments[index]) {
            comments[index].likes = (comments[index].likes || 0) + 1;
            localStorage.setItem('comments_' + pageId, JSON.stringify(comments));
            loadComments();
        }
    };

    loadComments();

    // 9. Lógica de Compartilhamento Automático
    const shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            if (btn.classList.contains('linkedin')) window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
            if (btn.classList.contains('whatsapp')) window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank');
            if (btn.classList.contains('twitter')) window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
        });
    });

    // 10. Rastreamento de Cliques no WhatsApp (Google Analytics)
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contato_whatsapp', {
                    'event_category': 'conversao',
                    'event_label': 'Botão WhatsApp',
                    'value': 1
                });
            }
        });
    });
});
