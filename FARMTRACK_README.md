# 🌾 DLT-Powered Farm-to-Market Tracker with Fair Farmer Payments

A comprehensive blockchain-powered supply chain tracking system that ensures transparency, authenticity, and fair payments for farmers through Hedera Hashgraph and M-Pesa integration.

## 🚀 Features

### Core Functionality
- **Farmer Registration & Management**: Complete farmer onboarding with KYC and blockchain account creation
- **Produce Registration**: Track agricultural products from harvest to market
- **Supply Chain Tracking**: Real-time monitoring of produce journey with GPS tracking
- **Consumer Verification**: QR code-based authenticity verification for end consumers
- **Automated Payments**: Smart contract-powered fair payments via M-Pesa
- **Carbon Credit Rewards**: Incentivize eco-friendly farming practices

### Technology Stack

#### Backend (Django)
- Django REST Framework for API development
- Hedera Hashgraph integration for blockchain tracking
- M-Pesa API integration for mobile payments
- Smart contract deployment and execution
- QR code generation for product authentication

#### Frontend (React)
- Modern, responsive UI with Tailwind CSS
- Real-time dashboard with analytics
- Interactive produce tracking interface
- Consumer verification portal
- Farmer management system

#### Blockchain (Hedera Hashgraph)
- Consensus Service for immutable record keeping
- Token Service for carbon credits
- Smart Contract Service for automated payments
- File Service for document storage

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite for development)
- Hedera Testnet Account
- M-Pesa Developer Account

## 🛠️ Installation

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd /workspace/backend
```

2. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:
Create a `.env` file in the backend directory:
```env
# Django settings
DEBUG=True
SECRET_KEY=your-secret-key

# Hedera Hashgraph settings
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=your-private-key
HEDERA_TOPIC_ID=0.0.xxxxx
HEDERA_TOKEN_ID=0.0.xxxxx

# M-Pesa settings
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your-passkey
MPESA_CALLBACK_URL=https://your-domain.com/mpesa/callback
MPESA_ENV=sandbox
```

4. **Run migrations**:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser**:
```bash
python manage.py createsuperuser
```

6. **Start development server**:
```bash
python manage.py runserver
```

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd /workspace/ChumsApp
```

2. **Install Node dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

The application will be available at:
- Backend API: http://localhost:8000
- Frontend: http://localhost:5173

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token

### Farmer Management
- `GET /api/farmtrack/farmers/` - List all farmers
- `POST /api/farmtrack/register/` - Register new farmer
- `GET /api/farmtrack/farmers/{id}/` - Get farmer details
- `POST /api/farmtrack/farmers/{id}/create_blockchain_account/` - Create Hedera account
- `GET /api/farmtrack/farmers/{id}/earnings/` - Get farmer earnings
- `GET /api/farmtrack/farmers/{id}/carbon_credits/` - Get carbon credits

### Produce Management
- `GET /api/farmtrack/produce/` - List all produce
- `POST /api/farmtrack/produce/` - Register new produce
- `GET /api/farmtrack/produce/{id}/` - Get produce details
- `POST /api/farmtrack/produce/{id}/add_tracking_point/` - Add tracking point
- `GET /api/farmtrack/produce/{id}/tracking_history/` - Get complete journey

### Consumer Verification
- `POST /api/farmtrack/verify/` - Verify product authenticity

### Transactions
- `GET /api/farmtrack/transactions/` - List transactions
- `POST /api/farmtrack/transactions/` - Create transaction
- `POST /api/farmtrack/transactions/{id}/process_payment/` - Process payment

### Dashboard
- `GET /api/farmtrack/dashboard/stats/` - Get dashboard statistics

## 🔐 Smart Contracts

### Produce Sale Contract
Handles automated payment distribution with fair trade premiums:
- Base payment to farmer
- 10% fair trade premium for verified farmers
- 5% carbon credit bonus for eco-friendly produce

### Carbon Credit Contract
Manages carbon credit issuance and redemption:
- NFT-based carbon credits
- Automatic valuation
- Marketplace integration

