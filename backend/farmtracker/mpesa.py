"""
M-Pesa Payment Integration for Farmer Payments
Handles automated payments to farmers via M-Pesa
"""

import os
import json
import base64
import hashlib
import requests
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class MPesaIntegration:
    """
    M-Pesa payment gateway integration
    """
    
    def __init__(self):
        # M-Pesa API credentials (from environment variables)
        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY')
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
        self.shortcode = os.getenv('MPESA_SHORTCODE', '174379')  # Test shortcode
        self.passkey = os.getenv('MPESA_PASSKEY')
        self.callback_url = os.getenv('MPESA_CALLBACK_URL', 'https://api.farmtrack.com/mpesa/callback')
        
        # API endpoints
        self.environment = os.getenv('MPESA_ENV', 'sandbox')
        if self.environment == 'production':
            self.base_url = 'https://api.safaricom.co.ke'
        else:
            self.base_url = 'https://sandbox.safaricom.co.ke'
        
        self.auth_url = f'{self.base_url}/oauth/v1/generate'
        self.stk_push_url = f'{self.base_url}/mpesa/stkpush/v1/processrequest'
        self.b2c_url = f'{self.base_url}/mpesa/b2c/v1/paymentrequest'
        self.query_url = f'{self.base_url}/mpesa/stkpushquery/v1/query'
        
        self.access_token = None
        self.token_expiry = None
    
    def get_access_token(self) -> str:
        """
        Get OAuth access token from M-Pesa API
        """
        try:
            # Check if token is still valid
            if self.access_token and self.token_expiry and datetime.now() < self.token_expiry:
                return self.access_token
            
            # Generate new token
            auth_string = base64.b64encode(
                f"{self.consumer_key}:{self.consumer_secret}".encode()
            ).decode('utf-8')
            
            headers = {
                'Authorization': f'Basic {auth_string}',
                'Content-Type': 'application/json'
            }
            
            # Simulated response for development
            # In production, this would make actual API call
            response = {
                'access_token': f"token_{datetime.now().timestamp()}",
                'expires_in': '3599'
            }
            
            self.access_token = response['access_token']
            self.token_expiry = datetime.now() + timedelta(seconds=int(response['expires_in']) - 60)
            
            return self.access_token
            
        except Exception as e:
            logger.error(f"Error getting M-Pesa access token: {e}")
            raise
    
    def send_payment_to_farmer(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send payment directly to farmer's M-Pesa account (B2C)
        """
        try:
            access_token = self.get_access_token()
            
            # Prepare payment request
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            # Format phone number (remove +254 or 0 prefix)
            phone_number = self._format_phone_number(payment_data['phone_number'])
            
            payload = {
                'InitiatorName': 'FarmTracker',
                'SecurityCredential': self._generate_security_credential(),
                'CommandID': 'BusinessPayment',
                'Amount': str(payment_data['amount']),
                'PartyA': self.shortcode,
                'PartyB': phone_number,
                'Remarks': f"Payment for produce {payment_data.get('produce_id', '')}",
                'QueueTimeOutURL': f"{self.callback_url}/timeout",
                'ResultURL': f"{self.callback_url}/result",
                'Occasion': f"Farmer payment - {payment_data.get('farmer_name', '')}"
            }
            
            # Simulated response for development
            # In production, this would make actual API call to M-Pesa
            response = self._simulate_b2c_response(payload)
            
            if response['success']:
                return {
                    'success': True,
                    'transaction_id': response['ConversationID'],
                    'originator_conversation_id': response['OriginatorConversationID'],
                    'response_code': response['ResponseCode'],
                    'response_description': response['ResponseDescription'],
                    'amount': payment_data['amount'],
                    'recipient': phone_number
                }
            else:
                return {
                    'success': False,
                    'error': response.get('errorMessage', 'Payment failed')
                }
                
        except Exception as e:
            logger.error(f"Error sending M-Pesa payment: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def initiate_stk_push(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Initiate STK Push for customer payment collection
        """
        try:
            access_token = self.get_access_token()
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            # Generate password
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(
                f"{self.shortcode}{self.passkey}{timestamp}".encode()
            ).decode('utf-8')
            
            # Format phone number
            phone_number = self._format_phone_number(transaction_data['phone_number'])
            
            payload = {
                'BusinessShortCode': self.shortcode,
                'Password': password,
                'Timestamp': timestamp,
                'TransactionType': 'CustomerBuyGoodsOnline',
                'Amount': str(transaction_data['amount']),
                'PartyA': phone_number,
                'PartyB': self.shortcode,
                'PhoneNumber': phone_number,
                'CallBackURL': self.callback_url,
                'AccountReference': f"PRODUCE-{transaction_data.get('produce_id', '')}",
                'TransactionDesc': f"Payment for {transaction_data.get('produce_name', 'produce')}"
            }
            
            # Simulated response for development
            response = self._simulate_stk_push_response(payload)
            
            if response['success']:
                return {
                    'success': True,
                    'merchant_request_id': response['MerchantRequestID'],
                    'checkout_request_id': response['CheckoutRequestID'],
                    'response_code': response['ResponseCode'],
                    'response_description': response['ResponseDescription'],
                    'customer_message': response['CustomerMessage']
                }
            else:
                return {
                    'success': False,
                    'error': response.get('errorMessage', 'STK push failed')
                }
                
        except Exception as e:
            logger.error(f"Error initiating STK push: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def query_transaction_status(self, checkout_request_id: str) -> Dict[str, Any]:
        """
        Query the status of an STK push transaction
        """
        try:
            access_token = self.get_access_token()
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            # Generate password
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(
                f"{self.shortcode}{self.passkey}{timestamp}".encode()
            ).decode('utf-8')
            
            payload = {
                'BusinessShortCode': self.shortcode,
                'Password': password,
                'Timestamp': timestamp,
                'CheckoutRequestID': checkout_request_id
            }
            
            # Simulated response
            response = self._simulate_query_response(checkout_request_id)
            
            return {
                'success': True,
                'result_code': response['ResultCode'],
                'result_description': response['ResultDesc'],
                'transaction_status': 'completed' if response['ResultCode'] == '0' else 'failed'
            }
            
        except Exception as e:
            logger.error(f"Error querying transaction status: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def process_callback(self, callback_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process M-Pesa callback data
        """
        try:
            # Extract callback information
            result_code = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
            result_desc = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultDesc')
            
            if result_code == 0:
                # Successful transaction
                callback_metadata = callback_data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {})
                items = callback_metadata.get('Item', [])
                
                transaction_details = {}
                for item in items:
                    transaction_details[item['Name']] = item.get('Value')
                
                return {
                    'success': True,
                    'transaction_id': transaction_details.get('MpesaReceiptNumber'),
                    'amount': transaction_details.get('Amount'),
                    'phone_number': transaction_details.get('PhoneNumber'),
                    'transaction_date': transaction_details.get('TransactionDate'),
                    'result_description': result_desc
                }
            else:
                return {
                    'success': False,
                    'result_code': result_code,
                    'result_description': result_desc
                }
                
        except Exception as e:
            logger.error(f"Error processing M-Pesa callback: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def bulk_payment_to_farmers(self, farmers_payments: list) -> Dict[str, Any]:
        """
        Process bulk payments to multiple farmers
        """
        results = []
        successful = 0
        failed = 0
        total_amount = Decimal('0')
        
        for payment in farmers_payments:
            try:
                result = self.send_payment_to_farmer(payment)
                if result['success']:
                    successful += 1
                    total_amount += Decimal(str(payment['amount']))
                else:
                    failed += 1
                
                results.append({
                    'farmer_id': payment.get('farmer_id'),
                    'phone_number': payment.get('phone_number'),
                    'amount': payment.get('amount'),
                    'status': 'success' if result['success'] else 'failed',
                    'transaction_id': result.get('transaction_id'),
                    'error': result.get('error')
                })
                
            except Exception as e:
                failed += 1
                results.append({
                    'farmer_id': payment.get('farmer_id'),
                    'status': 'failed',
                    'error': str(e)
                })
        
        return {
            'success': successful > 0,
            'total_farmers': len(farmers_payments),
            'successful_payments': successful,
            'failed_payments': failed,
            'total_amount_paid': str(total_amount),
            'payment_results': results
        }
    
    def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """
        Verify a payment transaction
        """
        try:
            # In production, this would query M-Pesa API for transaction details
            # Simulated verification
            return {
                'success': True,
                'verified': True,
                'transaction_id': transaction_id,
                'status': 'completed',
                'amount': '1000.00',
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error verifying payment: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    # Helper methods
    
    def _format_phone_number(self, phone: str) -> str:
        """Format phone number to M-Pesa format (254XXXXXXXXX)"""
        phone = str(phone).strip().replace('+', '').replace(' ', '')
        
        if phone.startswith('0'):
            phone = '254' + phone[1:]
        elif not phone.startswith('254'):
            phone = '254' + phone
            
        return phone
    
    def _generate_security_credential(self) -> str:
        """Generate security credential for B2C transactions"""
        # In production, this would use actual certificate
        return base64.b64encode(self.passkey.encode()).decode('utf-8') if self.passkey else ''
    
    def _simulate_b2c_response(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate B2C API response for development"""
        return {
            'success': True,
            'ConversationID': f"AG_{datetime.now().timestamp()}",
            'OriginatorConversationID': f"OC_{datetime.now().timestamp()}",
            'ResponseCode': '0',
            'ResponseDescription': 'Accept the service request successfully.'
        }
    
    def _simulate_stk_push_response(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate STK Push API response for development"""
        return {
            'success': True,
            'MerchantRequestID': f"MR_{datetime.now().timestamp()}",
            'CheckoutRequestID': f"CR_{datetime.now().timestamp()}",
            'ResponseCode': '0',
            'ResponseDescription': 'Success. Request accepted for processing',
            'CustomerMessage': 'Success. Request accepted for processing'
        }
    
    def _simulate_query_response(self, checkout_request_id: str) -> Dict[str, Any]:
        """Simulate query API response for development"""
        return {
            'ResponseCode': '0',
            'ResponseDescription': 'The service request has been accepted successfully',
            'MerchantRequestID': f"MR_{datetime.now().timestamp()}",
            'CheckoutRequestID': checkout_request_id,
            'ResultCode': '0',
            'ResultDesc': 'The service request is processed successfully.'
        }


class PaymentProcessor:
    """
    High-level payment processing with blockchain integration
    """
    
    def __init__(self):
        self.mpesa = MPesaIntegration()
        
    def process_farmer_payment(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process payment to farmer with all bonuses
        """
        try:
            # Calculate total payment
            base_amount = Decimal(str(transaction_data['total_amount']))
            fair_trade_premium = Decimal(str(transaction_data.get('fair_trade_premium', 0)))
            carbon_bonus = Decimal(str(transaction_data.get('carbon_credit_bonus', 0)))
            total_payment = base_amount + fair_trade_premium + carbon_bonus
            
            # Prepare payment data
            payment_data = {
                'phone_number': transaction_data['mpesa_number'],
                'amount': str(total_payment),
                'farmer_name': transaction_data['farmer_name'],
                'produce_id': transaction_data['produce_id'],
                'transaction_id': transaction_data['transaction_id']
            }
            
            # Send payment via M-Pesa
            mpesa_result = self.mpesa.send_payment_to_farmer(payment_data)
            
            if mpesa_result['success']:
                return {
                    'success': True,
                    'payment_status': 'completed',
                    'mpesa_transaction_id': mpesa_result['transaction_id'],
                    'amount_paid': str(total_payment),
                    'breakdown': {
                        'base_amount': str(base_amount),
                        'fair_trade_premium': str(fair_trade_premium),
                        'carbon_bonus': str(carbon_bonus)
                    },
                    'timestamp': datetime.now().isoformat()
                }
            else:
                return {
                    'success': False,
                    'payment_status': 'failed',
                    'error': mpesa_result.get('error', 'Payment processing failed')
                }
                
        except Exception as e:
            logger.error(f"Error processing farmer payment: {e}")
            return {
                'success': False,
                'error': str(e)
            }