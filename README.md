# carcomparisonai.com

Side-by-side car comparisons with real EPA / NHTSA data and 5-year cost of ownership.

- Стек: Astro 5 + React-острова + Tailwind, статическая генерация (страницы произвольных пар сравнений рендерятся на сервере), хостинг Vercel.
- План развития: [carcomparisonai-plan.md](./carcomparisonai-plan.md)
- Дизайн и архитектура: [DESIGN.md](./DESIGN.md)
- Запуск и деплой: [SETUP.md](./SETUP.md)

Быстрый старт: `npm install && npm run dev` → http://localhost:3000

Важно: MSRP и часть спеков в `data/vehicles.json` - ориентировочные seed-данные; MPG обновляется из EPA скриптом `npm run fetch-data`. Перед публикацией сверь MSRP с сайтами производителей.
