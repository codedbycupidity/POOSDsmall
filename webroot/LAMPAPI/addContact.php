<?php
	$inData = getRequestInfo();
	
	// Get all required fields from the request
	$firstName = isset($inData["firstName"]) ? trim($inData["firstName"]) : "";
	$lastName = isset($inData["lastName"]) ? trim($inData["lastName"]) : "";
	$email = isset($inData["email"]) ? trim($inData["email"]) : "";
	$phoneNumber = isset($inData["phoneNumber"]) ? trim($inData["phoneNumber"]) : "";
	$userID = isset($inData["userID"]) ? $inData["userID"] : 0; 

	// Validate that no fields are empty
	if (empty($firstName)) {
		returnWithError("First name cannot be empty");
		exit();
	}
	
	if (empty($lastName)) {
		returnWithError("Last name cannot be empty");
		exit();
	}
	
	if (empty($email)) {
		returnWithError("Email cannot be empty");
		exit();
	}
	
	if (empty($phoneNumber)) {
		returnWithError("Phone number cannot be empty");
		exit();
	}
	
	if (empty($userID) || $userID <= 0) {
		returnWithError("Invalid user ID");
		exit();
	}
	
	// Optional: Add more specific validation
	// Validate email format
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		returnWithError("Please enter a valid email address");
		exit();
	}
	
	// Validate name length (matching JS: at least 2 characters)
	if (strlen($firstName) < 2) {
		returnWithError("First name must be at least 2 characters");
		exit();
	}
	
	if (strlen($lastName) < 2) {
		returnWithError("Last name must be at least 2 characters");
		exit();
	}
	
	// Validate name fields contain only letters, spaces, hyphens, and apostrophes
	if (!preg_match("/^[a-zA-Z\s'-]+$/", $firstName)) {
		returnWithError("First name contains invalid characters");
		exit();
	}
	
	if (!preg_match("/^[a-zA-Z\s'-]+$/", $lastName)) {
		returnWithError("Last name contains invalid characters");
		exit();
	}
	
	// Basic phone validation - matching JS validation
	// Accept phone numbers with 10-15 digits (international support)
	// Accepts formats like: (555) 123-4567, 555-123-4567, 555.123.4567, +1-555-123-4567
	$phoneDigits = preg_replace('/\D/', '', $phoneNumber);
	if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
		returnWithError("Please enter a valid phone number");
		exit();
	}

	// Connect to the database
	$conn = new mysqli("localhost", "rolodexitApp", "rolodexitPassword123", "RolodexitDB");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{

		// Check for duplicate contact before inserting
		$checkStmt = $conn->prepare("SELECT ID FROM UserContacts WHERE firstName = ? AND lastName = ? AND email = ? AND phoneNumber = ? AND userID = ?");
		$checkStmt->bind_param("ssssi", $firstName, $lastName, $email, $phoneNumber, $userID);
		$checkStmt->execute();
		$checkResult = $checkStmt->get_result();
		
		if ($checkResult->num_rows > 0) {
			// Duplicate contact found
			$checkStmt->close();
			$conn->close();
			returnWithError("This contact already exists");
			exit();
		}
		
		$checkStmt->close();

		// Prepare the SQL statement to insert a new contact
		$stmt = $conn->prepare("INSERT INTO UserContacts (firstName, lastName, email, phoneNumber, userID) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $email, $phoneNumber, $userID);
		
		// Execute the statement
		if($stmt->execute())
		{
			// Get the ID of the newly created contact
			$newContactId = $conn->insert_id;
			returnWithSuccess($newContactId);
		}
		else
		{
			returnWithError($stmt->error);
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