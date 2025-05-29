<?php
$inData = getRequestInfo();

// Input extraction
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phoneNumber = $inData["phoneNumber"];
$userID = $inData["userID"];
$address = isset($inData["address"]) ? $inData["address"] : ""; // NEW LINE

// DB connection
$hostname = 'db';
$username = 'root';
$dbPassword = 'temp1234';
$dbname   = 'Poosd_Contact_Manager';

$conn = new mysqli($hostname, $username, $dbPassword, $dbname);

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {

    // UPDATED SQL to include Address
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Email, Phone, UserID, Address) VALUES (?, ?, ?, ?, ?, ?)");
    // UPDATED: Added $address as "s" type at end
    $stmt->bind_param("ssssss", $firstName, $lastName, $email, $phoneNumber, $userID, $address);

    if ($stmt->execute()) {
        returnWithSuccess($conn->insert_id);
    } else {
        returnWithError("Insert failed: " . $stmt->error);
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
    $retValue = '{"ID":0,"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($id)
{
    $retValue = '{"ID":' . $id . ',"error":""}';
    sendResultInfoAsJson($retValue);
}
?>
