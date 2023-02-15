<?php
$n = $_POST['fib'];

$first = 0;
$second = 1;

echo $first;
echo "<br/>";
echo $second;
echo "<br/>";

for ($i = 2; $i < $n; $i++)
{
	$third = $first + $second;
	$first = $second;
	$second = $third;
	echo $third."<br>";
}

?>