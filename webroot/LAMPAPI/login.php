<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// SET DB CONNECTION SETTINGS HERE
$hostname = 'db';
$username = 'root';
$dbPassword = 'temp1234';
$dbname   = 'Poosd_Contact_Manager';



$inData = getRequestInfo();

$login = trim($inData["login"]);
$passwordInput = trim($inData["password"]);

$conn = new mysqli($hostname, $username, $dbPassword, $dbname);

if ($conn->connect_error) {
    returnWithError("DB connection failed: " . $conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email FROM Users WHERE LoginName = ? AND Password = ?");
    $stmt->bind_param("ss", $login, $passwordInput);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        returnWithInfo($row['FirstName'], $row['LastName'], $row['Email'], $row['ID']);
    } else {
        returnWithError("Invalid Username or Password");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"id":0,"firstName":"","lastName":"","email":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $email, $id)
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
