# Kora

Kora is a modern genealogy platform built with Laravel, React and TypeScript.

## Requirements

- Docker Desktop

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/kora.git
cd kora
```

Start the containers:

```bash
./vendor/bin/sail up -d
```

Install frontend dependencies:

```bash
./vendor/bin/sail npm install
```

Run database migrations:

```bash
./vendor/bin/sail artisan migrate
```

Start the Vite development server:

```bash
./vendor/bin/sail npm run dev
```

The application will be available at:

- http://localhost

## Useful commands

Start containers:

```bash
./vendor/bin/sail up -d
```

Stop containers:

```bash
./vendor/bin/sail down
```
