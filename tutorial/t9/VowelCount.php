<!DOCTYPE html>
<html>
<head>
	<title>Vowel Count</title>
</head>
<body>


<form method="post" action="">
	Enter any String: <input type="text" name="Sstring"><br>
	<input type="submit" name="Count" value="Count">

</form>

</body>
</html>
<?php
function vowelCount($string) {
  $vowels = ['a', 'e', 'i', 'o', 'u'];
  $count = 0;

  for ($i = 0; $i < strlen($string); $i++) {
    if (in_array($string[$i], $vowels)) {
      $count++;
    }
  }

  echo $count;
}
$string = $_POST['Sstring'];
vowelCount($string);
?>