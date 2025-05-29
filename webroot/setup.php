<?php
// For plain PHP:
$hostname = 'db';
$username = 'root';
$password = 'temp1234';
$dbname   = 'Poosd_Contact_Manager';

$conn = new mysqli($hostname, $username, $password, $dbname);


// Check connection
if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}

// Example query: get all users
$sql = "SELECT FirstName, LastName, Email FROM Users LIMIT 5";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<h2 style='color: blue; text-align: center;'>User Records</h2>";
    while ($row = $result->fetch_assoc()) {
        echo "<p style='text-align: center;'>" . 
            htmlspecialchars($row["FirstName"]) . " " . 
            htmlspecialchars($row["LastName"]) . " — " . 
            htmlspecialchars($row["Email"]) . "</p>";
    }
} else {
    echo "<h1>No records found.</h1>";
}

$conn->close();
?>
