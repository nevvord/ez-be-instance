# EZ Backend Instance

[English](#english) | [Русский](#russian)

<a name="english"></a>
## English

Backend application based on Bun, Express, and Prisma with layered architecture, developed in functional style.

### Features

- REST API with Express
- WebSockets via Socket.io
- PostgreSQL database with Prisma ORM
- Task queues with BullMQ
- Cron job scheduler
- Event system
- File uploading
- Logging
- TypeScript

### Project Structure

The project has the following layered architecture:

```
src/
├── api/            # API layer (controllers, routes, middleware, validators)
├── config/         # Application configuration
├── db/             # Data access layer (Prisma)
├── services/       # Business logic and services
├── shared/         # Common utilities, types, and functions
├── app.ts          # Express application setup
└── main.ts         # Entry point
```

### Project Principles

1. **Functional Approach**: Functions are used instead of classes
2. **File Naming**: All files use kebab-case (e.g., `user-service.ts`)
3. **Named Exports**: Named exports are used instead of default exports
4. **Index Files**: Used only for re-exporting
5. **RPC-style REST API**: Endpoints follow the pattern `/[entity].[action]` (e.g., `/users.getInfo`)
6. **Clear Layer Separation**: 
   - `shared` doesn't import other layers
   - `config` can only import from `shared`
   - `db` can import from `shared` and `config`
   - `services` cannot import from `api`
   - `api` can import from any layer
7. **Validation**: All incoming data is validated with Zod schemas
8. **Comments**: Code comments must be in English

### API Conventions

All API endpoints:
- Use POST method
- Follow the format `/[entity].[action]` (e.g., `/users.getInfo`)
- Validate input data using Zod
- Return a standardized response format

### Running the Project

```bash
# Install dependencies
bun install

# Run in development mode
bun dev

# Build the project
bun build

# Run in production mode
bun start
```

### Cursor Rules

The project contains a `.cursorrules` file that defines code formatting and structure rules for the Cursor IDE. These rules ensure consistency in code style and help avoid common mistakes.

### API Documentation

Bruno is used for API documentation. API collection files are located in the `bruno/` directory.

### Development

1. Layered architecture is controlled by ESLint:
   - `shared` - lowest layer
   - `config` - configuration
   - `db` - data access
   - `services` - business logic
   - `api/websockets/cron/queue/events` - top layer

2. Lower layers cannot import higher layers or layers at their level.

### Testing

```bash
# Run tests
bun run test
```

<a name="russian"></a>
## Русский

Серверное приложение на базе Bun, Express и Prisma с многослойной архитектурой, разработанное в функциональном стиле.

### Функциональность

- REST API с Express
- WebSockets через Socket.io
- База данных PostgreSQL с Prisma ORM
- Очереди задач с BullMQ
- Планировщик задач Cron
- Система событий
- Загрузка файлов
- Логирование
- TypeScript

### Структура проекта

Проект имеет следующую слоистую архитектуру:

```
src/
├── api/            # API слой (контроллеры, роуты, middleware, валидаторы)
├── config/         # Конфигурация приложения
├── db/             # Слой доступа к данным (Prisma)
├── services/       # Бизнес-логика и сервисы
├── shared/         # Общие утилиты, типы и функции
├── app.ts          # Настройка Express приложения
└── main.ts         # Точка входа
```

### Принципы проекта

1. **Функциональный подход**: Используются функции вместо классов
2. **Именование файлов**: Все файлы используют kebab-case (например, `user-service.ts`)
3. **Именованные экспорты**: Используются именованные экспорты вместо дефолтных
4. **Индексные файлы**: Используются только для реэкспорта
5. **REST API в стиле RPC**: Эндпоинты следуют шаблону `/[сущность].[действие]` (например, `/users.getInfo`)
6. **Четкое разделение слоев**: 
   - `shared` не импортирует другие слои
   - `config` может импортировать только из `shared`
   - `db` может импортировать из `shared` и `config`
   - `services` не может импортировать из `api`
   - `api` может импортировать из любого слоя
7. **Валидация**: Все входящие данные проверяются Zod-схемами
8. **Комментарии**: Комментарии в коде должны быть на английском языке

### Соглашения по API

Все API эндпоинты:
- Используют POST метод
- Следуют формату `/[сущность].[действие]` (например, `/users.getInfo`)
- Валидируют входные данные с помощью Zod
- Возвращают стандартизированный формат ответа

### Запуск проекта

```bash
# Установка зависимостей
bun install

# Запуск в режиме разработки
bun dev

# Сборка проекта
bun build

# Запуск в production режиме
bun start
```

### Cursor Rules

Проект содержит файл `.cursorrules`, определяющий правила форматирования и структуры кода для IDE Cursor. Эти правила обеспечивают согласованность стиля кода и помогают избегать общих ошибок.

### API документация

Для документации API используется Bruno. Файлы API коллекций находятся в директории `bruno/`.

### Разработка

1. Слоистая архитектура контролируется ESLint:
   - `shared` - самый нижний слой
   - `config` - конфигурация
   - `db` - доступ к данным
   - `services` - бизнес-логика
   - `api/websockets/cron/queue/events` - верхний слой

2. Нижние слои не могут импортировать верхние слои или слои своего уровня.

### Тестирование

```bash
# Запуск тестов
bun run test
```
