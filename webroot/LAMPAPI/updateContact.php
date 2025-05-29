<?php
$inData = getRequestInfo();

$ID = $inData["ID"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phoneNumber = $inData["phoneNumber"];
$userID = $inData["userID"];
$address = isset($inData["address"]) ? $inData["address"] : ""; // <-- Add this

$hostname = 'db';
$username = 'root';
$dbPassword = 'temp1234';
$dbname   = 'Poosd_Contact_Manager';

$conn = new mysqli($hostname, $username, $dbPassword, $dbname);

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Updated query to also update Address
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=?, Address=? WHERE ID=? AND UserID=?");
    $stmt->bind_param("ssssssi", $firstName, $lastName, $email, $phoneNumber, $address, $ID, $userID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithSuccess();
    } else {
        returnWithError("Contact not found or you don't have permission to update it");
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
    $retValue = '{"success":false,"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess()
{
    $retValue = '{"success":true,"error":""}';
    sendResultInfoAsJson($retValue);
}
?>
