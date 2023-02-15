<?php
$firstDigit = $_POST['first'];
$secondDigit = $_POST['second'];
$thirdDigit = $_POST['third'];

if ($firstDigit > $secondDigit & $firstDigit > $thirdDigit)
{
	echo "First Digit ".$firstDigit. " is Max..!";
}
else if ($secondDigit > $firstDigit & $secondDigit > $thirdDigit)
{
	echo "Second Digit ".$secondDigit. " is Max..!";
}
else
{
	echo "Third Digit ".$thirdDigit. " is Max..!";
}