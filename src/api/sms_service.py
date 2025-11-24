import os
from twilio.rest import Client

# Get Twilio credentials from environment
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

class SMSService:
    """Service for sending SMS messages via Twilio"""
    
    def __init__(self):
        if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER]):
            raise ValueError('Twilio credentials not configured in environment variables')
        
        self.client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        self.twilio_phone = TWILIO_PHONE_NUMBER
    
    def send_sms(self, phone_number, message):
        """
        Send an SMS message via Twilio
        
        Args:
            phone_number (str): Phone number to send to (e.g., '+15551234567' or '5551234567')
            message (str): Message content
            
        Returns:
            dict: Response with message SID
            
        Raises:
            ValueError: If request fails
        """
        
        if not phone_number.startswith('+'):
            phone_number = '+1' + phone_number.replace('-', '').replace(' ', '').replace('(', '').replace(')', '')
        
        try:
            sms = self.client.messages.create(
                body=message,
                from_=self.twilio_phone,
                to=phone_number
            )
            
            return {
                'success': True,
                'message': 'SMS sent successfully',
                'message_sid': sms.sid,
                'status': sms.status
            }
            
        except Exception as e:
            print(f"Twilio SMS sending failed: {str(e)}")
            raise ValueError(f'SMS sending failed: {str(e)}')
    
    def send_booking_confirmation_to_customer(self, customer_phone, provider_name, provider_phone, provider_email):
        """
        Send booking confirmation SMS to customer with provider details
        
        Args:
            customer_phone (str): Customer phone number
            provider_name (str): Provider's name
            provider_phone (str): Provider's phone number
            provider_email (str): Provider's email
            
        Returns:
            dict: Response from Twilio
        """
        message = f"Booking Confirmed!\n\nProvider: {provider_name}\nPhone: {provider_phone}\nEmail: {provider_email}\n\nThank you for booking with us!"
        
        return self.send_sms(customer_phone, message)
    
    def send_booking_notification_to_provider(self, provider_phone, customer_name, customer_address, service_name):
        """
        Send booking notification SMS to provider with customer details
        
        Args:
            provider_phone (str): Provider phone number
            customer_name (str): Customer's name
            customer_address (str): Customer's address
            service_name (str): Service booked
            
        Returns:
            dict: Response from Twilio
        """
        message = f"New Booking!\n\nCustomer: {customer_name}\nAddress: {customer_address}\nService: {service_name}\n\nPlease contact the customer to confirm."
        
        return self.send_sms(provider_phone, message)

sms_service = SMSService()