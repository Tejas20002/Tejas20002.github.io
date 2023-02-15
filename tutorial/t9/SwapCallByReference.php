<?php
function swapNumbers(&$num1, &$num2) {
  $temp = $num1;
  $num1 = $num2;
  $num2 = $temp;
  echo "After swapping: num1 = " . $num1 . ", num2 = " . $num2;
}

// Example usage
$num1 = $_POST['num1'];
$num2 = $_POST['num2'];
echo "Before swapping: num1 = " . $num1 . ", num2 = " . $num2 . "<br>";
swapNumbers($num1, $num2);
?>