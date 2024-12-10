import pandas as pd
import re

# List of common personal email providers to exclude
personal_email_providers = [
    "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", 
    "aol.com", "icloud.com", "mail.com", "yandex.com"
]

# Function to filter out personal emails
def is_business_email(email):
    if pd.isna(email):  # Check if the email is NaN
        return False
    # Remove single quotes and extract the domain
    clean_email = email.strip("'")  # Remove surrounding quotes
    domain = clean_email.split('@')[-1].lower().strip()  # Extract domain
    return domain not in personal_email_providers

# Load the Excel file
file_path = 'C://Users//Adarsh//MyProject//Deployed_Finals//whatsapp_webapp//whatsapp-enhanced//sorted_by_country.xlsx'
print("Loading Excel file from:", file_path)
df = pd.read_excel(file_path)
print("Excel file loaded successfully.")

# Print the column names to check for any issues
print("Columns in the Excel file:", df.columns)

# Strip spaces and handle case sensitivity
df.columns = df.columns.str.strip().str.lower()  # Normalize column names
print("Normalized column names:", df.columns)

# Print a sample of the data to ensure correct loading
print("First few rows of the DataFrame:")
print(df.head())

# Filter the data for 'usa' and 'united_kingdom'
print("Filtering data for USA and United Kingdom...")
target_countries = ["'usa'", "'united_kingdom'"]  # Adjust as needed
filtered_countries_df = df[df['country'].str.strip().str.lower().isin(target_countries)]
print(f"Filtered DataFrame for {target_countries} (first few rows):")
print(filtered_countries_df.head())

# Filter for business emails
print("Filtering for business emails...")
business_emails_df = filtered_countries_df[filtered_countries_df['email'].apply(is_business_email)]
print("Filtered business emails (first few rows):")
print(business_emails_df.head())

# Extract the email column from the filtered DataFrame
print("Extracting the 'email' column...")
filtered_emails = business_emails_df['email']
print("Filtered Business Emails:")
print(filtered_emails)

# Optionally, save the results to a new Excel file
output_path = 'filtered_business_emails.xlsx'
print(f"Saving filtered data to {output_path}...")
business_emails_df.to_excel(output_path, index=False)
print(f"Filtered data saved to {output_path}")
