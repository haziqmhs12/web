<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// Start the session
session_start();

// Retrieve JSON data from POST request
$data = json_decode(file_get_contents('php://input'), true);

// Validate the received data
if (empty($data['title']) || empty($data['authors']) || empty($data['imageSrc']) || empty($data['summary']) || empty($data['rating']) || empty($data['userID'])) {
    http_response_code(400); // Set HTTP status code to 400 (Bad Request)
    echo json_encode(array('error' => 'Invalid input data'));
    exit(); // Stop further execution
}
include 'config.php'; // Include database connection

// Check if the book already exists in the books table
$stmt_check = $mysqli->prepare("SELECT id FROM books WHERE title = ? AND authors = ?");
$stmt_check->bind_param("ss", $data['title'], $data['authors']);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    // Book already exists, get its id
    $stmt_check->bind_result($bookId);
    $stmt_check->fetch();
} else {
    // Book doesn't exist, insert it into books table
    $stmt_insert_book = $mysqli->prepare("INSERT INTO books (title, authors, image_url) VALUES (?, ?, ?)");
    $stmt_insert_book->bind_param("sss", $data['title'], $data['authors'], $data['imageSrc']);
    $stmt_insert_book->execute();

    // Get the newly inserted book's id
    $bookId = $stmt_insert_book->insert_id;

    // Close the statement
    $stmt_insert_book->close();
}

// Insert into user_books table
$stmt_insert_user_book = $mysqli->prepare("INSERT INTO user_books (summary,rating,book_id, user_id) VALUES (?,?,?, ?)");
$stmt_insert_user_book->bind_param("siii",$data['summary'] ,$data['rating'] ,$bookId, $data['userID']);

if ($stmt_insert_user_book->execute()) {
    echo json_encode(array('message' => 'Data added successfully'));
} else {
    http_response_code(500);
    echo json_encode(array('error' => 'Execute failed: ' . $stmt_insert_user_book->error));
}

// Close connections
$stmt_check->close();
$stmt_insert_user_book->close();
$mysqli->close();
?>
