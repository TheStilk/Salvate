# Salvate

A modern subscription management system built with FastAPI and MongoDB.

## Features

- User authentication and authorization
- Subscription management
- Dashboard with analytics
- RESTful API
- Modern web interface

## Requirements

- Python 3.12.10
- MongoDB
- Node.js (for development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/thestilk/salvate.git
cd salvate
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -e .
```

4. Create a `.env` file with your configuration:
```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=salvate
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Running the Application

1. Start the development server:
```bash
uvicorn app.main:app --reload
```

2. Access the application at `http://localhost:8000`

## API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

Run the test suite:
```bash
pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request