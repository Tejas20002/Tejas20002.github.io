<?php
$firstDigit = $_POST['first'];
$secondDigit = $_POST['second'];
$operator = $_POST['operator'];

if (is_numeric($firstDigit) && is_numeric($secondDigit))
{
	switch ($operator) {
		case 'Add':
			echo "Answer :".$firstDigit + $secondDigit;
			break;
		case 'Subtraction':
			echo "Answer :".$firstDigit - $secondDigit;
			break;
		case 'Multiplication':
			echo "Answer :".$firstDigit * $secondDigit;
			break;
		case 'Division':
			echo "Answer :".$firstDigit / $secondDigit;
			break;
		}
}
?>
<html>
<body>
	<br><a href="CalC.html">Back</a>
</body>
</html>
