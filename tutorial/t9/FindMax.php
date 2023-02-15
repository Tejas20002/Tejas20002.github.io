<?php


function findMax($num1, $num2, $num3) {
  return ($num1 > $num2) ? (($num1 > $num3) ? $num1 : $num3) : (($num2 > $num3) ? $num2 : $num3);
}

$n1 = $_POST['num1'];
$n2 = $_POST['num2'];
$n3 = $_POST['num3'];

echo findMax($n1, $n2, $n3); 
?>