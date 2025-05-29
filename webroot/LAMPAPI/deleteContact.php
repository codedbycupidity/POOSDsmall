<?php
$inData = getRequestInfo();

$ID = $inData["ID"];        // Contact ID to delete
$userID = $inData["userID"];  // Authenticated user's ID

$hostname = 'db';
$username = 'root';
$dbPassword = 'temp1234';
$dbname   = 'Poosd_Contact_Manager';

$conn = new mysqli($hostname, $username, $dbPassword, $dbname);


if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
    $stmt->bind_param("ii", $ID, $userID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithSuccess();
    } else {
        returnWithError("Contact not found or unauthorized to delete");
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