## 💰 Payment Flow

1. **Consumer Purchase**: Consumer scans QR code and confirms purchase
2. **Smart Contract Execution**: Hedera smart contract calculates payment
3. **M-Pesa Integration**: Payment sent directly to farmer's M-Pesa
4. **Blockchain Recording**: Transaction recorded on Hedera
5. **Carbon Credits**: Eco-friendly farmers receive bonus credits

## 🌱 Carbon Credit System

### Eligible Practices
- **Organic Farming**: 10 credits/hectare
- **Water Conservation**: 5 credits/1000L saved
- **Renewable Energy**: 15 credits/kW installed
- **Reforestation**: 20 credits/100 trees
- **Soil Management**: 8 credits/hectare
- **Waste Reduction**: 3 credits/ton reduced

### Credit Valuation
- Base value: $10 per credit
- Market-based pricing adjustments
- Automatic M-Pesa payouts

## 📊 Dashboard Features

### Real-time Analytics
- Total farmers registered
- Active produce shipments
- Revenue processed
- Carbon credits issued
- Eco-friendly percentage

### Tracking Visualization
- Supply chain journey map
- Temperature/humidity monitoring
- GPS location tracking
- Timeline view

## 🔍 Consumer Verification

### Methods
1. **QR Code Scanning**: Mobile-friendly QR scanner
2. **Manual Code Entry**: Enter product ID
3. **NFC Tags**: Tap-to-verify (future)
4. **Blockchain Verification**: Direct chain query

### Information Provided
- Product authenticity status
- Complete supply chain journey
- Farmer information
- Quality certifications
- Eco-friendly practices

## 🚦 Testing

### Backend Tests
```bash
cd /workspace/backend
python manage.py test farmtracker
```

### Frontend Tests
```bash
cd /workspace/ChumsApp
npm test
```

## 📈 Deployment

### Backend Deployment

1. **Update settings for production**:
   - Set `DEBUG=False`
   - Configure production database
   - Set up proper secret key
   - Configure CORS settings

2. **Collect static files**:
```bash
python manage.py collectstatic
```

3. **Deploy using Gunicorn**:
```bash
gunicorn auth.wsgi:application
```

### Frontend Deployment

1. **Build for production**:
```bash
npm run build
```

2. **Deploy to hosting service** (Vercel, Netlify, etc.)

### Hedera Mainnet Migration

1. Update network configuration to mainnet
2. Create mainnet accounts
3. Deploy smart contracts to mainnet
4. Update topic and token IDs

## 🔧 Troubleshooting

### Common Issues

1. **M-Pesa callback not working**: Ensure callback URL is publicly accessible
2. **Hedera connection errors**: Check network status and credentials
3. **QR code generation fails**: Verify Pillow installation
4. **CORS errors**: Update CORS_ALLOWED_ORIGINS in settings

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@farmtrack.com or open an issue in the repository.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic farmer registration
- ✅ Produce tracking
- ✅ M-Pesa integration
- ✅ Consumer verification

### Phase 2 (Q2 2024)
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] IoT sensor integration
- [ ] Multi-language support

### Phase 3 (Q3 2024)
- [ ] AI-powered price predictions
- [ ] Automated quality grading
- [ ] International payment support
- [ ] Carbon credit marketplace

## 🏆 Key Benefits

### For Farmers
- **Fair Payments**: Guaranteed fair trade premiums
- **Quick Payments**: Instant M-Pesa transfers
- **Carbon Rewards**: Additional income from eco-practices
- **Market Access**: Direct connection to buyers

### For Consumers
- **Authenticity**: Verify product origin
- **Transparency**: See complete supply chain
- **Quality Assurance**: Track handling conditions
- **Support Farmers**: Direct impact on farmer welfare

### For the Environment
- **Reduced Carbon Footprint**: Incentivized eco-practices
- **Sustainable Farming**: Promoted through rewards
- **Waste Reduction**: Optimized supply chain
- **Resource Conservation**: Water and energy savings

---

**Built with ❤️ for sustainable agriculture and fair trade**