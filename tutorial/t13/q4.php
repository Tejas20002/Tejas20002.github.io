<?php

class DBConnect {
    private $servername;
    private $username;
    private $password;
    private $dbname;
    private $conn;

    public function __construct($servername, $username, $password, $dbname) {
        $this->servername = $servername;
        $this->username = $username;
        $this->password = $password;
        $this->dbname = $dbname;
        $this->conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$this->conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
    }

    public function selectQuery($query) {
        $result = mysqli_query($this->conn, $query);
        if (!$result) {
            die("Query failed: " . mysqli_error($this->conn));
        }
        return $result;
    }

    public function displayData($result) {
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                echo "ID: " . $row["id"] . " - Name: " . $row["name"] . "<br>";
            }
        } else {
            echo "0 results";
        }
    }

    public function __destruct() {
        mysqli_close($this->conn);
    }
}

// Example usage
$db = new DBConnect("localhost", "root", "", "image_upload");
$result = $db->selectQuery("SELECT * FROM image");
$db->displayData($result);
?>