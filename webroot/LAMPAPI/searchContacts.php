<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

// Updated connection details
$hostname = 'db';
$username = 'root';
$dbPassword = 'temp1234';
$dbname   = 'Poosd_Contact_Manager';

$conn = new mysqli($hostname, $username, $dbPassword, $dbname);

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Select Address column as well
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone, Address FROM Contacts 
                            WHERE (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?) 
                            AND UserID = ?");
    $searchTerm = "%" . $inData["search"] . "%";
    $stmt->bind_param("ssssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userID"]);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"ID":' . $row["ID"] .
            ',"firstName":"' . $row["FirstName"] .
            '","lastName":"' . $row["LastName"] .
            '","email":"' . $row["Email"] .
            '","phoneNumber":"' . $row["Phone"] . '"' .
            ',"address":"' . (isset($row["Address"]) ? $row["Address"] : "") . '"}';
    }

    if ($searchCount == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
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
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}
?>
