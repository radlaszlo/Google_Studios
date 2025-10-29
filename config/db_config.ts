// This file should be in your backend environment and not exposed to the client.
// Ensure this file is added to .gitignore in a real project.

export const dbConfig = {
  server: 'YOUR_MSSQL_SERVER_ADDRESS',
  database: 'AutorizatieLiberaTrecere',
  user: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  options: {
    encrypt: true, // For Azure SQL or if you have an SSL certificate
    trustServerCertificate: true, // Change to false for production
  },
};
