document.addEventListener('DOMContentLoaded', function() {
    // Анимация для бегущей строки
    const marqueeContent = document.querySelector('.marquee-content');
    const marqueeText = document.querySelector('.marquee-text');
    
    // Клонируем текст для бегущей строки
    const clone = marqueeText.cloneNode(true);
    marqueeContent.appendChild(clone);
    
    // Плавное появление элементов при загрузке
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.main-text, .photo-container, .info-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Изначальные стили для анимации
    const elementsToAnimate = document.querySelectorAll('.main-text, .photo-container, .info-card');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Запуск анимации при загрузке
    window.addEventListener('load', () => {
        setTimeout(() => {
            animateOnScroll();
        }, 300);
    });
    
    // Анимация при скролле
    window.addEventListener('scroll', animateOnScroll);
    
    // Интерактивность для карточек информации
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Эффект параллакса для основного фото
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const photo = document.querySelector('.couple-photo');
        if (photo) {
            photo.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    });
    
    // Добавляем сердечки при клике
    document.addEventListener('click', function(e) {
        // Создаем сердечко только если клик не на интерактивных элементах
        if (!e.target.closest('.info-card') && !e.target.closest('footer')) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = `${e.clientX}px`;
            heart.style.top = `${e.clientY}px`;
            heart.style.fontSize = '24px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.animation = 'floatUp 1.5s ease-out forwards';
            
            document.body.appendChild(heart);
            
            // Удаляем сердечко после анимации
            setTimeout(() => {
                heart.remove();
            }, 1500);
        }
    });
    
    // Добавляем стили для анимации сердечек
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
});

// Таймер обратного отсчета
function updateCountdown() {
    const weddingDate = new Date('2026-07-20T00:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;
    
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Обновляем таймер каждую секунду
updateCountdown();
setInterval(updateCountdown, 1000);

// ========== ТОЛЬКО ЭТОТ БЛОК ДОБАВЛЕН ==========
// Конфигурация Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtqdDsUo4_Kek9rWjFw7LXrgkw22qFWzPGByt6b3Mm_tQ6Bk6ayeXWPKtZYprRaEf5mA/exec'; // ЗАМЕНИТЕ НА ВАШ URL

// Обработка формы с отправкой в Google Sheets
const guestForm = document.querySelector('.guest-form');
if (guestForm) {
    guestForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Показываем индикатор загрузки
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            // Отправляем данные в Google Sheets
            const params = new URLSearchParams();
            params.append('name', data.fullname);
            params.append('phone', data.phone);
            
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: params
            });
            
            alert(`Спасибо, ${data.fullname}! Ваш ответ отправлен.`);
            
            // Сбрасываем форму
            this.reset();
            
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
        } finally {
            // Возвращаем кнопку в исходное состояние
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
