<?php
   $number = $_POST['digit'];
   $sum = 0;
   while($number>0)
   {
     $sum = $sum + $number % 10;
     $number /= 10;
   }
    echo"Sum Of Digits is = $sum";
?>