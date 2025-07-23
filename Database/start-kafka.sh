
cd /c/kafka || { echo "Kafka directory not found"; exit 1; }

cmd.exe /c ".\\bin\\windows\\kafka-server-start.bat .\\config\\server.properties"
