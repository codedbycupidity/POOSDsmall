<?php
	$inData = getRequestInfo();
	
	// Get all parameters from the request
	$ID = $inData["ID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$userID = $inData["userID"];  // To verify the contact belongs to this user

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

		// Prepare update statement with security check (userID)
		$stmt = $conn->prepare("UPDATE UserContacts SET firstName=?, lastName=?, email=?, phoneNumber=? WHERE ID=? AND userID=?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $email, $phoneNumber, $ID, $userID);
		$stmt->execute();
		
		// Check if a row was actually updated
		if ($stmt->affected_rows > 0)
		{
			returnWithSuccess();
		}
		else
		{
			// No rows affected could mean the contact doesn't exist or doesn't belong to this user
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithSuccess()
	{
		$retValue = '{"success":true,"error":""}';
		sendResultInfoAsJson($retValue);
	}
?>