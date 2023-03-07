<?php
//Retrieve name from query string and store to a local variable
@$name = $_POST['name'];
echo $name;

@$hobbies = $_POST['hobby'];
echo "<pre>";
print_r($hobbies);

?>