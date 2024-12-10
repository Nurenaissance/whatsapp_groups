import pandas as pd

# Read the data from the txt file with the correct encoding
with open(r'C:\Users\Adarsh\Desktop\data.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()


# Process the data into a list of tuples
data = []
for line in lines:
    # Remove any leading/trailing whitespace and the last comma in each line
    line = line.strip().strip(',')
    if line:
        # Split by ', ' and print to check if the data format is correct
        row = line.split(', ')
        print(row)  # Print the row to inspect the format
        if len(row) == 8:  # Only add rows with exactly 8 columns
            data.append(tuple(row))
        else:
            print(f"Skipping invalid row: {line}")

# Convert the data into a DataFrame
df = pd.DataFrame(data, columns=['ID', 'Email', 'Hash', 'First Name', 'Last Name', 'Blank', 'Country', 'IP Address'])

# Save the DataFrame to an Excel file
df.to_excel('output.xlsx', index=False, engine='openpyxl')

print("Data has been successfully written to 'output.xlsx'")
