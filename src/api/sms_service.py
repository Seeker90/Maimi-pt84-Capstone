import os
import requests


class SMSService:
    def __init__(self):
        self.api_key = os.environ.get("TEXTBELT_API_KEY")
        self.sender_name = os.environ.get("TEXTBELT_SENDER_NAME", "HomeCalls")
        self.base_url = "https://textbelt.com"

        # Don't fail at initialization - allow app to start without API key
        # Will check when actually sending SMS
        if not self.api_key:
            print(
                "⚠️  Warning: TEXTBELT_API_KEY not set. SMS functionality will be disabled.")

    def _check_api_key(self):
        """Check if API key is configured before making requests"""
        if not self.api_key:
            raise ValueError("TEXTBELT_API_KEY is required but not configured")

    def send_sms(self, phone_number, message):
        """
        Send SMS via TextBelt paid API

        Args:
            phone_number (str): Phone number (10-digit for US or E.164 format)
            message (str): Message content

        Returns:
            dict: Response from TextBelt API

        Example:
            {
                "success": true,
                "quotaRemaining": 40,
                "textId": 12345
            }
        """
        self._check_api_key()  # Verify API key is configured

        try:

            url = f"{self.base_url}/text"

            payload = {
                "phone": phone_number,
                "message": message,
                "key": self.api_key,
                "sender": self.sender_name  # Optional, for regulatory purposes
            }

            response = requests.post(url, data=payload)
            result = response.json()

            if result.get("success"):
                print(f"✓ SMS sent successfully to {phone_number}")
                print(f"  - Text ID: {result.get('textId')}")
                print(f"  - Quota remaining: {result.get('quotaRemaining')}")
                return result
            else:
                error_msg = result.get("error", "Unknown error")
                print(f"✗ SMS failed: {error_msg}")
                raise ValueError(f"TextBelt error: {error_msg}")

        except requests.exceptions.RequestException as e:
            print(f"✗ Network error: {str(e)}")
            raise ValueError(f"Failed to send SMS: {str(e)}")

    def check_quota(self):
        """
        Check remaining SMS quota

        Returns:
            dict: {"success": true, "quotaRemaining": 98}
        """
        self._check_api_key()  # Verify API key is configured

        try:
            url = f"{self.base_url}/quota/{self.api_key}"
            response = requests.get(url)
            result = response.json()

            if result.get("success"):
                quota = result.get("quotaRemaining", 0)
                print(f"Remaining quota: {quota} SMS")
                return result
            else:
                raise ValueError("Failed to check quota")

        except Exception as e:
            print(f"Error checking quota: {str(e)}")
            raise

    def check_status(self, text_id):
        """
        Check delivery status of sent SMS

        Args:
            text_id (str): The textId from send_sms response

        Returns:
            dict: {"status": "DELIVERED|SENT|SENDING|FAILED|UNKNOWN"}
        """
        try:
            url = f"{self.base_url}/status/{text_id}"
            response = requests.get(url)
            result = response.json()

            status = result.get("status", "UNKNOWN")
            print(f"SMS {text_id} status: {status}")
            return result

        except Exception as e:
            print(f"Error checking status: {str(e)}")
            raise

    def send_booking_confirmation_to_customer(self, customer_phone, provider_name, provider_phone, provider_email):
        """
        Send booking confirmation SMS to customer
        """
        message = f"""HomeCalls Booking Confirmed!

Service provider: {provider_name}
Contact: {provider_phone}
Email: {provider_email}

Thank you for booking with HomeCalls!"""

        return self.send_sms(customer_phone, message)

    def send_booking_notification_to_provider(self, provider_phone, customer_name, customer_address, service_name):
        """
        Send new booking notification SMS to provider
        """
        message = f"""New Booking on HomeCalls!

Customer: {customer_name}
Address: {customer_address}
Service: {service_name}

Please contact the customer to confirm."""

        return self.send_sms(provider_phone, message)


# Create singleton instance
sms_service = SMSService()
