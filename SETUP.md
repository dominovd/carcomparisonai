# Запуск и деплой: шаг за шагом

## 1. Локальный запуск (5 минут)

Нужен Node.js 20+ (проверь: `node -v`; если нет - https://nodejs.org).

```bash
cd ~/Documents/Claude/Projects/carcomparisonai.com
npm install
npm run dev
```

Открой http://localhost:3000 - увидишь главную и 6 страниц сравнения.

## 2. Git и GitHub

```bash
git init
git add .
git commit -m "MVP: comparison pages with TCO"
```

Создай пустой репозиторий на https://github.com/new (имя `carcomparisonai`, БЕЗ README), затем:

```bash
git remote add origin https://github.com/ТВОЙ_ЛОГИН/carcomparisonai.git
git branch -M main
git push -u origin main
```

## 3. Vercel

1. Зайди на https://vercel.com → Add New → Project.
2. Import репозиторий `carcomparisonai` (дай Vercel доступ к GitHub, если спросит).
3. Framework определится сам (Next.js). Ничего не меняй → Deploy.
4. Через ~1 минуту получишь URL вида `carcomparisonai.vercel.app`.

Переменная окружения (Settings → Environment Variables):
`NEXT_PUBLIC_SITE_URL` = `https://carcomparisonai.com` - нужна для sitemap и canonical.

## 4. Домен carcomparisonai.com

В Vercel: Project → Settings → Domains → Add → `carcomparisonai.com`.
Vercel покажет DNS-записи - добавь их у регистратора домена:
- A-запись `@` → `76.76.21.21`
- CNAME `www` → `cname.vercel-dns.com`

SSL выпустится автоматически. Проверь, что `www` редиректит на корень (Vercel предложит сам).

## 5. Сразу после деплоя

1. Google Search Console: https://search.google.com/search-console → добавь домен → подтверди через DNS → отправь sitemap: `https://carcomparisonai.com/sitemap.xml`.
2. Bing Webmaster Tools - то же самое (импортирует из GSC в один клик).
3. Проверь страницы: открой `/compare/honda-cr-v-vs-toyota-rav4`, посмотри title во вкладке.

## 6. Рабочий цикл дальше

Любое изменение: правишь файлы → `git add . && git commit -m "..." && git push` → Vercel задеплоит сам за минуту.

Обновить данные MPG из EPA: `npm run fetch-data` → закоммитить изменённый `data/vehicles.json`.

Добавить новое сравнение: добавь модель в `data/vehicles.json` + пару с вердиктом в `comparisons` в `lib/vehicles.ts` → пуш. Страница и sitemap сгенерятся автоматически.
