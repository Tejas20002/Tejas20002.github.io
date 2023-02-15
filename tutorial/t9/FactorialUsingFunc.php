<?php
function Factorial($number){
    if($number <= 1){
        return 1;
    }
    else{
        return $number * Factorial($number - 1);
    }
}
 

$number = $_POST['number'];
$fact = Factorial($number);
echo "Factorial = $fact";
?>