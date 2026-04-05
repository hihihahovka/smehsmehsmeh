#!/bin/bash

echo "🚀 Подготовка проекта Яндекс Минус..."

# Проверяем установлен ли Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Ошибка: Node.js не установлен."
    echo "Пожалуйста, скачайте и установите Node.js с официального сайта: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js найден: $(node -v)"

# Проверяем установлен ли npm
if ! command -v npm &> /dev/null
then
    echo "❌ Ошибка: npm не установлен."
    exit 1
fi

echo "✅ npm найден: $(npm -v)"

echo "📦 Устанавливаем зависимости (npm install)..."
npm install

echo "🎉 Все готово! Запускаем сервер..."
npm run dev
