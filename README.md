# GURPS RPM Calculator

A Vue 3 web application for calculating energy costs for **Ritual Path Magic (RPM)** spells in the GURPS tabletop RPG system.

> ⚠️ **Disclaimer:** This material is not official and is not endorsed by Steve Jackson Games. This is a fan-created tool for personal use.

---

## English

### Features

- **Spell Effects** — Configure Greater/Lesser effects for Sense, Strengthen, Restore, Control, Destroy, Create, Transform
- **Damage/Healing** — Calculate energy for various damage types (burn, cor, cr, cut, fat, heal, imp, pi, etc.) with modifiers
- **Traits** — Add and modify spell traits with percentage or flat-point modifiers
- **Spell Features:**
  - Duration
  - Subject Weight
  - Range (including Long Distance)
  - Area of Effect (AoE)
  - Summoned/Controlled modifier
  - Bestows Bonus/Penalty
- **Live Preview** — Real-time Markdown and JSON* output with copy-to-clipboard
- **Trait Library** — Built-in GURPS Basic Set traits (`.adq` format from [GCS](https://github.com/richardwilkes/gcs))

> *WIP — The trait format may not display all information completely.

### Tech Stack

| Technology | Purpose |
|------------|---------|
| Vue 3 | Frontend framework (Composition API) |
| Vite 7 | Build tool and dev server |
| Pinia 3 | State management |
| Vue Router 4 | Client-side routing |

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── views/           # Route components (RPM, IncantationMagic)
├── components/      # Reusable UI components
├── stores/          # Pinia stores (energy, fields)
├── assets/          # Static assets (SVG icons)
├── main.js          # App entry point
└── App.vue          # Root component
```

---

## Русский

### Возможности

- **Эффекты заклинаний** — Настройка Greater/Lesser эффектов
- **Урон/Лечение** — Расчёт энергии для различных типов урона (burn, cor, cr, cut, fat, heal, imp, pi и др.) с модификаторами
- **Трейты** — Добавление и модификация трейтов заклинаний с процентными или плоскими модификаторами
- **RPM-Особенности заклинаний:**
  - Длительность (Duration)
  - Вес объекта (Subject Weight)
  - Дистанция (включая Long Distance)
  - Область действия (Area of Effect)
  - Модификатор призванного/контролируемого
  - Наделение бонусом/штрафом (Bestows Bonus/Penalty)
- **Предпросмотр** — Вывод в формате Markdown и JSON* с копированием в буфер
- **Библиотека трейтов** — Встроенные трейты из GURPS Basic Set (формат `.adq` из [GCS](https://github.com/richardwilkes/gcs))

> *Дорабатывается — может отображаться не вся информация о трейтах.

### Технологический стек

| Технология | Назначение |
|------------|------------|
| Vue 3 | Фронтенд-фреймворк (Composition API) |
| Vite 7 | Инструмент сборки и dev-сервер |
| Pinia 3 | Управление состоянием |
| Vue Router 4 | Клиентская маршрутизация |

### Начало работы

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен-сборки
npm run preview
```

### Структура проекта

```
src/
├── views/           # Компоненты маршрутов (RPM, IncantationMagic)
├── components/      # Переиспользуемые UI-компоненты
├── stores/          # Pinia stores (energy, fields)
├── assets/          # Статические ресурсы (SVG иконки)
├── main.js          # Точка входа приложения
└── App.vue          # Корневой компонент
```

---

## Legal / Правовая информация

**GURPS** is a registered trademark of Steve Jackson Games. The Ritual Path Magic system and related content are copyrighted by Steve Jackson Games. All rights reserved.

This project is a **fan-created game aid** released for free distribution under the permissions granted in the [Steve Jackson Games Online Policy](https://www.sjgames.com/general/online_policy.html). This material is not official and is not endorsed by Steve Jackson Games.

**GURPS** является зарегистрированной торговой маркой Steve Jackson Games. Система Ritual Path Magic и связанный контент защищены авторским правом Steve Jackson Games. Все права защищены.

Этот проект является **фанатским игровым помощником**, распространяемым бесплатно в соответствии с [онлайн-политикой Steve Jackson Games](https://www.sjgames.com/general/online_policy.html). Этот материал не является официальным и не одобрен Steve Jackson Games.

---

## License

This project is provided as-is for personal use. No warranty expressed or implied.
