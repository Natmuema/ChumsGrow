#!/bin/bash

echo "🚀 Starting Investment Risk Profiler Application"
echo "================================================"

# Set OpenAI API Key (replace with your actual key)
export OPENAI_API_KEY="your_openai_api_key_here"

# Start Django backend in background
echo "🔧 Starting Django backend..."
cd backend
source venv/bin/activate
python manage.py runserver 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start React frontend
echo "⚛️ Starting React frontend..."
cd ChumsApp
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started successfully!"
echo "📱 Frontend: http://localhost:5173"
echo "🔗 Backend API: http://localhost:8000/api"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Wait for user to stop
wait