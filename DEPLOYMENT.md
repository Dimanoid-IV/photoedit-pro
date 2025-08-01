# 🚀 Деплой PhotoEdit Pro на DigitalOcean

## Вариант 1: DigitalOcean App Platform (Рекомендуется)

### Подготовка к деплою:

1. **Создайте аккаунт на GitHub** (если еще нет)
2. **Создайте новый репозиторий** на GitHub с названием `photoedit-pro`
3. **Загрузите файлы проекта** в репозиторий

### Загрузка файлов на GitHub:

```bash
# В папке с проектом выполните:
git init
git add .
git commit -m "Initial commit: PhotoEdit Pro CPA site"
git branch -M main
git remote add origin https://github.com/ВАШ_USERNAME/photoedit-pro.git
git push -u origin main
```

### Деплой через DigitalOcean App Platform:

1. **Зайдите на** [DigitalOcean.com](https://digitalocean.com)
2. **Создайте аккаунт** или войдите в существующий
3. **Перейдите в App Platform** (Apps → Create App)
4. **Выберите GitHub** как источник
5. **Подключите ваш репозиторий** `photoedit-pro`
6. **Настройте деплой:**
   - **Type:** Static Site
   - **Branch:** main
   - **Source Directory:** / (корень)
   - **Build Command:** (оставить пустым)
   - **Output Directory:** / (корень)

7. **Выберите план:** Basic ($0/месяц для статических сайтов)
8. **Нажмите "Create Resources"**

### После деплоя:
- Ваш сайт будет доступен по адресу: `https://your-app-name.ondigitalocean.app`
- Автоматические обновления при изменениях в GitHub

---

## Вариант 2: DigitalOcean Droplet + Nginx

### Создание Droplet:

1. **Create → Droplets**
2. **Выберите образ:** Ubuntu 22.04 LTS
3. **Размер:** Basic ($4/месяц)
4. **Регион:** выберите ближайший к вашим пользователям
5. **SSH ключи:** добавьте или создайте новый
6. **Создайте Droplet**

### Настройка сервера:

```bash
# Подключитесь к серверу
ssh root@YOUR_DROPLET_IP

# Обновите систему
apt update && apt upgrade -y

# Установите Nginx
apt install nginx -y

# Создайте директорию для сайта
mkdir -p /var/www/photoedit-pro

# Настройте Nginx
nano /etc/nginx/sites-available/photoedit-pro
```

### Конфигурация Nginx:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    
    root /var/www/photoedit-pro;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Кэширование статических файлов
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Активация сайта:

```bash
# Создайте символическую ссылку
ln -s /etc/nginx/sites-available/photoedit-pro /etc/nginx/sites-enabled/

# Проверьте конфигурацию
nginx -t

# Перезапустите Nginx
systemctl restart nginx

# Загрузите файлы сайта
# Используйте SCP, SFTP или Git для загрузки файлов в /var/www/photoedit-pro
```

---

## Вариант 3: Быстрый деплой через SCP

Если у вас уже есть Droplet:

```bash
# Загрузите файлы напрямую
scp -r /path/to/photo-editor/* root@YOUR_DROPLET_IP:/var/www/photoedit-pro/
```

---

## 🔧 Дополнительные настройки

### SSL сертификат (Let's Encrypt):

```bash
# Установите Certbot
apt install certbot python3-certbot-nginx -y

# Получите SSL сертификат
certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

### Настройка домена:

1. **Купите домен** (например, на Namecheap, GoDaddy)
2. **Настройте DNS записи:**
   - A запись: `@` → IP_АДРЕС_DROPLET
   - A запись: `www` → IP_АДРЕС_DROPLET

### Мониторинг и аналитика:

Добавьте в `index.html` перед `</head>`:

```html
<!-- Google Analytics (замените GA_MEASUREMENT_ID) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Yandex.Metrica -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(COUNTER_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });
</script>
```

---

## 💰 Стоимость хостинга:

- **App Platform (статический сайт):** $0/месяц
- **Basic Droplet:** $4/месяц
- **Домен:** $10-15/год
- **SSL сертификат:** Бесплатно (Let's Encrypt)

---

## 🎯 Рекомендация:

**Для начала используйте App Platform** - это бесплатно, просто и автоматически обновляется. Когда сайт начнет приносить доход, можете перейти на Droplet для большего контроля.

## 📞 Поддержка:

Если возникнут вопросы при деплое, обращайтесь к документации DigitalOcean или в их поддержку - они очень отзывчивые!
