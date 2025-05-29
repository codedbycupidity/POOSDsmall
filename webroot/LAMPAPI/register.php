<?php
$inData = getRequestInfo();

// Input extraction
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$loginName = $inData["loginName"];
$email = $inData["email"];
$password = $inData["password"];

// Connection
$hostname = 'db';
$username = 'root';
$dbPassword = 'temp1234';
$dbname   = 'Poosd_Contact_Manager';

$conn = new mysqli($hostname, $username, $dbPassword, $dbname);


if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check for existing loginName
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE LoginName = ?");
    $stmt->bind_param("s", $loginName);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $stmt->close();
        $conn->close();
        returnWithError("Username already taken");
        return;
    }
    $stmt->close();

    // Check for existing email
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $stmt->close();
        $conn->close();
        returnWithError("Email already registered");
        return;
    }
    $stmt->close();

    // Hash password before storing
   

    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, LoginName, Email, Password) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $firstName, $lastName, $loginName, $email , $password);

    if ($stmt->execute()) {
        returnWithSuccess($conn->insert_id);
    } else {
        returnWithError("Registration failed: " . $stmt->error);
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
